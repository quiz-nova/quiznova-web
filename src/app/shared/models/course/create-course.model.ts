import { Course } from './course.model';

export type CreateCourse = Omit<
  Course,
  | 'courseId'
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
