export interface StudentQuizzesApiResponse {
  serverUtc: string;
  quizzes: StudentQuizApiDto[];
}

export interface StudentQuizApiDto {
  quizId: string;
  title: string;
  courseName: string;
  questionsCount: number;
  startsAtUtc: string;
  endsAtUtc: string;
  quizStatus: StudentQuizStatus;
}

export enum StudentQuizStatus {
  Scheduled = 0,
  AvailableNow = 1,
}
