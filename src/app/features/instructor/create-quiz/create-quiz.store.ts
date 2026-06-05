import { computed, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthService } from '@Features/auth/auth.service';
import { CreateQuiz } from '@Features/instructor/create-quiz/create-quiz.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withRequestStatus } from '@StoreFeatures/with-request-status.feature';

import { Question, QuestionType } from '@shared/models/quiz/question.model';
import { Choice, Mcq } from '@shared/models/quiz/questions/mcq.model';
import { CoursesService } from '@shared/services/courses.service';

const createInitialQuiz = (): CreateQuiz => ({
  title: '',
  courseId: '',
  instructorId: '',
  startsAtUtc: new Date(),
  endsAtUtc: new Date(),
  questions: [],
});

export interface CreateQuizState {
  quiz: CreateQuiz;
  registeredForms: FormGroup[];
  activeQuestionId: string | null;
  remainingMarks: number | null;
}

const initialState: CreateQuizState = {
  quiz: createInitialQuiz(),
  registeredForms: [],
  activeQuestionId: null,
  remainingMarks: null,
};


export const CreateQuizStore = signalStore(
  { providedIn: 'root' },
  withState<CreateQuizState>(initialState),
  withRequestStatus(),
  withComputed((store) => ({
    questions: computed(() => store.quiz().questions),
    numberOfQuestions: computed(() => store.quiz().questions.length),
    totalMarks: computed(() =>
      store.quiz().questions.reduce((sum, question) => sum + question.marks, 0),
    ),
  })),
  withComputed((store) => ({
    effectiveRemainingMarks: computed(() => {
      const rm = store.remainingMarks();
      if (rm === null) {
        return null;
      }
      return rm - store.totalMarks();
    }),
    canAddMoreQuestions: computed(() => {
      const rm = store.remainingMarks();
      if (rm === null) {
        return false;
      }
      return rm - store.totalMarks() > 0;
    }),
    isEntireQuizValid: computed(() => {
      const quiz = store.quiz();
      const forms = store.registeredForms();
      const starts = new Date(quiz.startsAtUtc).getTime();
      const ends = new Date(quiz.endsAtUtc).getTime();
      return (
        ends >= starts + 10 * 60 * 1000 && forms.every((f) => f.valid) && quiz.courseId !== ''
      );
    }),
  })),
  withMethods((store, coursesService = inject(CoursesService)) => ({
    setHeaderMetadata(payload: {
      title: string;
      courseId: string;
      startsAtUtc: Date;
      endsAtUtc: Date;
    }): void {
      patchState(store, (state) => ({
        quiz: {
          ...state.quiz,
          title: payload.title,
          courseId: payload.courseId,
          startsAtUtc: payload.startsAtUtc,
          endsAtUtc: payload.endsAtUtc,
        },
      }));
    },

    updateCourseId(courseId: string): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          courseId,
          questions: [],
        },
        activeQuestionId: null,
        remainingMarks: null,
      });

      coursesService.getCourseById(courseId).subscribe({
        next: (course) => {
          patchState(store, {
            remainingMarks: course.remainingMarks,
          });
        },
        error: (err) => {
          console.error('Failed to fetch course details', err);
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
      if (store.registeredForms().includes(form)) return;
      patchState(store, (state) => ({
        registeredForms: [...state.registeredForms, form],
      }));
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

    updateQuestion(updatedQuestion: Question): void {
      patchState(store, {
        quiz: {
          ...store.quiz(),
          questions: store
            .quiz()
            .questions.map((question) =>
              question.id === updatedQuestion.id ? updatedQuestion : question,
            ),
        },
      });
    },

    updateQuestionMarks(questionId: string, marks: number): void {
      const currentQuestion = store.quiz().questions.find((q) => q.id === questionId);
      if (!currentQuestion) {
        return;
      }
      if (marks < 0) {
        return;
      }
      const effectiveRemaining = store.effectiveRemainingMarks();
      if (effectiveRemaining !== null) {
        const marksDifference = marks - currentQuestion.marks;
        if (marksDifference > effectiveRemaining) {
          return;
        }
      }

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

            const mcq = question as Mcq;
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
            } as Mcq;
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

            const mcq = question as Mcq;
            if (mcq.choices.length <= 2) {
              return question;
            }

            const updatedChoices = mcq.choices.filter((choice: Choice) => choice.id !== choiceId);
            const isCorrectChoiceDeleted = mcq.correctChoiceId === choiceId;

            return {
              ...question,
              choices: updatedChoices,
              numberOfChoices: updatedChoices.length,
              correctChoiceId: isCorrectChoiceDeleted ? '' : mcq.correctChoiceId,
            } as Mcq;
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
        store.setInstructorId(currentUser.id);
      }
    },
  }),
);
