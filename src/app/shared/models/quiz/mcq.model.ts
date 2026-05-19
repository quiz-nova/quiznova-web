import { Question, QuestionType } from '@shared/models/quiz/question.model';

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

export function isMcq(question: Question): question is MCQ {
  return question.type === QuestionType.Mcq;
}
