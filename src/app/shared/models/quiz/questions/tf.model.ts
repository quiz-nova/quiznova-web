import { Question, QuestionType } from '../question.model';

export interface Tf extends Question {
  type: typeof QuestionType.Tf;
  correctChoice: boolean;
}

export function isTf(question: Question): question is Tf {
  return question.type === QuestionType.Tf;
}
