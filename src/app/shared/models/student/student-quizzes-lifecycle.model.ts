export interface StudentQuizCard {
  quizId: string;
  title: string;
  courseName: string;
  questionsCount: number;
  durationInMinutes: number;
  startsAtUtc: string;
  endsAtUtc: string;
}

export interface CompletedStudentQuiz {
  quizId: string;
  attemptId: string;
  title: string;
  courseName: string;
  questionsCount: number;
  score: number;
  isPassed: boolean;
  submittedAtUtc: string;
}

export interface StudentQuizzesLifecycle {
  serverUtc: string;
  availableNow: StudentQuizCard[];
  scheduled: StudentQuizCard[];
  completed: CompletedStudentQuiz[];
}
