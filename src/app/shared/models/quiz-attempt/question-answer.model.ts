export const AnswerType = {
  Auto: 'auto',
  Manual: 'manual',
} as const;

export type AnswerType = (typeof AnswerType)[keyof typeof AnswerType];

export interface QuestionAnswer {
  answerId: string;
  questionId: string;
  questionText: string;
  answerType: AnswerType;
}

export interface AutoGradedAnswer extends QuestionAnswer {
  answerType: typeof AnswerType.Auto;
  autoAnswerType: 'mcq' | 'tf';
  isCorrect: boolean;
}

export interface McqAnswer extends AutoGradedAnswer {
  autoAnswerType: 'mcq';
  selectedChoiceId: string;
}

export interface TfAnswer extends AutoGradedAnswer {
  autoAnswerType: 'tf';
  studentChoice: boolean;
}


export interface ManuallyGradedAnswer extends QuestionAnswer {
  answerType: typeof AnswerType.Manual;
  score: number | null;
  feedback: string | null;
}

export interface EssayAnswer extends ManuallyGradedAnswer {
  studentResponse: string;
}

export type QuestionAnswerType = McqAnswer | TfAnswer | EssayAnswer;

export function isMcqAnswer(answer: QuestionAnswer | null): answer is McqAnswer {
  return !!answer && answer.answerType === AnswerType.Auto && (answer as AutoGradedAnswer).autoAnswerType === 'mcq';
}

export function isTfAnswer(answer: QuestionAnswer | null): answer is TfAnswer {
  return !!answer && answer.answerType === AnswerType.Auto && (answer as AutoGradedAnswer).autoAnswerType === 'tf';
} 

export function isManuallyGradedAnswer(answer: QuestionAnswer | null): answer is ManuallyGradedAnswer {
  return !!answer && answer.answerType === AnswerType.Manual;
}

