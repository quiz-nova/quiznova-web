import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, type Type } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { type QuizMetadataValue } from '@Features/instructor/shared/quiz-metadata-form';
import { StudentQuizzesLifecycle } from '@Features/student/student-quizzes/models/student-quizzes-lifecycle.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { CreateQuiz } from '@shared/models/quiz/create-quiz.model';
import {
  QUESTION_FORM_COMPONENT_MAP,
  QUESTION_ATTEMPT_COMPONENT_MAP,
  QUESTION_TAG_MAP,
} from '@shared/models/quiz/question-component-map';
import { QuestionAttemptContract, QuestionFormContract, QuestionTagContract } from '@shared/models/quiz/question-component.contracts';
import { isMcq } from '@shared/models/quiz/mcq.model';
import { Question, QuestionType } from '@shared/models/quiz/question.model';
import { QuizCount } from '@shared/models/quiz/quiz-count.model';
import { Quiz } from '@shared/models/quiz/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getSuitableQuestionFormComponent(questionType: QuestionType): Type<QuestionFormContract> | null {
    return QUESTION_FORM_COMPONENT_MAP[questionType] || null;
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
    return this.http.post<Quiz>(`${this.appSettings.apiBaseUrl}/quizzes`, {
      ...quiz,
      questions: quiz.questions.map((question) => this.stripCreationIds(this.withTypeDiscriminatorFirst(question))),
    });
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

  // --- Incremental Edit Endpoints (To be implemented in backend) ---

  updateQuizMetadata(quizId: string, metadata: QuizMetadataValue): Observable<void> {
    return this.http.put<void>(`${this.appSettings.apiBaseUrl}/quizzes/${quizId}/metadata`, metadata);
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
    return this.http.delete<void>(`${this.appSettings.apiBaseUrl}/quizzes/${quizId}/questions/${questionId}`);
  }

  updateQuizCourseId(quizId: string, courseId: string): Observable<void> {
    return this.http.put<void>(`${this.appSettings.apiBaseUrl}/quizzes/${quizId}/course`, { courseId });
  }

  private withTypeDiscriminatorFirst(question: Question): Question {
    const { type, ...questionBody } = question;

    return { type, ...questionBody } as Question;
  }

  private stripCreationIds(question: Question) {
    const { id, quizId, ...rest } = question;

    if (isMcq(question)) {
      const choices = question.choices?.map(({ questionId, ...choiceRest }) => choiceRest) ?? [];

      return {
        ...rest,
        choices,
      };
    }

    return rest;
  }
}
