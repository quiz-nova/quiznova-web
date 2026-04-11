import { inject, Injectable } from '@angular/core';
import { Course as InstructorCourse } from '../models/course/course.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { Course as CollegeCourse } from '../models/admin/course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);
  getInstructorCourses(instructorId: string): Observable<InstructorCourse[]> {
    return this.http.get<InstructorCourse[]>(
      `${this.appSettings.apiBaseUrl}/courses?instructorId=${instructorId}`,
    );
  }

  getAllCourses(): Observable<CollegeCourse[]> {
    return this.http.get<CollegeCourse[]>(`${this.appSettings.apiBaseUrl}/colleges/courses`);
  }
}
