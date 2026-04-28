import { Question, QuestionType } from './question.model';

export interface Tf extends Question {
  type: typeof QuestionType.Tf;
  correctChoice: boolean;
}
