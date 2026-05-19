import { Student } from '@shared/models/student/student.model';

export type CreateStudent = Omit<Student, 'studentId' | 'enrolledCoursesCount'> & {
  role: string;
};
