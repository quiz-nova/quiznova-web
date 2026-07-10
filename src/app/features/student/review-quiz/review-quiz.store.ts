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
import { Essay, isEssay } from '@shared/models/quiz/questions/essay.model';
import { isMcq, Mcq } from '@shared/models/quiz/questions/mcq.model';
import { isTf, Tf } from '@shared/models/quiz/questions/tf.model';
import { QuestionAnswer } from '@shared/models/quiz-attempt/question-answer.model';
import { QuizAttempt } from '@shared/models/quiz-attempt/quiz-attempt.model';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';
import { getApiErrorMessage } from '@shared/utils/utilities';

type ReviewQuestion = Mcq | Tf | Essay;
type MaybeOriginalQuestionAnswer = QuestionAnswer & { originalQuestionId?: string };

export interface QuestionReviewItem {
  question: ReviewQuestion;
  answer: QuestionAnswer | null;
}

interface ReviewQuizState {
  studentId: string;
  quizAttempt: QuizAttempt | null;
  answerMap: Map<string, QuestionAnswer>;
}

const initialState: ReviewQuizState = {
  studentId: '',
  quizAttempt: null,
  answerMap: new Map<string, QuestionAnswer>(),
};

function getAnswerQuestionId(answer: QuestionAnswer): string {
  const value = answer as MaybeOriginalQuestionAnswer;
  return value.originalQuestionId ?? answer.questionId;
}

function createAnswerMap(answers: QuestionAnswer[]): Map<string, QuestionAnswer> {
  const map = new Map<string, QuestionAnswer>();
  for (const answer of answers) {
    map.set(getAnswerQuestionId(answer), answer);
  }

  return map;
}

function getElapsedMinutes(
  startedAt: Date | string,
  submittedAt: Date | string | null,
): number | null {
  if (!submittedAt) {
    return null;
  }

  const startedMs = new Date(startedAt).getTime();
  const submittedMs = new Date(submittedAt).getTime();

  if (Number.isNaN(startedMs) || Number.isNaN(submittedMs)) {
    return null;
  }

  return Math.max(0, Math.round((submittedMs - startedMs) / 60000));
}

function formatElapsedMinutes(value: number | null): string {
  if (value === null) {
    return '--';
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} min`;
}

export const ReviewQuizStore = signalStore(
  { providedIn: 'root' },
  withState<ReviewQuizState>(initialState),
  withRequestStatus(),
  withMethods((store) => {
    const quizAttemptService = inject(QuizAttemptService);

    return {
      setStudentId(studentId: string): void {
        patchState(store, { studentId });
      },
      load: rxMethod<{ attemptId: string }>(
        exhaustMap(({ attemptId }) => {
          const studentId = store.studentId();
          if (!studentId) {
            patchState(store, setError('load', 'Student is not authenticated.'));
            return EMPTY;
          }

          patchState(store, setPending('load'));

          return quizAttemptService.getQuizAttemptById(studentId, attemptId).pipe(
            tap((quizAttempt) => {
              patchState(store, {
                quizAttempt,
                answerMap: createAnswerMap(quizAttempt.answers),
              });
              patchState(store, setFulfilled('load'));
            }),
            catchError((err) => {
              patchState(
                store,
                setError('load', getApiErrorMessage(err, 'Failed to load quiz attempt.')),
              );
              return EMPTY;
            }),
          );
        }),
      ),
    };
  }),
  withComputed((store) => ({
    questionReviewItems: computed<QuestionReviewItem[]>(() => {
      const answerMap = store.answerMap();
      const questions = store.quizAttempt()?.questions ?? [];
      const reviewQuestions = questions.filter((question: Question): question is ReviewQuestion => {
        return isMcq(question) || isTf(question) || isEssay(question);
      });

      return reviewQuestions.map((question) => ({
        question,
        answer: answerMap.get(question.id) ?? null,
      }));
    }),
    scorePercentage: computed(() => {
      const attempt = store.quizAttempt();
      if (!attempt || attempt.totalMarks <= 0) {
        return 0;
      }

      return Math.round((attempt.score / attempt.totalMarks) * 100);
    }),
    incorrectAnswers: computed(() => {
      const attempt = store.quizAttempt();
      if (!attempt) {
        return 0;
      }

      return Math.max(0, attempt.answeredQuestions - attempt.correctAnswers);
    }),
    elapsedMinutesLabel: computed(() => {
      const attempt = store.quizAttempt();
      if (!attempt) {
        return '--';
      }

      return formatElapsedMinutes(getElapsedMinutes(attempt.startedAt, attempt.submittedAt));
    }),
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
