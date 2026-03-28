import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthResponseModel } from './models/auth-response.model';
import { User } from '../shared/models/user.model';
import { ROLE_DEFINITIONS, UserRole } from '../shared/models/user-role.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  readonly accessToken = signal('');
  private apiUrl = 'http://localhost:7100/api/v1/auth';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private readonly http = inject(HttpClient);

  login(credentials: {
    email: string;
    password: string;
    role: UserRole;
  }): Observable<AuthResponseModel> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };

    return this.http
      .post<AuthResponseModel>(`${this.apiUrl}/login`, payload)
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.accessToken.set('');
    this._currentUser.set(null);
  }

  private parseUserRole(role: string): UserRole {
    return role in ROLE_DEFINITIONS ? (role as UserRole) : UserRole.student;
  }

  private handleAuthResponse(response: AuthResponseModel): void {
    if (!response.token?.accessToken || !response.user) {
      return;
    }

    localStorage.setItem(this.tokenKey, response.token.accessToken);
    this.accessToken.set(response.token.accessToken);

    const user: User = {
      userId: response.user.userId,
      name: response.user.name,
      userRole: this.parseUserRole(response.user.role),
      claims: response.user.claims.map((claim) => claim.value),
      accessToken: response.token.accessToken,
    };
    localStorage.setItem(this.userKey, JSON.stringify(user));

    this._currentUser.set(user);
  }
}
