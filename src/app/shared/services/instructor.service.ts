import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { Instructor } from '../models/admin/instructor.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);
  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.appSettings.apiBaseUrl}/instructors`);
  }
}
