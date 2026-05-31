export interface EnrollmentInstructorDto {
  instructorId: string;
  name: string;
}

export interface EnrollmentStudentDto {
  studentId: string;
  name: string;
  quizzesTaken: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  instructor: EnrollmentInstructorDto;
  student: EnrollmentStudentDto;
  enrolledOnUtc: string;
}
