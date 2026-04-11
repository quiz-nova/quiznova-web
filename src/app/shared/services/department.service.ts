import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { Department } from '../models/admin/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${this.appSettings.apiBaseUrl}/colleges/departments`,
    );
  }
}
