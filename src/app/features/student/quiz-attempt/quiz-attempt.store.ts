import {computed, inject} from '@angular/core';
import {Question, QuestionType} from '../../../shared/models/quiz/question.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {AuthService} from '../../auth/auth.service';
import {QuizService} from '../../../shared/services/quiz.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus
} from '../../../../store-features/with-request-status.feature';
import {EMPTY, catchError, exhaustMap, tap} from 'rxjs';

export interface QuestionWithStatus {
  id: string;
  quizId: string;
  questionText: string;
  marks: number;
  type: QuestionType;
  isSolved: boolean;
  isFlagged: boolean;
}

export interface QuizAttemptState {
  quizAttemptId: string;
  quizId: string;
  studentId: string;
  quizQuestions: QuestionWithStatus[];
  questionAttempts: QuestionAttempt[];
  currentQuestionIndex: number;
}

export interface QuestionAttempt {
  questionId: string;
  type: QuestionType;
}

export interface McqAttemptModel extends QuestionAttempt {
  type: typeof QuestionType.MultipleChoice;
  selectedChoiceId: string;
}

export interface TrueFalseAttemptModel extends QuestionAttempt {
  type: typeof QuestionType.TrueFalse;
  selectedValue: boolean;
}

export interface EssayAttemptModel extends QuestionAttempt {
  type: typeof QuestionType.Essay;
  responseText: string;
}

type AttemptModel = McqAttemptModel | TrueFalseAttemptModel | EssayAttemptModel;

const initialState: QuizAttemptState = {
  quizAttemptId: crypto.randomUUID(),
  quizId: '',
  studentId: '',
  quizQuestions: [],
  questionAttempts: [],
  currentQuestionIndex: 0,
};

function getBackendErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const backendError = (error as { error?: unknown }).error;
    if (typeof backendError === 'string' && backendError.trim()) {
      return backendError;
    }

    if (
      typeof backendError === 'object' &&
      backendError !== null &&
      'message' in backendError &&
      typeof (backendError as { message?: unknown }).message === 'string'
    ) {
      return (backendError as { message: string }).message;
    }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'Failed to load quiz.';
}

function isAnswerSolved(answer: AttemptModel): boolean {
  switch (answer.type) {
    case QuestionType.MultipleChoice:
      return answer.selectedChoiceId.trim().length > 0;
    case QuestionType.TrueFalse:
      return true;
    case QuestionType.Essay:
      return answer.responseText.trim().length > 0;
    default:
      return false;
  }
}

export const QuizAttemptStore = signalStore(
  {providedIn: 'root'},
  withState<QuizAttemptState>(initialState),
  withRequestStatus(),
  withMethods((store) => {
    const quizService = inject(QuizService);
    const toQuestionWithStatus = (question: Question): QuestionWithStatus => ({
      ...question,
      isFlagged: false,
      isSolved: false,
    });

    return {
      toQuestionWithStatus,
      load: rxMethod<{ quizId: string }>(
        exhaustMap(({quizId}) => {
          patchState(store, setPending());

          return quizService.getQuizById(quizId).pipe(
            tap((quiz) => {
              const questions = quiz.questions.map(toQuestionWithStatus);
              patchState(store, {
                quizQuestions: questions,
                questionAttempts: [],
                quizId: quiz.id,
                currentQuestionIndex: 0,
              });
              patchState(store, setFulfilled());
            }),
            catchError((error: unknown) => {
              patchState(store, setError(getBackendErrorMessage(error))); // TODO we well modify this to be alliend with the backend error messages
              return EMPTY;
            }),
          );
        }),
      ),
      setStudentId(studentId: string): void {
        patchState(store, {studentId});
      },
      setCurrentQuestionIndex(index: number): void {
        patchState(store, {currentQuestionIndex: index});
      },
      changeFlagStatusForTheCurrentQuestion(): void {
        patchState(store, (state) => {
          const questions = [...state.quizQuestions];
          const currentQuestion = questions[state.currentQuestionIndex];
          if (currentQuestion) {
            currentQuestion.isFlagged = !currentQuestion.isFlagged;
          }
          return {quizQuestions: questions};
        });
      },
      isCurrentQuestionFlagged(): boolean {
        const currentQuestion = store.quizQuestions()[store.currentQuestionIndex()];
        return currentQuestion ? currentQuestion.isFlagged : false;
      },
      submitAnswer(answer: AttemptModel): void {
        patchState(store, (state) => {
          const solved = isAnswerSolved(answer);

          const exists = state.questionAttempts.some(
            (q) => q.questionId === answer.questionId,
          );
          // if he submits the answer before we update it else we add it to the list of attempts
          const updatedAttempts = exists
            ? state.questionAttempts.map((q) =>
              q.questionId === answer.questionId
                ? answer
                : q,
            )
            : [
              ...state.questionAttempts,
              answer,
            ];
           // Update the isSolved to reactivity in the ui specially in the question navigator
          const updatedQuestions = state.quizQuestions.map((question) =>
            question.id === answer.questionId
              ? {...question, isSolved: solved}
              : question,
          );

          return {
            questionAttempts: updatedAttempts,
            quizQuestions: updatedQuestions,
          };
        });
      },
      SubmitQuiz(): void {
        // TODO: hook this to the backend submit-quiz-attempt endpoint.
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
        store.setStudentId(currentUser.userId);
      }
    },
  })),
);
