import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { QuizAttempt } from '../models/quiz-attempt/quiz-attempt.model';

@Injectable({
  providedIn: 'root',
})
export class QuizAttemptService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  createQuizAttempt(quizAttempt: QuizAttempt): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(
      `${this.appSettings.apiBaseUrl}/students/${quizAttempt.studentId}/quiz-attempts`,
      quizAttempt,
    );
  }
}
