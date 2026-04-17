export const QuestionType = {
  MultipleChoice: 'multiple-choice',
  TrueFalse: 'true-false',
  Essay: 'essay',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  marks: number;
  type: QuestionType;
}
