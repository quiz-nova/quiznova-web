import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { CreateStudent } from '../../features/admin/models/create-student.model';
import { Student } from '../models/student/student.model';
import { UpdateStudent } from '../../features/admin/models/update-student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.appSettings.apiBaseUrl}/students`);
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
