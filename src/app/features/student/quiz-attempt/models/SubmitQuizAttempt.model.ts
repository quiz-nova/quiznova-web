import { QuestionType } from '@shared/models/quiz/question.model';

export interface SubmitQuestionAnswer {
  questionId: string;
  type: QuestionType;
}

export interface SubmitMcqAnswer extends SubmitQuestionAnswer {
  type: typeof QuestionType.Mcq;
  selectedChoiceId: string;
}

export interface SubmitTfAnswer extends SubmitQuestionAnswer {
  type: typeof QuestionType.Tf;
  studentChoice: boolean;
}

export interface SubmitEssayAnswer extends SubmitQuestionAnswer {
  type: typeof QuestionType.Essay;
  studentResponse: string;
}

export type SubmitQuestionAnswerType = SubmitMcqAnswer | SubmitTfAnswer | SubmitEssayAnswer;

export interface StartQuizAttemptRequest {
  quizId: string;
}

export interface CompleteQuizAttemptRequest {
  submittedAt: string;
}
