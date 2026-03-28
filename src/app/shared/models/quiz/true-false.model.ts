import { Question, QuestionType } from './question.model';

export interface TrueFalseQuestion extends Question {
  type: QuestionType.TrueFalse;
  correctChoice: boolean;
}
