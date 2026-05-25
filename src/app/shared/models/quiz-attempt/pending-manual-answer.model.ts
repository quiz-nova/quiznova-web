export interface PendingManualAnswers {
  attemptId: string;
  studentId: string;
  studentName: string;
  courseName: string;
  quizTitle: string;
  submittedAt: string;
  /** How many manually graded answers in this attempt are still ungraded. */
  ungradedCount: number;
}
