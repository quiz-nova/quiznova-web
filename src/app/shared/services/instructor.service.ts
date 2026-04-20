import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { CreateInstructor } from '../../features/admin/models/create-instructor.model';
import { Instructor } from '../models/instructor/instructor.model';
import { UpdateInstructor } from '../../features/admin/models/update-instructor.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);
  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.appSettings.apiBaseUrl}/instructors`);
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
