import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateCourse } from '@Features/admin/models/create-course.model';
import { UpdateCourseInstructor } from '@Features/admin/models/update-course-instructor.model';
import { Observable, of } from 'rxjs';

import { CourseCount } from '@shared/models/course/course-count.model';
import { Course } from '@shared/models/course/course.model';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { buildParameters } from '@shared/utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);

  getInstructorCourses(instructorId: string): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.appSettings.apiBaseUrl}/instructor/${instructorId}/courses`,
    );
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

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.apiBaseUrl}/courses/${courseId}`);
  }

  getInstructorCoursesCount(instructorId: string): Observable<CourseCount> {
    if (!instructorId || instructorId === 'undefined' || instructorId === 'null') {
      return of({ coursesCount: 0 });
    }

    return this.http.get<CourseCount>(
      `${this.appSettings.apiBaseUrl}/instructor/${instructorId}/courses/count`,
    );
  }
}
