import { computed, inject, effect } from '@angular/core';

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
import { getApiErrorMessage } from '@shared/utils/utilities';

import { SubmitQuizAttempt, SubmitQuestionAnswerType } from './models/SubmitQuizAttempt.model';

export interface QuestionWithStatus extends Question {
  isSolved: boolean;
  isFlagged: boolean;
}

export interface QuizAttemptState {
  quizId: string;
  studentId: string;
  quizTitle: string;
  quizQuestions: QuestionWithStatus[];
  questionAttempts: SubmitQuestionAnswerType[];
  currentQuestionIndex: number;
  endsUtc: Date | null;
  serverUtc: Date | null;
  startedAt: Date | null;
}
const initialState: QuizAttemptState = {
  quizId: '',
  studentId: '',
  quizTitle: '',
  quizQuestions: [],
  questionAttempts: [],
  currentQuestionIndex: 0,
  endsUtc: null,
  serverUtc: null,
  startedAt: null,
};

export const QuizAttemptStore = signalStore(
  withState<QuizAttemptState>(initialState),
  withRequestStatus(),
  withComputed((store) => ({
    remaningSeconds: computed(() => {
      const endsUtc = store.endsUtc();
      const serverUtc = store.serverUtc();
      if (!endsUtc || !serverUtc) return 0;
      return Math.floor((endsUtc.getTime() - serverUtc.getTime()) / 1000);
    }),
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
  withComputed((store) => ({
    quizTimeOut: computed(() => store.remaningSeconds() <= 0),
  })),
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
                quizTitle: quiz.title,
                quizQuestions: questions,
                questionAttempts: [],
                quizId: quiz.quizId,
                currentQuestionIndex: 0,
                startedAt: new Date(),
                endsUtc: new Date(quiz.endsAtUtc),
                serverUtc: new Date(quiz.serverUtc),
              });
              patchState(store, setFulfilled('load'));
            }),
            catchError((err) => {
              const errorMessage = getApiErrorMessage(
                err,
                'Error occurred when we tried to load your quiz',
              );
              patchState(store, setError('load', errorMessage));
              return EMPTY;
            }),
          );
        }),
      ),
      _setStudentId(studentId: string): void {
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
        if (store.quizTimeOut()) {
          return;
        }

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
      _submitQuiz(): void {
        if (store.isPending()('submit') || store.isFulfilled()('submit')) {
          return;
        }

        const studentId = store.studentId();
        const request: SubmitQuizAttempt = {
          quizId: store.quizId(),
          startedAt: store.startedAt()!.toISOString(),
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
            catchError((err) => {
              const errorMessage = getApiErrorMessage(err, 'Error occurred during submission');
              patchState(store, setError('submit', errorMessage));
              return EMPTY;
            }),
          )
          .subscribe();
      },
      SubmitQuiz(): void {
        if (store.quizTimeOut()) {
          return;
        }
        this._submitQuiz();
      },
    };
  }),
  withHooks((store) => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    effect(
      () => {
        const isTimeout = store.quizTimeOut();
        const serverUtc = store.serverUtc();
        if (serverUtc && isTimeout) {
          store._submitQuiz();
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      },
      { allowSignalWrites: true },
    );

    return {
      onInit(): void {
        const authService = inject(AuthService);
        const currentUser = authService.currentUser();
        if (currentUser) {
          store._setStudentId(currentUser.id);
        }

        intervalId = setInterval(() => {
          const serverUtc = store.serverUtc();
          if (serverUtc) {
            patchState(store, {
              serverUtc: new Date(serverUtc.getTime() + 1000),
            });
          }
        }, 1000);
      },
      onDestroy(): void {
        if (intervalId) {
          clearInterval(intervalId);
        }
      },
    };
  }),
);
