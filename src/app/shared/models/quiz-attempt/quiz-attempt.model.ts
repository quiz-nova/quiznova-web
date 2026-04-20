import { Quiz } from '../quiz/quiz.model';
import { Student } from '../student/student.model';
import { QuestionAnswer } from './question-answer.model';

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  startedAt: Date | string;
  submittedAt: Date | string | null;
  student?: Student;
  quiz?: Quiz;
  studentAnswers: QuestionAnswer[];
}
