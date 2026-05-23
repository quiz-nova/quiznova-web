import { Question, QuestionType } from '@shared/models/quiz/question.model';

export interface Essay extends Question {
  type: 'essay';
  answerReference: string | null;
}
export function isEssay(question: Question): question is Essay {
  return question.type === QuestionType.Essay;
}
