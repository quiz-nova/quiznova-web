import { Question, QuestionType } from './question.model';

export interface Choice {
  id: string;
  questionId: string;
  text: string;
  displayOrder: number;
}

export interface MCQ extends Question {
  type: typeof QuestionType.Mcq;
  numberOfChoices: number;
  correctChoiceId: string;
  choices: Choice[];
}
