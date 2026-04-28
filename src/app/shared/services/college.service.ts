import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


import { APP_SETTINGS } from '@Core/config/app.settings';
import { CollegeSummary } from '@Features/admin/models/college-summary.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly http = inject(HttpClient);

  getCollegeSummary(): Observable<CollegeSummary> {
    return this.http.get<CollegeSummary>(`${this.appSettings.apiBaseUrl}/colleges`);
  }
}
