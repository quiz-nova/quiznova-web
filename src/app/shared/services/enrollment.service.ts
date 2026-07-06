import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { Observable, of } from 'rxjs';

import { CourseEnrollmentCount } from '@shared/models/enrollment/course-enrollment-count.model';
import { EnrollmentCount } from '@shared/models/enrollment/enrollment-count.model';
import { Enrollment } from '@shared/models/enrollment/enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);

  getEnrollments(studentId: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/enrollments`
    );
  }

  getEnrollmentsCount(studentId: string): Observable<EnrollmentCount> {
    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      return of({ enrollmentsCount: 0 });
    }

    return this.http.get<EnrollmentCount>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/enrollments/count`
    );
  }

  getAllCoursesEnrollmentCounts(): Observable<CourseEnrollmentCount[]> {
    return this.http.get<CourseEnrollmentCount[]>(
      `${this.appSettings.apiBaseUrl}/courses/enrollments/count`
    );
  }

  enrollStudent(courseId: string, studentId: string): Observable<void> {
    return this.http.post<void>(
      `${this.appSettings.apiBaseUrl}/students/${studentId}/enrollments`,
      { courseId }
    );
  }

  removeStudent(courseId: string, studentId: string): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.getEnrollments(studentId).subscribe({
        next: (enrollments) => {
          const enrollment = enrollments.find((e) => e.courseId === courseId);
          this.http.delete<void>(
            `${this.appSettings.apiBaseUrl}/students/${studentId}/enrollments/${enrollment?.id}`
          ).subscribe({
            next: () => {
              subscriber.next();
              subscriber.complete();
            },
            error: (err) => subscriber.error(err),
          });
        },
        error: (err) => subscriber.error(err),
      });
    });
  }
}
