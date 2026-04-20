import { inject, Injectable } from '@angular/core';
import { Course } from '../models/course/course.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { CourseCount } from '../models/course/course-count.model';

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

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.appSettings.apiBaseUrl}/courses`);
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
