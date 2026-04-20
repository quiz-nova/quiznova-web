import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { Admin } from '../models/admin/admin.model';
import { CreateAdmin } from '../../features/admin/models/create-admin.model';
import { UpdateAdmin } from '../../features/admin/models/update-admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.appSettings.apiBaseUrl}/admins`);
  }

  createAdmin(admin: CreateAdmin): Observable<Admin> {
    return this.http.post<Admin>(`${this.appSettings.apiBaseUrl}/admins`, admin);
  }

  updateAdmin(adminId: string, admin: UpdateAdmin): Observable<Admin> {
    return this.http.put<Admin>(`${this.appSettings.apiBaseUrl}/admins/${adminId}`, admin);
  }

  deleteAdmin(adminId: string): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.apiBaseUrl}/admins/${adminId}`);
  }
}
