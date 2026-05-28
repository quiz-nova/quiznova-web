import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { SubmitQuizAttempt } from '@Features/student/quiz-attempt/models/SubmitQuizAttempt.model';
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

  getQuizAttemptById(studentId: string, attemptId: string): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quiz-attempts/${attemptId}`,
    );
  }

  createQuizAttempt(studentId: string, request: SubmitQuizAttempt): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quiz-attempts`,
      request,
    );
  }

  getStudentQuizAttempts(studentId: string): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quiz-attempts`,
    );
  }

  getStudentQuizAttemptsCount(studentId: string): Observable<QuizAttemptCount> {
    return this.http.get<QuizAttemptCount>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quiz-attempts/count`,
    );
  }

  getAllQuizAttempts(
    query: PaginatedQuery & { correctAnswers?: number },
  ): Observable<PaginatedList<QuizAttempt>> {
    const params = buildParameters(query);

    return this.http.get<PaginatedList<QuizAttempt>>(
      `${this.appSettings.apiBaseUrl}/quiz-attempts`,
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
      `${this.appSettings.apiBaseUrl}/quiz-attempts/manually-graded-answers`,
      { params },
    );
  }

  getQuizAttemptForGrading(attemptId: string): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(`${this.appSettings.apiBaseUrl}/quiz-attempts/${attemptId}`);
  }

  gradeAnswer(answerId: string, score: number, feedback?: string): Observable<void> {
    return this.http.put<void>(
      `${this.appSettings.apiBaseUrl}/quiz-attempts/manually-graded-answers/${answerId}`,
      { score, feedback: feedback ?? null },
    );
  }
}
