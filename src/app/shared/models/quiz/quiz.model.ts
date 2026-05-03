import { Question } from './question.model';

export interface Quiz {
  quizId: string;
  title: string;
  courseName: string;
  instructorName: string;
  marks: number;
  courseId: string;
  instructorId: string;
  startsAtUtc: Date | string;
  endsAtUtc: Date | string;
  serverUtc: Date | string;
  state: string;
  questions: Question[];
}
