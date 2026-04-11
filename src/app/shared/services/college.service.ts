import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../core/config/app.settings';
import { CollegeSummary } from '../models/admin/college-summary.model';

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
