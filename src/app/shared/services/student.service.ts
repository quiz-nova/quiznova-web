import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateStudent } from '@Features/admin/models/create-student.model';
import { UpdateStudent } from '@Features/admin/models/update-student.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { Student } from '@shared/models/users/student.model';
import { buildParameters } from '@shared/utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllStudents(
    query: PaginatedQuery & {
      enrolledCoursesCount?: number;
      courseId?: string;
      isEnrolledInCourse?: boolean;
    },
  ): Observable<PaginatedList<Student>> {
    const params = buildParameters(query);

    return this.http.get<PaginatedList<Student>>(`${this.appSettings.apiBaseUrl}/students`, {
      params,
    });
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
