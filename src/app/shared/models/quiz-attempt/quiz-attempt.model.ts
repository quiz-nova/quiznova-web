import { Question } from '@shared/models/quiz/question.model';

import { QuestionAnswer } from './question-answer.model';

export interface QuizAttempt {
  quizAttemptId: string;
  quizId: string;
  quizTitle: string;
  startedAt: Date | string;
  submittedAt: Date | string | null;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  questions: Question[];
  answers: QuestionAnswer[];
  isPassed: boolean;
}
