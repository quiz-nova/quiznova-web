export interface QuestionAnswer {
  answerId: string;
  questionId: string;
  questionText: string;
  answerType: 'mcq' | 'tf';
  isCorrect: boolean | null;
}

export interface McqAnswer extends QuestionAnswer {
  answerType: 'mcq';
  selectedChoiceId: string;
}

export interface TfAnswer extends QuestionAnswer {
  answerType: 'tf';
  studentChoice: boolean;
}
