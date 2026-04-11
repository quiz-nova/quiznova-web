import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { AuthResponseModel } from './models/auth-response.model';
import { User } from '../../shared/models/user.model';
import { ROLE_DEFINITIONS, UserRole } from '../../shared/models/user-role.model';
import { UserResponseModel } from './models/user-response.model';
import { APP_SETTINGS } from '../../core/config/app.settings';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  private readonly tokenKey = 'access_token';

  login(credentials: { email: string; password: string; role: UserRole }): Observable<User> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };

    return this.http.post<AuthResponseModel>(`${this.appSettings.apiBaseUrl}/login`, payload).pipe(
      tap((response) => localStorage.setItem(this.tokenKey, response.token?.accessToken)),
      map((response) => this.mapUser(response.user)),
      tap((user) => this._currentUser.set(user)),
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private parseUserRole(role: string): UserRole {
    return role in ROLE_DEFINITIONS ? (role as UserRole) : UserRole.student;
  }

  private mapUser(user: UserResponseModel): User {
    return {
      userId: user.userId,
      name: user.name,
      userRole: this.parseUserRole(user.role),
    };
  }
}
