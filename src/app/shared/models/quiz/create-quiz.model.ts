import { Question } from './question.model';

export interface CreateQuiz {
  courseId: string;
  instructorId: string;
  title: string;
  startsAtUtc: Date;
  endsAtUtc: Date;
  questions: Question[];
}
