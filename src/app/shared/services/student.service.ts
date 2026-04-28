import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateStudent } from '@Features/admin/models/create-student.model';
import { UpdateStudent } from '@Features/admin/models/update-student.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { Student } from '@shared/models/student/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllStudents(
    query: PaginatedQuery & { enrolledCoursesCount?: number },
  ): Observable<PaginatedList<Student>> {
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.enrolledCoursesCount !== undefined) {
      params = params.set('enrolledCoursesCount', query.enrolledCoursesCount);
    }
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PaginatedList<Student>>(`${this.appSettings.apiBaseUrl}/students`, { params });
  }

  createStudent(student: CreateStudent): Observable<Student> {
    return this.http.post<Student>(`${this.appSettings.apiBaseUrl}/students`, student);
  }

  updateStudent(studentId: string, student: UpdateStudent): Observable<Student> {
    return this.http.put<Student>(`${this.appSettings.apiBaseUrl}/students/${studentId}`, student);
  }

  deleteStudent(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.apiBaseUrl}/students/${studentId}`);
  }
}
