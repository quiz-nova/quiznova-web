import { computed, inject } from '@angular/core';

import { AuthService } from '@Features/auth/auth.service';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
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
import { EMPTY, catchError, exhaustMap, tap } from 'rxjs';

import { Question } from '@shared/models/quiz/question.model';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';
import { QuizService } from '@shared/services/quiz.service';

import {
  SubmitQuizAttempt,
  SubmitQuestionAnswerType,
} from './models/SubmitQuizAttempt.model';

export interface QuestionWithStatus extends Question {
  isSolved: boolean;
  isFlagged: boolean;
}

export interface QuizAttemptState {
  quizId: string;
  studentId: string;
  quizQuestions: QuestionWithStatus[];
  questionAttempts: SubmitQuestionAnswerType[];
  currentQuestionIndex: number;
}
const initialState: QuizAttemptState = {
  quizId: '',
  studentId: '',
  quizQuestions: [],
  questionAttempts: [],
  currentQuestionIndex: 0,
};


export const QuizAttemptStore = signalStore(
  { providedIn: 'root' },
  withState<QuizAttemptState>(initialState),
  withRequestStatus(),
  withMethods((store) => {
    const quizService = inject(QuizService);
    const quizAttemptService = inject(QuizAttemptService);
    const toQuestionWithStatus = (question: Question): QuestionWithStatus => ({
      ...question,
      isFlagged: false,
      isSolved: false,
    });

    return {
      toQuestionWithStatus,
      load: rxMethod<{ quizId: string }>(
        exhaustMap(({ quizId }) => {
          patchState(store, setPending('load'));

          return quizService.getQuizById(quizId).pipe(
            tap((quiz) => {
              const questions = quiz.questions.map(toQuestionWithStatus);
              patchState(store, {
                quizQuestions: questions,
                questionAttempts: [],
                quizId: quiz.quizId,
                currentQuestionIndex: 0,
              });
              patchState(store, setFulfilled('load'));
            }),
            catchError(() => {
              patchState(store, setError('load', 'Error Occurred When we try to submit your quiz')); // TODO we well modify this to be aligned with the backend error messages
              return EMPTY;
            }),
          );
        }),
      ),
      setStudentId(studentId: string): void {
        patchState(store, { studentId });
      },
      setCurrentQuestionIndex(index: number): void {
        patchState(store, { currentQuestionIndex: index });
      },
      changeFlagStatusForTheCurrentQuestion(): void {
        patchState(store, (state) => {
          const questions = [...state.quizQuestions];
          const currentQuestion = questions[state.currentQuestionIndex];
          if (currentQuestion) {
            currentQuestion.isFlagged = !currentQuestion.isFlagged;
          }
          return { quizQuestions: questions };
        });
      },
      isCurrentQuestionFlagged(): boolean {
        const currentQuestion = store.quizQuestions()[store.currentQuestionIndex()];
        return currentQuestion ? currentQuestion.isFlagged : false;
      },
      submitAnswer(answer: SubmitQuestionAnswerType): void {
        patchState(store, (state) => {
          const solved = true;

          const exists = state.questionAttempts.some((q) => q.questionId === answer.questionId);
          // if he submits the answer before we update it else, we add it to the list of attempts
          const updatedAttempts = exists
            ? state.questionAttempts.map((q) => (q.questionId === answer.questionId ? answer : q))
            : [...state.questionAttempts, answer];
          // Update the isSolved to reactivity in the ui specially in the question navigator
          const updatedQuestions = state.quizQuestions.map((question) =>
            question.id === answer.questionId ? { ...question, isSolved: solved } : question,
          );

          return {
            questionAttempts: updatedAttempts,
            quizQuestions: updatedQuestions,
          };
        });
      },
      SubmitQuiz(): void {
        const studentId = store.studentId();
        const request: SubmitQuizAttempt = {
          quizId: store.quizId(),
          startedAt: new Date().toISOString(), // Track from start in real implementation
          submittedAt: new Date().toISOString(),
          questionAnswers: store.questionAttempts(),
        };

        patchState(store, setPending('submit'));
        quizAttemptService
          .createQuizAttempt(studentId, request)
          .pipe(
            tap(() => {
              patchState(store, setFulfilled('submit'));
            }),
            catchError(() => {
              patchState(store, setError('submit', 'Error occurred during submission'));
              return EMPTY;
            }),
          )
          .subscribe();
      },
    };
  }),
  withComputed((store) => ({
    numberOfQuestions: computed(() => store.quizQuestions().length),
    currentQuestion: computed(() => {
      const questions = store.quizQuestions();
      const currentIndex = store.currentQuestionIndex();
      return questions[currentIndex];
    }),
    numberOfSolvedQuestions: computed(() => {
      return store.quizQuestions().filter((q) => q.isSolved).length;
    }),
    canGoPrevious: computed(() => store.currentQuestionIndex() > 0),
    canGoNext: computed(() => store.currentQuestionIndex() < store.quizQuestions().length - 1),
  })),
  withHooks((store) => ({
    onInit(): void {
      const authService = inject(AuthService);
      const currentUser = authService.currentUser();
      if (currentUser) {
        store.setStudentId(currentUser.id);
      }
    },
  })),
);
