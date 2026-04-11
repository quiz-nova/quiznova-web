import { Question, QuestionType } from './question.model';

export interface Choice {
  id: string;
  questionId: string;
  text: string;
  displayOrder: number;
}

export interface MultipleChoiceQuestion extends Question {
  type: typeof QuestionType.MultipleChoice;
  numberOfChoices: number;
  correctChoiceId: string;
  choices: Choice[];
}
