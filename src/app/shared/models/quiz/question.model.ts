export const QuestionType = {
  Mcq: 'mcq',
  Tf: 'tf',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  marks: number;
  type: QuestionType;
}
