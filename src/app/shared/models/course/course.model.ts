export interface Course {
  id: string;
  courseName: string;
  instructorId: string | null;
  instructorName: string;
  enrolledStudentsCount: number;
  quizzesCount: number;
  remainingMarks: number;
}
