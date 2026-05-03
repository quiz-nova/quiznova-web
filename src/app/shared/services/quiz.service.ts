import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, type Type } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { StudentQuizzesLifecycle } from '@Features/student/student-quizzes/models/student-quizzes-lifecycle.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { CreateQuiz } from '@shared/models/quiz/create-quiz.model';
import {
  CREATE_QUESTION_COMPONENT_MAP,
  QUESTION_ATTEMPT_COMPONENT_MAP,
  QUESTION_TAG_MAP,
} from '@shared/models/quiz/question-component-map';
import {
  QuestionAttemptContract,
  CreateQuestionContract,
  QuestionTagContract,
} from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';
import { QuizCount } from '@shared/models/quiz/quiz-count.model';
import { Quiz } from '@shared/models/quiz/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getSuitableQuestionComponent(questionType: QuestionType): Type<CreateQuestionContract> | null {
    return CREATE_QUESTION_COMPONENT_MAP[questionType] || null;
  }

  getSuitableQuestionTag(questionType: QuestionType): Type<QuestionTagContract> | null {
    return QUESTION_TAG_MAP[questionType] || null;
  }

  getSuitableQuestionAttemptComponent(
    questionType: QuestionType,
  ): Type<QuestionAttemptContract> | null {
    return QUESTION_ATTEMPT_COMPONENT_MAP[questionType] || null;
  }

  createQuiz(quiz: CreateQuiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.appSettings.apiBaseUrl}/quizzes`, quiz);
  }

  getAllQuizzes(
    query: PaginatedQuery & { marks?: number },
  ): Observable<PaginatedList<Quiz>> {
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.marks !== undefined) {
      params = params.set('marks', query.marks);
    }
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PaginatedList<Quiz>>(`${this.appSettings.apiBaseUrl}/quizzes`, { params });
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
