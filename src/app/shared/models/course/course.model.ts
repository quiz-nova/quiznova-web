import { Quiz } from '../quiz/quiz.model';

export interface Course {
  courseId: string;
  name: string;
  instructorId: string;
  minimumPassingMarks: number;
  maximumMarks: number;
  isGraceMarksActivated: boolean;
  maxGraceMarks?: number;
  quizzes: Quiz[];
}
