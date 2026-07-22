import { Quiz } from '@shared/models/quiz/quiz.model';

export type CreateQuiz = Omit<
  Quiz,
  'quizId' | 'serverUtc' | 'state' | 'courseName' | 'instructorName' | 'marks'
>;
