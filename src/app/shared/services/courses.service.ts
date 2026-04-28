import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { Observable } from 'rxjs';

import { CourseCount } from '@shared/models/course/course-count.model';
import { Course } from '@shared/models/course/course.model';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { StudentCourse } from '@shared/models/student-course/student-course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);

  getInstructorCourses(instructorId: string): Observable<Course[]> {
    const params = new HttpParams().set('instructorId', instructorId);

    return this.http.get<Course[]>(`${this.appSettings.apiBaseUrl}/courses`, { params });
  }

  getStudentCourses(studentId: string): Observable<StudentCourse[]> {
    const params = new HttpParams().set('studentId', studentId);

    return this.http.get<StudentCourse[]>(`${this.appSettings.apiBaseUrl}/courses`, { params });
  }

  getAllCourses(
    query: PaginatedQuery & { enrolledStudentsCount?: number; quizzesCount?: number },
  ): Observable<PaginatedList<Course>> {
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.enrolledStudentsCount !== undefined) {
      params = params.set('enrolledStudentsCount', query.enrolledStudentsCount);
    }
    if (query.quizzesCount !== undefined) {
      params = params.set('quizzesCount', query.quizzesCount);
    }
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PaginatedList<Course>>(`${this.appSettings.apiBaseUrl}/courses`, { params });
  }

  getInstructorCoursesCount(instructorId: string): Observable<CourseCount> {
    const params = new HttpParams().set('instructorId', instructorId);

    return this.http.get<CourseCount>(`${this.appSettings.apiBaseUrl}/courses/count`, { params });
  }

  getStudentCoursesCount(studentId: string): Observable<CourseCount> {
    const params = new HttpParams().set('studentId', studentId);

    return this.http.get<CourseCount>(`${this.appSettings.apiBaseUrl}/courses/count`, { params });
  }
}
