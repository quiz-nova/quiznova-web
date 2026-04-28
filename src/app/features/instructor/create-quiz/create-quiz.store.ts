import { computed, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthService } from '@Features/auth/auth.service';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { Choice, MCQ } from '@shared/models/quiz/mcq.model';
import { Question, QuestionType } from '@shared/models/quiz/question.model';
import { Quiz } from '@shared/models/quiz/quiz.model';


const createInitialQuiz = (): Quiz => ({
  id: crypto.randomUUID(),
  title: '',
  courseId: '',
  instructorId: '',
  startsAtUtc: new Date(),
  endsAtUtc: new Date(),
  questions: [],
});

export interface CreateQuizState {
  quiz: Quiz;
  registeredForms: FormGroup[];
  loading: boolean;
  error: string | null;
  activeQuestionId: string | null;
}

const initialState: CreateQuizState = {
  quiz: createInitialQuiz(),
  registeredForms: [],
  loading: false,
  error: null,
  activeQuestionId: null,
};

export const CreateQuizStore = signalStore(
  { providedIn: 'root' },
  withState<CreateQuizState>(initialState),
  withComputed((store) => ({
    quizId: computed(() => store.quiz().id),
    questions: computed(() => store.quiz().questions),
    numberOfQuestions: computed(() => store.quiz().questions.length),
    totalMarks: computed(() =>
      store.quiz().questions.reduce((sum, question) => sum + question.marks, 0),
    ),
    isEntireQuizValid: computed(() => store.registeredForms().every((form) => form.valid)),
  })),
  withMethods((store) => ({
    setHeaderMetadata(payload: {
      title: string;
      courseId: string;
      startsAtUtc: Date;
      endsAtUtc: Date;
    }): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          title: payload.title,
          courseId: payload.courseId,
          startsAtUtc: payload.startsAtUtc,
          endsAtUtc: payload.endsAtUtc,
        },
      });
    },

    setInstructorId(instructorId: string): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          instructorId,
        },
      });
    },

    registerForm(form: FormGroup): void {
      patchState(store, {
        registeredForms: [...store.registeredForms(), form],
      });
    },

    unregisterForm(form: FormGroup): void {
      patchState(store, {
        registeredForms: store.registeredForms().filter((existingForm) => existingForm !== form),
      });
    },

    addQuestion(question: Question): void {
      const updatedQuestions = [...store.quiz().questions, question];
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: updatedQuestions,
        },
        activeQuestionId: question.id,
      });
    },

    removeQuestion(questionId: string): void {
      const updatedQuestions = store
        .quiz()
        .questions.filter((question) => question.id !== questionId);
      const nextActiveQuestionId =
        store.activeQuestionId() === questionId
          ? (updatedQuestions[0]?.id ?? null)
          : store.activeQuestionId();

      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: updatedQuestions,
        },
        activeQuestionId: nextActiveQuestionId,
      });
    },

    updateQuestionMarks(questionId: string, marks: number): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: store
            .quiz()
            .questions.map((question) =>
              question.id === questionId ? { ...question, marks } : question,
            ),
        },
      });
    },

    updateQuestionText(questionId: string, questionText: string): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: store
            .quiz()
            .questions.map((question) =>
              question.id === questionId ? { ...question, questionText } : question,
            ),
        },
      });
    },

    addChoiceToMcq(questionId: string): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: store.quiz().questions.map((question) => {
            if (question.id !== questionId || question.type !== QuestionType.Mcq) {
              return question;
            }

            const mcq = question as MCQ;
            const newChoice = {
              id: crypto.randomUUID(),
              questionId,
              text: '',
              displayOrder: mcq.choices.length + 1,
            };

            return {
              ...question,
              choices: [...mcq.choices, newChoice],
              numberOfChoices: mcq.numberOfChoices + 1,
            } as MCQ;
          }),
        },
      });
    },

    deleteChoiceFromMcq(questionId: string, choiceId: string): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: store.quiz().questions.map((question) => {
            if (question.id !== questionId || question.type !== QuestionType.Mcq) {
              return question;
            }

            const mcq = question as MCQ;
            if (mcq.choices.length <= 2) {
              return question;
            }

            const updatedChoices = mcq.choices.filter((choice: Choice) => choice.id !== choiceId);
            return {
              ...question,
              choices: updatedChoices,
              numberOfChoices: updatedChoices.length,
            } as MCQ;
          }),
        },
      });
    },

    updateNumberOfChoices(questionId: string, numberOfChoices: number): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: store.quiz().questions.map((question) => {
            if (question.id !== questionId || question.type !== QuestionType.Mcq) {
              return question;
            }

            return {
              ...question,
              numberOfChoices,
            } as MCQ;
          }),
        },
      });
    },

    validateAll(): boolean {
      store.registeredForms().forEach((form) => {
        form.markAllAsTouched();
        form.updateValueAndValidity();
      });

      return store.isEntireQuizValid();
    },

    resetDraft(): void {
      patchState(store, {
        quiz: createInitialQuiz(),
        registeredForms: [],
        loading: false,
        error: null,
        activeQuestionId: null,
      });
    },

    setCurrentQuestionId(questionId: string): void {
      patchState(store, {
        activeQuestionId: questionId,
      });
    },

    getQuestionByIndex(index: number): Question {
      return store.quiz().questions[index];
    },
  })),
  withHooks({
    onInit(store) {
      const authService = inject(AuthService);
      const currentUser = authService.currentUser();
      if (currentUser) {
        store.setInstructorId(currentUser.userId);
      }
    },
  }),
);
