import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateQuiz } from '@Features/instructor/create-quiz/create-quiz.model';
import { type QuizMetadataValue } from '@Features/instructor/create-quiz/quiz-metadata-form';
import { StudentQuizzesApiResponse } from '@Features/student/student-quizzes/models/student-quizzes.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { Question } from '@shared/models/quiz/question.model';
import { isMcq } from '@shared/models/quiz/questions/mcq.model';
import { QuizCount } from '@shared/models/quiz/quiz-count.model';
import { Quiz } from '@shared/models/quiz/quiz.model';
import { buildParameters } from '@shared/utils/utilities';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  createQuiz(quiz: CreateQuiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.appSettings.apiBaseUrl}/quizzes`, {
      ...quiz,
      questions: quiz.questions.map((question) =>
        this.stripCreationIds(this.withTypeDiscriminatorFirst(question)),
      ),
    });
  }

  getAllQuizzes(query: PaginatedQuery & { marks?: number }): Observable<PaginatedList<Quiz>> {
    const params = buildParameters(query);

    return this.http.get<PaginatedList<Quiz>>(`${this.appSettings.apiBaseUrl}/quizzes`, { params });
  }

  getQuizById(quizId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.appSettings.apiBaseUrl}/quizzes/${quizId}`);
  }

  getStudentQuizzesLifecycle(studentId: string): Observable<StudentQuizzesApiResponse> {
    return this.http.get<StudentQuizzesApiResponse>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/quizzes?t=${Date.now()}`,
    );
  }

  getInstructorQuizzesCount(instructorId: string): Observable<QuizCount> {
    return this.http.get<QuizCount>(
      `${this.appSettings.apiBaseUrl}/quizzes/count?instructorId=${instructorId}`,
    );
  }

  // --- Incremental Edit Endpoints (To be implemented in backend) ---

  updateQuizMetadata(quizId: string, metadata: QuizMetadataValue): Observable<void> {
    return this.http.put<void>(
      `${this.appSettings.apiBaseUrl}/quizzes/${quizId}/metadata`,
      metadata,
    );
  }

  addQuestion(quizId: string, question: Question): Observable<Question> {
    return this.http.post<Question>(
      `${this.appSettings.apiBaseUrl}/quizzes/${quizId}/questions`,
      this.stripCreationIds(this.withTypeDiscriminatorFirst(question)),
    );
  }

  updateQuestion(quizId: string, questionId: string, question: Question): Observable<void> {
    return this.http.put<void>(
      `${this.appSettings.apiBaseUrl}/quizzes/${quizId}/questions/${questionId}`,
      this.stripCreationIds(this.withTypeDiscriminatorFirst(question)),
    );
  }

  removeQuestion(quizId: string, questionId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.appSettings.apiBaseUrl}/quizzes/${quizId}/questions/${questionId}`,
    );
  }

  updateQuizCourseId(quizId: string, courseId: string): Observable<void> {
    return this.http.put<void>(`${this.appSettings.apiBaseUrl}/quizzes/${quizId}/course`, {
      courseId,
    });
  }

  private withTypeDiscriminatorFirst(question: Question): Question {
    const { type, ...questionBody } = question;

    return { type, ...questionBody } as Question;
  }

  private stripCreationIds(question: Question) {
    const { id, quizId, ...rest } = question;

    if (isMcq(question)) {
      const choices =
        question.choices?.map(({ questionId, ...choiceRest }) => {
          return choiceRest;
        }) ?? [];

      return {
        ...rest,
        choices,
      };
    }

    return rest;
  }
}
