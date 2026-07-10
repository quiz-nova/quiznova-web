import { computed, effect, inject } from '@angular/core';

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
import { EMPTY, catchError, exhaustMap, of, switchMap, tap } from 'rxjs';

import { Question } from '@shared/models/quiz/question.model';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';
import { QuizService } from '@shared/services/quiz.service';
import { getApiErrorMessage } from '@shared/utils/utilities';

import { SubmitQuestionAnswerType } from './models/SubmitQuizAttempt.model';

export interface QuestionWithStatus extends Question {
  isSolved: boolean;
  isFlagged: boolean;
}

export interface QuizAttemptState {
  attemptId: string | null;
  quizId: string;
  quizTitle: string;
  quizQuestions: QuestionWithStatus[];
  questionAttempts: SubmitQuestionAnswerType[];
  currentAnswerDraft: SubmitQuestionAnswerType | null;
  currentQuestionIndex: number;
  endsUtc: Date | null;
  serverUtc: Date | null;
  startedAt: Date | null;
  lastSavedAt: number | null;
}
const initialState: QuizAttemptState = {
  attemptId: null,
  quizId: '',
  quizTitle: '',
  quizQuestions: [],
  questionAttempts: [],
  currentAnswerDraft: null,
  currentQuestionIndex: 0,
  endsUtc: null,
  serverUtc: null,
  startedAt: null,
  lastSavedAt: null,
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
      load: rxMethod<{ quizId: string; attemptId?: string | null }>(
        switchMap(({ quizId, attemptId }) => {
          patchState(store, setPending('load'));

          const loadQuiz$ = quizService.getQuizById(quizId).pipe(
            tap((quiz) => {
              patchState(store, {
                quizTitle: quiz.title,
                quizQuestions: quiz.questions.map(toQuestionWithStatus),
                quizId: quiz.quizId,
                currentQuestionIndex: 0,
                endsUtc: new Date(quiz.endsAtUtc),
                serverUtc: new Date(quiz.serverUtc),
              });
            }),
          );

          if (attemptId) {
            return quizAttemptService.getQuizAttemptForResume(attemptId).pipe(
              switchMap((attempt) => {
                patchState(store, {
                  attemptId: attempt.quizAttemptId,
                  startedAt: new Date(attempt.startedAt),
                });

                const solvedMap = new Map(attempt.answers.map((a) => [a.questionId, true]));

                return loadQuiz$.pipe(
                  tap(() => {
                    patchState(store, (state) => ({
                      quizQuestions: state.quizQuestions.map((q) => ({
                        ...q,
                        isSolved: solvedMap.has(q.id) || q.isSolved,
                      })),
                    }));
                    patchState(store, setFulfilled('load'));
                  }),
                );
              }),
              catchError((err) => {
                const errorMessage = getApiErrorMessage(
                  err,
                  'Error occurred when we tried to resume your quiz',
                );
                patchState(store, setError('load', errorMessage));
                return EMPTY;
              }),
            );
          }

          return loadQuiz$.pipe(
            switchMap(() =>
              quizAttemptService.startQuizAttempt({ quizId: store.quizId() }).pipe(
                tap((attempt) => {
                  patchState(store, {
                    attemptId: attempt.quizAttemptId,
                    startedAt: new Date(attempt.startedAt),
                  });
                  patchState(store, setFulfilled('load'));
                }),
                catchError((err) => {
                  const errorMessage = getApiErrorMessage(
                    err,
                    'Error occurred when we tried to start your quiz attempt',
                  );
                  patchState(store, setError('load', errorMessage));
                  return EMPTY;
                }),
              ),
            ),
          );
        }),
      ),
      startAttempt: rxMethod<void>(
        exhaustMap(() => {
          if (store.attemptId()) {
            return of(null);
          }

          const quizId = store.quizId();
          if (!quizId) {
            return of(null);
          }

          patchState(store, setPending('start'));

          return quizAttemptService.startQuizAttempt({ quizId }).pipe(
            tap((attempt) => {
              patchState(store, {
                attemptId: attempt.quizAttemptId,
                startedAt: new Date(attempt.startedAt),
              });
              patchState(store, setFulfilled('start'));
            }),
            catchError((err) => {
              const errorMessage = getApiErrorMessage(
                err,
                'Error occurred when starting the attempt',
              );
              patchState(store, setError('start', errorMessage));
              return EMPTY;
            }),
          );
        }),
      ),
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
      setCurrentAnswerDraft(answer: SubmitQuestionAnswerType): void {
        patchState(store, { currentAnswerDraft: answer });
      },

      saveCurrentAnswer(): void {
        const draft = store.currentAnswerDraft();
        if (!draft || store.quizTimeOut()) {
          return;
        }

        const attemptId = store.attemptId();
        if (!attemptId) {
          return;
        }

        patchState(store, setPending('submit-answer'));

        const previousQuestions = store.quizQuestions();
        const previousAttempts = store.questionAttempts();

        patchState(store, (state) => {
          const exists = state.questionAttempts.some((q) => q.questionId === draft.questionId);
          const updatedAttempts = exists
            ? state.questionAttempts.map((q) => (q.questionId === draft.questionId ? draft : q))
            : [...state.questionAttempts, draft];
          const updatedQuestions = state.quizQuestions.map((question) =>
            question.id === draft.questionId ? { ...question, isSolved: true } : question,
          );

          return {
            questionAttempts: updatedAttempts,
            quizQuestions: updatedQuestions,
          };
        });

        quizAttemptService
          .submitQuestionAnswer(attemptId, draft)
          .pipe(
            tap(() => {
              patchState(store, setFulfilled('submit-answer'));
              patchState(store, { lastSavedAt: Date.now() });
            }),
            catchError((err) => {
              const errorMessage = getApiErrorMessage(err, 'Error occurred when saving the answer');
              patchState(store, setError('submit-answer', errorMessage));
              patchState(store, {
                quizQuestions: previousQuestions,
                questionAttempts: previousAttempts,
              });
              return EMPTY;
            }),
          )
          .subscribe();
      },
      completeAttempt(): void {
        const attemptId = store.attemptId();
        if (!attemptId) {
          return;
        }

        if (store.isPending()('submit') || store.isFulfilled()('submit')) {
          return;
        }

        patchState(store, setPending('submit'));

        quizAttemptService
          .completeQuizAttempt(attemptId, { submittedAt: new Date().toISOString() })
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
      GoToPreviousQuestion(): void {
        if (store.currentQuestionIndex() > 0) {
          patchState(store, { currentQuestionIndex: store.currentQuestionIndex() - 1 });
        }
      },
      GoToNextQuestion(): void {
        if (store.currentQuestionIndex() < store.numberOfQuestions() - 1) {
          patchState(store, { currentQuestionIndex: store.currentQuestionIndex() + 1 });
        }
      },
    };
  }),
  withHooks((store) => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    effect(() => {
      if (store.isFulfilled()('load') && !store.attemptId() && store.quizId()) {
        store.startAttempt();
      }
    });

    effect(() => {
      const isTimeout = store.quizTimeOut();
      const serverUtc = store.serverUtc();
      if (serverUtc && isTimeout && store.attemptId()) {
        store.completeAttempt();
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    });

    return {
      onInit(): void {
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
