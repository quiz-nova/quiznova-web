import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { SubmitQuizAttempt } from '@Features/student/quiz-attempt/models/SubmitQuizAttempt.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { QuizAttemptCount } from '@shared/models/quiz-attempt/quiz-attempt-count.model';
import { QuizAttempt } from '@shared/models/quiz-attempt/quiz-attempt.model';

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
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.correctAnswers !== undefined) {
      params = params.set('correctAnswers', query.correctAnswers);
    }
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PaginatedList<QuizAttempt>>(`${this.appSettings.apiBaseUrl}/quiz-attempts`, {
      params,
    });
  }
}
