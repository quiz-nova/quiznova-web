import { computed, inject } from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@StoreFeatures/with-request-status.feature';
import { EMPTY, catchError, exhaustMap, tap, concatMap } from 'rxjs';

import { Question } from '@shared/models/quiz/question.model';
import { Quiz } from '@shared/models/quiz/quiz.model';
import { QuizService } from '@shared/services/quiz.service';

import { QuizMetadataValue } from '../shared/quiz-metadata-form';

export interface EditQuizState {
  quiz: Quiz | null;
  activeQuestionId: string | null;
}

const initialState: EditQuizState = {
  quiz: null,
  activeQuestionId: null,
};

export const EditQuizStore = signalStore(
  { providedIn: 'root' },
  withState<EditQuizState>(initialState),
  withRequestStatus(),
  withComputed((store) => ({
    quizId: computed(() => store.quiz()?.quizId ?? ''),
    questions: computed(() => store.quiz()?.questions ?? []),
    numberOfQuestions: computed(() => store.quiz()?.questions.length ?? 0),
    totalMarks: computed(() =>
      (store.quiz()?.questions ?? []).reduce((sum, question) => sum + question.marks, 0),
    ),
    metadata: computed<QuizMetadataValue | undefined>(() => {
      const quiz = store.quiz();
      if (!quiz) return undefined;
      return {
        title: quiz.title,
        courseId: quiz.courseId,
        startsAtUtc: new Date(quiz.startsAtUtc),
        endsAtUtc: new Date(quiz.endsAtUtc)
      };
    })
  })),
  withMethods((store, quizService = inject(QuizService)) => ({
    loadQuiz: rxMethod<{ quizId: string }>(
      exhaustMap(({ quizId }) => {
        patchState(store, setPending());
        return quizService.getQuizById(quizId).pipe(
          tap((quiz) => {
            patchState(store, { quiz, activeQuestionId: quiz.questions[0]?.id ?? null });
            patchState(store, setFulfilled());
          }),
          catchError(() => {
            patchState(store, setError('Failed to load quiz.'));
            return EMPTY;
          })
        );
      })
    ),

    setCurrentQuestionId(questionId: string): void {
      patchState(store, { activeQuestionId: questionId });
    },

    // --- Incremental Auto-Save Methods ---

    updateMetadata: rxMethod<QuizMetadataValue>(
      concatMap((metadata) => {
        const quizId = store.quizId();
        if (!quizId) return EMPTY;
        
        // Optimistically update UI
        patchState(store, (state) => ({
          quiz: state.quiz ? { 
            ...state.quiz, 
            title: metadata.title,
            courseId: metadata.courseId,
            startsAtUtc: metadata.startsAtUtc.toISOString(),
            endsAtUtc: metadata.endsAtUtc.toISOString()
          } : null
        }));

        return quizService.updateQuizMetadata(quizId, metadata).pipe(
          catchError((err) => {
            console.error('Failed to update metadata', err);
            // In a real app, we'd revert the optimistic update here
            return EMPTY;
          })
        );
      })
    ),

    addQuestion: rxMethod<Question>(
      concatMap((question) => {
        const quizId = store.quizId();
        if (!quizId) return EMPTY;

        return quizService.addQuestion(quizId, question).pipe(
          tap((savedQuestion) => {
            patchState(store, (state) => ({
              quiz: state.quiz ? {
                ...state.quiz,
                questions: [...state.quiz.questions, savedQuestion]
              } : null,
              activeQuestionId: savedQuestion.id
            }));
          }),
          catchError((err) => {
            console.error('Failed to add question', err);
            return EMPTY;
          })
        );
      })
    ),

    updateQuestion: rxMethod<Question>(
      concatMap((updatedQuestion) => {
        const quizId = store.quizId();
        if (!quizId) return EMPTY;

        // Optimistically update UI
        patchState(store, (state) => ({
          quiz: state.quiz ? {
            ...state.quiz,
            questions: state.quiz.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
          } : null
        }));

        return quizService.updateQuestion(quizId, updatedQuestion.id, updatedQuestion).pipe(
          catchError((err) => {
            console.error('Failed to update question', err);
            return EMPTY;
          })
        );
      })
    ),

    removeQuestion: rxMethod<string>(
      concatMap((questionId) => {
        const quizId = store.quizId();
        if (!quizId) return EMPTY;

        // Optimistically update UI
        patchState(store, (state) => {
          if (!state.quiz) return {};
          const filteredQuestions = state.quiz.questions.filter(q => q.id !== questionId);
          const nextActiveId = state.activeQuestionId === questionId ? (filteredQuestions[0]?.id ?? null) : state.activeQuestionId;
          
          return {
            quiz: { ...state.quiz, questions: filteredQuestions },
            activeQuestionId: nextActiveId
          };
        });

        return quizService.removeQuestion(quizId, questionId).pipe(
          catchError((err) => {
            console.error('Failed to remove question', err);
            return EMPTY;
          })
        );
      })
    )
  }))
);
