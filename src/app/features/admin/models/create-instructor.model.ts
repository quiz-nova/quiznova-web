import { Instructor } from '@shared/models/users/instructor.model';

export type CreateInstructor = Omit<Instructor, 'id' | 'coursesCount' | 'quizzesCount'> & {
  role: string;
};
