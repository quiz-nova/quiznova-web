export interface QuestionAnswer {
  answerId: string;
  questionId: string;
  questionText: string;
  /** First-level discriminator: auto-graded vs manually graded. */
  answerType: 'auto' | 'manual';
  /** null only for manually-graded answers not yet graded by the instructor. */
}

/**
 * Narrows to auto-graded answers. Mirrors backend `AutoGradedAnswer`.
 * Adds a second-level `autoAnswerType` discriminator to distinguish MCQ from TF.
 * `isCorrect` is always a concrete boolean — never null for auto-graded.
 */
export interface AutoGradedAnswer extends QuestionAnswer {
  answerType: 'auto';
  /** Second-level discriminator within the auto-graded branch. */
  autoAnswerType: 'mcq' | 'tf';
  isCorrect: boolean;
}

/** MCQ answer — the student picked one of the choices. */
export interface McqAnswer extends AutoGradedAnswer {
  autoAnswerType: 'mcq';
  selectedChoiceId: string;
}

/** True/False answer — the student picked true or false. */
export interface TfAnswer extends AutoGradedAnswer {
  autoAnswerType: 'tf';
  studentChoice: boolean;
}

/**
 * Represents an answer to a question that requires manual grading.
 * Mirrors backend `ManuallyGradedAnswers` class.
 * `score` is null until the instructor grades the submission.
 */
export interface ManuallyGradedAnswer extends QuestionAnswer {
  answerType: 'manual';
  /** Always null — manual answers have no automatic correction. */
  isCorrect: null;
  score: number | null;
}
