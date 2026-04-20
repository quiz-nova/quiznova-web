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
import {QuizAttemptService} from '../../../shared/services/quiz-attempt.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus
} from '../../../../store-features/with-request-status.feature';
import {EMPTY, catchError, exhaustMap, tap} from 'rxjs';
import {QuestionAnswer} from '../../../shared/models/quiz-attempt/question-answer.model';

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
  questionAttempts: QuestionAnswer[];
  currentQuestionIndex: number;
}

export interface QuestionAttempt {
  questionId: string;
  type: QuestionType;
}


const initialState: QuizAttemptState = {
  quizAttemptId: crypto.randomUUID(),
  quizId: '',
  studentId: '',
  quizQuestions: [],
  questionAttempts: [],
  currentQuestionIndex: 0,
};

function isAnswerSolved(answer: QuestionAnswer): boolean {
  switch (answer.type) {
    case QuestionType.Mcq:
      return answer.selectedChoiceId.trim().length > 0;
    case QuestionType.TrueFalse:
      return true;
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
    const quizAttemptService = inject(QuizAttemptService);
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
              patchState(store, setError("Error Occured When we try to submit yout quiz")); // TODO we well modify this to be alliend with the backend error messages
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
      submitAnswer(answer: QuestionAnswer): void {
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
