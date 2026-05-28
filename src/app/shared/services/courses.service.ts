import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { Observable, of } from 'rxjs';

import { CourseCount } from '@shared/models/course/course-count.model';
import { Course } from '@shared/models/course/course.model';
import { CreateCourse } from '@shared/models/course/create-course.model';
import { UpdateCourseInstructor } from '@shared/models/course/update-course-instructor.model';
import { Enrollment } from '@shared/models/enrollment/enrollment.model';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { buildParameters } from '@shared/utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);

  getInstructorCourses(instructorId: string): Observable<PaginatedList<Course>> {
    const params = new HttpParams().set('instructorId', instructorId);

    return this.http.get<PaginatedList<Course>>(`${this.appSettings.apiBaseUrl}/courses`, { params });
  }

  getEnrollments(studentId: string): Observable<PaginatedList<Enrollment>> {
    const params = new HttpParams().set('studentId', studentId);

    return this.http.get<PaginatedList<Enrollment>>(`${this.appSettings.apiBaseUrl}/courses`, { params });
  }

  getAllCourses(
    query: PaginatedQuery & {
      instructorId?: string;
      enrolledStudentsCount?: number;
      quizzesCount?: number;
    },
  ): Observable<PaginatedList<Course>> {
    const params = buildParameters(query);

    return this.http.get<PaginatedList<Course>>(`${this.appSettings.apiBaseUrl}/courses`, {
      params,
    });
  }

  getCourseById(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.appSettings.apiBaseUrl}/courses/${courseId}`);
  }

  createCourse(course: CreateCourse): Observable<Course> {
    return this.http.post<Course>(`${this.appSettings.apiBaseUrl}/courses`, course);
  }

  updateCourseInstructor(courseId: string, payload: UpdateCourseInstructor): Observable<Course> {
    return this.http.patch<Course>(
      `${this.appSettings.apiBaseUrl}/courses/${courseId}/instructor`,
      payload,
    );
  }

  enrollStudent(courseId: string, studentId: string): Observable<void> {
    return this.http.post<void>(
      `${this.appSettings.apiBaseUrl}/courses/${courseId}/students/${studentId}`,
      {},
    );
  }

  removeStudent(courseId: string, studentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.appSettings.apiBaseUrl}/courses/${courseId}/students/${studentId}`,
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.apiBaseUrl}/courses/${courseId}`);
  }

  getInstructorCoursesCount(instructorId: string): Observable<CourseCount> {
    if (!instructorId || instructorId === 'undefined' || instructorId === 'null') {
      return of({ coursesCount: 0 });
    }
    const params = new HttpParams().set('instructorId', instructorId);

    return this.http.get<CourseCount>(`${this.appSettings.apiBaseUrl}/courses/count`, { params });
  }

  getEnrollmentsCount(studentId: string): Observable<CourseCount> {
    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      return of({ coursesCount: 0 });
    }
    const params = new HttpParams().set('studentId', studentId);

    return this.http.get<CourseCount>(`${this.appSettings.apiBaseUrl}/courses/count`, { params });
  }
}
