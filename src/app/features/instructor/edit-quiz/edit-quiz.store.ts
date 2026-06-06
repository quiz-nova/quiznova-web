import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@StoreFeatures/with-request-status.feature';
import { EMPTY, catchError, exhaustMap, tap, concatMap, switchMap } from 'rxjs';

import { Question } from '@shared/models/quiz/question.model';
import { Quiz } from '@shared/models/quiz/quiz.model';
import { CoursesService } from '@shared/services/courses.service';
import { QuizService } from '@shared/services/quiz.service';
import { getApiErrorMessage } from '@shared/utils/utilities';

import { QuizMetadataValue } from '../shared/quiz-metadata-form';

export interface EditQuizState {
  quiz: Quiz | null;
  activeQuestionId: string | null;
  remainingMarks: number | null;
}

const initialState: EditQuizState = {
  quiz: null,
  activeQuestionId: null,
  remainingMarks: null,
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
    effectiveRemainingMarks: computed(() => {
      const rm = store.remainingMarks();
      if (rm === null) {
        return null;
      }
      return rm;
    }),
    canAddMoreQuestions: computed(() => {
      const rm = store.remainingMarks();
      if (rm === null) {
        return false;
      }
      return rm > 0;
    }),
    metadata: computed<QuizMetadataValue | undefined>(() => {
      const quiz = store.quiz();
      if (!quiz) return undefined;
      return {
        title: quiz.title,
        courseId: quiz.courseId,
        startsAtUtc: new Date(quiz.startsAtUtc),
        endsAtUtc: new Date(quiz.endsAtUtc),
      };
    }),
  })),
  withMethods(
    (store, quizService = inject(QuizService), coursesService = inject(CoursesService)) => ({
      loadQuiz: rxMethod<{ quizId: string }>(
        exhaustMap(({ quizId }) => {
          patchState(store, setPending('loadQuiz'));
          return quizService.getQuizById(quizId).pipe(
            switchMap((quiz) => {
              patchState(store, { quiz, activeQuestionId: quiz.questions[0]?.id ?? null });
              patchState(store, setFulfilled('loadQuiz'));

              return coursesService.getCourseById(quiz.courseId).pipe(
                tap((course) => {
                  patchState(store, { remainingMarks: course.remainingMarks });
                }),
                catchError((err) => {
                  console.error(getApiErrorMessage(err, 'Failed to fetch course details'));
                  return EMPTY;
                }),
              );
            }),
            catchError((err) => {
              patchState(store, setError('loadQuiz', getApiErrorMessage(err, 'Failed to load quiz.')));
              return EMPTY;
            }),
          );
        }),
      ),

      setCurrentQuestionId(questionId: string): void {
        patchState(store, { activeQuestionId: questionId });
      },

      updateMetadata: rxMethod<QuizMetadataValue>(
        concatMap((metadata) => {
          const quizId = store.quizId();
          if (!quizId) return EMPTY;

          // Optimistically update UI
          patchState(store, (state) => ({
            quiz: state.quiz
              ? {
                ...state.quiz,
                title: metadata.title,
                courseId: metadata.courseId,
                startsAtUtc: metadata.startsAtUtc.toISOString(),
                endsAtUtc: metadata.endsAtUtc.toISOString(),
              }
              : null,
          }));

          return quizService.updateQuizMetadata(quizId, metadata).pipe(
            catchError((err) => {
              console.error(getApiErrorMessage(err, 'Failed to update metadata'));
              // In a real app, we'd revert the optimistic update here
              return EMPTY;
            }),
          );
        }),
      ),

      updateCourseId: rxMethod<string>(
        concatMap((newCourseId) => {
          const quizId = store.quizId();
          if (!quizId) return EMPTY;

          return quizService.updateQuizCourseId(quizId, newCourseId).pipe(
            switchMap(() => {
              // After backend clears questions, update local state
              patchState(store, (state) => ({
                quiz: state.quiz
                  ? {
                    ...state.quiz,
                    courseId: newCourseId,
                    questions: [],
                  }
                  : null,
                activeQuestionId: null,
                remainingMarks: null,
              }));

              // Fetch new course's remaining marks
              return coursesService.getCourseById(newCourseId).pipe(
                tap((course) => {
                  patchState(store, { remainingMarks: course.remainingMarks });
                }),
                catchError((err) => {
                  console.error(getApiErrorMessage(err, 'Failed to fetch new course details'));
                  return EMPTY;
                }),
              );
            }),
            catchError((err) => {
              console.error(getApiErrorMessage(err, 'Failed to update course ID'));
              return EMPTY;
            }),
          );
        }),
      ),

      addQuestion: rxMethod<Question>(
        concatMap((question) => {
          const quizId = store.quizId();
          if (!quizId) return EMPTY;

          return quizService.addQuestion(quizId, question).pipe(
            tap((savedQuestion) => {
              patchState(store, (state) => ({
                quiz: state.quiz
                  ? {
                    ...state.quiz,
                    questions: [...state.quiz.questions, savedQuestion],
                  }
                  : null,
                activeQuestionId: savedQuestion.id,
              }));

              // Decrement remaining marks
              patchState(store, (state) => ({
                remainingMarks:
                  state.remainingMarks !== null ? state.remainingMarks - savedQuestion.marks : null,
              }));
            }),
            catchError((err) => {
              console.error(getApiErrorMessage(err, 'Failed to add question'));
              return EMPTY;
            }),
          );
        }),
      ),
      // TODO we want to think can we combine it with update question text or not
      updateQuestion: rxMethod<Question>(
        concatMap((updatedQuestion) => {
          const quizId = store.quizId();
          if (!quizId) return EMPTY;

          // Check marks change against remaining
          const currentQuestion = (store.quiz()?.questions ?? []).find(
            (q) => q.id === updatedQuestion.id,
          );
          if (currentQuestion && store.remainingMarks() !== null) {
            const marksDiff = updatedQuestion.marks - currentQuestion.marks;
            if (marksDiff > 0 && marksDiff > (store.remainingMarks() ?? 0)) {
              console.warn('Cannot increase marks beyond remaining.');
              return EMPTY;
            }
          }

          // Optimistically update UI
          const oldMarks = currentQuestion?.marks ?? 0;
          const marksDiff = updatedQuestion.marks - oldMarks;

          patchState(store, (state) => ({
            quiz: state.quiz
              ? {
                ...state.quiz,
                questions: state.quiz.questions.map((q) =>
                  q.id === updatedQuestion.id ? updatedQuestion : q,
                ),
              }
              : null,
            remainingMarks: state.remainingMarks !== null ? state.remainingMarks - marksDiff : null,
          }));

          return quizService.updateQuestion(quizId, updatedQuestion.id, updatedQuestion).pipe(
            catchError((err) => {
              console.error(getApiErrorMessage(err, 'Failed to update question'));
              return EMPTY;
            }),
          );
        }),
      ),

      updateQuestionText(questionId: string, questionText: string): void {
        // TODO we must call the backend to update the state there
        patchState(store, (state) => ({
          quiz: state.quiz
            ? {
              ...state.quiz,
              questions: state.quiz.questions.map((question) =>
                question.id === questionId ? { ...question, questionText } : question,
              ),
            }
            : null,
        }));
      },

      // concat map here because we do optimistic updates so we take all his deletes and one after another if we used exhaustMap he will feel the screen is frozen
      removeQuestion: rxMethod<string>(
        concatMap((questionId) => {
          const quizId = store.quizId();
          if (!quizId) return EMPTY;

          // Get the marks of the question being removed
          const removedQuestion = (store.quiz()?.questions ?? []).find((q) => q.id === questionId);
          const removedMarks = removedQuestion?.marks ?? 0;

          // Optimistically update UI
          patchState(
            store,
            (state) => {
              if (!state.quiz) return {};
              const filteredQuestions = state.quiz.questions.filter((q) => q.id !== questionId);
              const nextActiveId =
                state.activeQuestionId === questionId
                  ? (filteredQuestions[0]?.id ?? null)
                  : state.activeQuestionId;

              return {
                quiz: { ...state.quiz, questions: filteredQuestions },
                activeQuestionId: nextActiveId,
                remainingMarks:
                  state.remainingMarks !== null ? state.remainingMarks + removedMarks : null,
              };
            },
            setPending('removeQuestion'),
          );

          return quizService.removeQuestion(quizId, questionId).pipe(
            tap(() => patchState(store, setFulfilled('removeQuestion'))),
            catchError((err) => {
              // Revert optimistic update
              patchState(store, (state) => {
                if (!state.quiz || !removedQuestion) return {};
                return {
                  quiz: { ...state.quiz, questions: [...state.quiz.questions, removedQuestion] },
                  activeQuestionId: state.activeQuestionId === null ? (removedQuestion.id ?? null) : state.activeQuestionId,
                  remainingMarks: state.remainingMarks !== null ? state.remainingMarks - removedMarks : null,
                };
              });
              patchState(store, setError('removeQuestion', getApiErrorMessage(err, "Failed to remove question.")));
              return EMPTY;
            }),
          );
        }),
      ),
    }),
  ),
);
