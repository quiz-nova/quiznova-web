export interface CreateCourse {
  id: string;
  name: string;
  instructorId: string | null;
  minimumPassingMarks: number;
  maximumMarks: number;
}
