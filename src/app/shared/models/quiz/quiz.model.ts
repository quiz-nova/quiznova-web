import { Question } from './question.model';

export interface Quiz {
  id: string;
  courseId: string;
  instructorId: string;
  title: string;
  startsAtUtc: Date;
  endsAtUtc: Date;
  questions: Question[];
}
