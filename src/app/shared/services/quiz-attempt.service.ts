import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import {
  CompleteQuizAttemptRequest,
  StartQuizAttemptRequest,
  SubmitQuestionAnswerType,
} from '@Features/student/quiz-attempt/models/SubmitQuizAttempt.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { PendingManualAnswers } from '@shared/models/quiz-attempt/pending-manual-answer.model';
import { QuizAttemptCount } from '@shared/models/quiz-attempt/quiz-attempt-count.model';
import { QuizAttempt } from '@shared/models/quiz-attempt/quiz-attempt.model';
import { buildParameters } from '@shared/utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class QuizAttemptService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  private get apiBase(): string {
    return this.appSettings.apiBaseUrl;
  }

  startQuizAttempt(request: StartQuizAttemptRequest): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.apiBase}/quizattempts`, request);
  }

  submitQuestionAnswer(attemptId: string, answer: SubmitQuestionAnswerType): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/quizattempts/${attemptId}/answers`, answer);
  }

  completeQuizAttempt(
    attemptId: string,
    request: CompleteQuizAttemptRequest,
  ): Observable<QuizAttempt> {
    return this.http.put<QuizAttempt>(`${this.apiBase}/quizattempts/${attemptId}`, request);
  }

  getQuizAttemptById(studentId: string, attemptId: string): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(
      `${this.apiBase}/students/${studentId}/quiz-attempts/${attemptId}`,
    );
  }

  getQuizAttemptForResume(attemptId: string): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(`${this.apiBase}/quiz-attempts/${attemptId}`);
  }

  getStudentQuizAttempts(studentId: string): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(
      `${this.apiBase}/students/${studentId}/quiz-attempts`,
    );
  }

  getStudentQuizAttemptsCount(studentId: string): Observable<QuizAttemptCount> {
    return this.http.get<QuizAttemptCount>(
      `${this.apiBase}/students/${studentId}/quiz-attempts/count`,
    );
  }

  getAllQuizAttempts(
    query: PaginatedQuery & { correctAnswers?: number },
  ): Observable<PaginatedList<QuizAttempt>> {
    const params = buildParameters(query);

    return this.http.get<PaginatedList<QuizAttempt>>(
      `${this.apiBase}/quiz-attempts`,
      {
        params,
      },
    );
  }

  getPendingManualAnswers(
    pageNumber = 1,
    pageSize = 10,
  ): Observable<PaginatedList<PendingManualAnswers>> {
    const params = buildParameters({ pageNumber, pageSize });

    return this.http.get<PaginatedList<PendingManualAnswers>>(
      `${this.apiBase}/quiz-attempts/manually-graded-answers`,
      { params },
    );
  }

  getQuizAttemptForGrading(attemptId: string): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(`${this.apiBase}/quiz-attempts/${attemptId}`);
  }

  gradeAnswer(answerId: string, score: number, feedback?: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiBase}/quiz-attempts/manually-graded-answers/${answerId}`,
      { score, feedback: feedback ?? null },
    );
  }
}
