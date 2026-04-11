import { Question, QuestionType } from './question.model';

export interface TrueFalseQuestion extends Question {
  type: typeof QuestionType.TrueFalse;
  correctChoice: boolean;
}
