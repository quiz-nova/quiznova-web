import { Question, QuestionType } from '../quiz/question.model';

export const QuestionAnswerType = {
  Mcq: QuestionType.Mcq,
  TrueFalse: QuestionType.TrueFalse,
} as const;

export type QuestionAnswerType = (typeof QuestionAnswerType)[keyof typeof QuestionAnswerType];

export interface QuestionAnswerBase {
  id: string;
  studentId: string;
  questionId: string;
  quizAttemptId: string;
  question?: Question;
}

export interface McqAnswer extends QuestionAnswerBase {
  type: typeof QuestionAnswerType.Mcq;
  selectedChoiceId: string;
}

export interface TrueFalseQuestionAnswer extends QuestionAnswerBase {
  type: typeof QuestionAnswerType.TrueFalse;
  studentChoice: boolean;
}

export type QuestionAnswer = McqAnswer | TrueFalseQuestionAnswer;

export function isMcqAnswer(answer: QuestionAnswer): answer is McqAnswer {
  return answer.type === QuestionAnswerType.Mcq;
}

export function isTrueFalseQuestionAnswer(answer: QuestionAnswer): answer is TrueFalseQuestionAnswer {
  return answer.type === QuestionAnswerType.TrueFalse;
}
