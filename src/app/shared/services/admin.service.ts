import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { CreateAdmin } from '@Features/admin/models/create-admin.model';
import { Observable } from 'rxjs';

import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PaginatedQuery } from '@shared/models/pagination/paginated-query.model';
import { Admin } from '@shared/models/users/admin.model';
import { buildParameters } from '@shared/utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getAllAdmins(query: PaginatedQuery): Observable<PaginatedList<Admin>> {
    const params = buildParameters(query);

    return this.http.get<PaginatedList<Admin>>(`${this.appSettings.apiBaseUrl}/admins`, { params });
  }

  createAdmin(admin: CreateAdmin): Observable<Admin> {
    return this.http.post<Admin>(`${this.appSettings.apiBaseUrl}/admins`, admin);
  }

}
