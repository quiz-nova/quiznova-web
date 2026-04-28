import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateInstructor } from '@Features/admin/models/create-instructor.model';
import { UpdateInstructor } from '@Features/admin/models/update-instructor.model';
import { Observable } from 'rxjs';

import { Instructor } from '@shared/models/instructor/instructor.model';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);
  getAllInstructors(
    query: PaginatedQuery & { coursesCount?: number; quizzesCount?: number },
  ): Observable<PaginatedList<Instructor>> {
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.coursesCount !== undefined) {
      params = params.set('coursesCount', query.coursesCount);
    }
    if (query.quizzesCount !== undefined) {
      params = params.set('quizzesCount', query.quizzesCount);
    }
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PaginatedList<Instructor>>(`${this.appSettings.apiBaseUrl}/instructors`, {
      params,
    });
  }

  createInstructor(instructor: CreateInstructor): Observable<Instructor> {
    return this.http.post<Instructor>(`${this.appSettings.apiBaseUrl}/instructors`, instructor);
  }

  updateInstructor(instructorId: string, instructor: UpdateInstructor): Observable<Instructor> {
    return this.http.put<Instructor>(
      `${this.appSettings.apiBaseUrl}/instructors/${instructorId}`,
      instructor,
    );
  }

  deleteInstructor(instructorId: string): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.apiBaseUrl}/instructors/${instructorId}`);
  }
}
