import { computed, inject, Injectable, signal, type Type } from '@angular/core';
import {
  Question,
  QUESTION_COMPONENT_MAP,
  QuestionComponent,
  QuestionType,
} from '../models/quiz/question.model';
import { Quiz } from '../models/quiz/quiz.model';
import { AuthService } from '../../auth/auth.service';
import { MultipleChoiceQuestion } from '../models/quiz/multiple-choice.model';

@Injectable({ providedIn: 'root' })
export class CreateQuizService {
  authService = inject(AuthService);
  private _quiz = signal<Quiz>({
    id: crypto.randomUUID(),
    title: '',
    courseId: '', // TODO The instructor must choose the course form the courses he teaches we will handle htis later
    instructorId: 'this.authService.currentUser().userId', // TODO we will set this to the current user id when we implement the authentication
    startsAtUtc: new Date(), // This Will be modified when the instructor submits the creation form
    endsAtUtc: new Date(),
    questions: [],
  });
  readonly quiz = this._quiz.asReadonly();

  numberOfQuestions = computed(() => this.quiz().questions.length);
  getSuitableQuestionComponent(questionType: QuestionType): Type<QuestionComponent> | null {
    return QUESTION_COMPONENT_MAP[questionType] || null;
  }
  totalMarks = computed(() =>
    this.quiz().questions.reduce((sum, question) => sum + question.marks, 0),
  );
  durationInMinutes = computed(() => {
    const { startsAtUtc, endsAtUtc } = this._quiz();
    const durationInMilliseconds = endsAtUtc.getTime() - startsAtUtc.getTime();
    return Math.ceil(durationInMilliseconds / (1000 * 60));
  });
  removeQuestion(question: Question): void {
    const currentQuiz = this._quiz();
    const updatedQuestions = currentQuiz.questions.filter((q) => q.id !== question.id);
    this._quiz.set({ ...currentQuiz, questions: updatedQuestions });
  }
  updateQuestionMarks(questionId: string, marks: number): void {
    this._quiz.update((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((question) =>
        question.id === questionId ? { ...question, marks } : question,
      ),
    }));
  }
  addChoiceToMultipleChoiceQuestion(questionId: string): void {
    this._quiz.update((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (question.id === questionId && question.type === QuestionType.MultipleChoice) {
          const multipleChoiceQuestion = question as MultipleChoiceQuestion;

          const newChoice = {
            id: crypto.randomUUID(),
            questionId,
            text: '',
          };
          return {
            ...question,
            choices: [...multipleChoiceQuestion.choices, newChoice],
            numberOfChoices: multipleChoiceQuestion.numberOfChoices + 1,
          };
        }
        return question;
      }),
    }));
  }
  updateNumberOfChoices(questionId: string, numberOfChoices: number): void {
    this._quiz.update((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (question.id === questionId && question.type === QuestionType.MultipleChoice) {
          return { ...question, numberOfChoices };
        }
        return question;
      }),
    }));
  }
  addQuestion(question: Question): void {
    const currentQuiz = this._quiz();
    this._quiz.set({ ...currentQuiz, questions: [...currentQuiz.questions, question] });
  }
  deleteChoiceFromMultipleChoiceQuestion(questionId: string, choiceId: string): void {
    this._quiz.update((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (question.id === questionId && question.type === QuestionType.MultipleChoice) {
          const multipleChoiceQuestion = question as MultipleChoiceQuestion;
          if (multipleChoiceQuestion.choices.length <= 2) {
            return question;
          }
          const updatedChoices = multipleChoiceQuestion.choices.filter(
            (choice) => choice.id !== choiceId,
          );
          return {
            ...question,
            choices: updatedChoices,
            numberOfChoices: multipleChoiceQuestion.numberOfChoices - 1,
          };
        }
        return question;
      }),
    }));
  }
}
