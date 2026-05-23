import { Student } from '@shared/models/users/student.model';

export type CreateStudent = Omit<Student, 'id' | 'enrolledCoursesCount'> & {
  role: string;
};
