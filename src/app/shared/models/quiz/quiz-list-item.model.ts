export interface QuizListItem {
  quizId: string;
  title: string;
  courseName: string;
  instructorName: string;
  marks: number;
  startsAtUtc: Date | string;
  endsAtUtc: Date | string;
  serverUtc: Date | string;
  state: string;
}
