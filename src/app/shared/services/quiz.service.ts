import { inject, Injectable, type Type } from '@angular/core';
import {
  QuestionAttemptComponent,
  QuestionComponent,
  QuestionTagComponent,
} from '../models/quiz/question-component.contracts';
import {
  QUESTION_COMPONENT_MAP,
  QUESTION_ATTEMPT_COMPONENT_MAP,
  QUESTION_TAG_MAP,
} from '../models/quiz/question-component-map';
import { QuestionType } from '../models/quiz/question.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { Quiz } from '../models/quiz/quiz.model';
import { QuizCount } from '../models/quiz/quiz-count.model';
import { StudentQuizzesLifecycle } from '../../features/student/student-quizzes/models/student-quizzes-lifecycle.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getSuitableQuestionComponent(questionType: QuestionType): Type<QuestionComponent> | null {
    return QUESTION_COMPONENT_MAP[questionType] || null;
  }

  getSuitableQuestionTag(questionType: QuestionType): Type<QuestionTagComponent> | null {
    return QUESTION_TAG_MAP[questionType] || null;
  }

  getSuitableQuestionAttemptComponent(
    questionType: QuestionType,
  ): Type<QuestionAttemptComponent> | null {
    return QUESTION_ATTEMPT_COMPONENT_MAP[questionType] || null;
  }

  createQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.appSettings.apiBaseUrl}/quizzes`, quiz);
  }

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.appSettings.apiBaseUrl}/quizzes`);
  }

  getQuizById(quizId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.appSettings.apiBaseUrl}/quizzes/${quizId}`);
  }

  getStudentQuizzesLifecycle(studentId: string): Observable<StudentQuizzesLifecycle> {
    return this.http.get<StudentQuizzesLifecycle>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quizzes`,
    );
  }

  getInstructorQuizzesCount(instructorId: string): Observable<QuizCount> {
    return this.http.get<QuizCount>(
      `${this.appSettings.apiBaseUrl}/quizzes/count?instructorId=${instructorId}`,
    );
  }
}
