import { Instructor } from '@shared/models/instructor/instructor.model';

export type CreateInstructor = Omit<Instructor, 'instructorId' | 'coursesCount' | 'quizzesCount'> & {
  role: string;
};
