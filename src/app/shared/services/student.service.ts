import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { Student } from '../models/admin/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.appSettings.apiBaseUrl}/students`);
  }
}
