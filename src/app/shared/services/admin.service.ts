import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateAdmin } from '@Features/admin/models/create-admin.model';
import { UpdateAdmin } from '@Features/admin/models/update-admin.model';
import { Observable } from 'rxjs';

import { Admin } from '@shared/models/admin/admin.model';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllAdmins(query: PaginatedQuery): Observable<PaginatedList<Admin>> {
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PaginatedList<Admin>>(`${this.appSettings.apiBaseUrl}/admins`, { params });
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
