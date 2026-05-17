export interface SubmitQuestionAnswer {
  questionId: string;
  type: 'mcq' | 'tf';
}

export interface SubmitMcqAnswer extends SubmitQuestionAnswer {
  type: 'mcq';
  selectedChoiceId: string;
}

export interface SubmitTfAnswer extends SubmitQuestionAnswer {
  type: 'tf';
  studentChoice: boolean;
}

export interface SubmitQuizAttempt {
  quizId: string;
  startedAt: string;
  submittedAt: string;
  questionAnswers: (SubmitMcqAnswer | SubmitTfAnswer)[];
}
