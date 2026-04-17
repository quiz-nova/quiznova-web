import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { QuizAttemptCount } from '../models/quiz-attempt/quiz-attempt-count.model';

@Injectable({
  providedIn: 'root',
})
export class QuizAttemptsService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getStudentQuizAttemptsCount(studentId: string): Observable<QuizAttemptCount> {
    return this.http.get<QuizAttemptCount>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quiz-attempts/count`,
    );
  }
}

