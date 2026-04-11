import { Question, QuestionType } from './question.model';

export interface EssayQuestion extends Question {
  type: typeof QuestionType.Essay;
}
