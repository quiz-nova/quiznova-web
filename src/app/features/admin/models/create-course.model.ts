import { Course } from '@shared/models/course/course.model';

export type CreateCourse = Omit<
  Course,
  | 'id'
  | 'courseName'
  | 'instructorName'
  | 'enrolledStudentsCount'
  | 'quizzesCount'
  | 'remainingMarks'
> & {
  name: string;
  minimumPassingMarks: number;
  maximumMarks: number;
};
