import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { map, Observable, tap } from 'rxjs';

import { UserRole } from '@shared/models/users/user-role.model';
import { User } from '@shared/models/users/user.model';
import { parseUserRole } from '@shared/utils/utilities';

import { Auth, Token, UserDto } from './models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  private readonly tokenKey = this.appSettings.storage.accessTokenKey;
  private readonly userKey = this.appSettings.storage.currentUserKey;

  constructor() {
    this.restoreSession();
  }

  login(credentials: { email: string; password: string; role: UserRole }): Observable<User> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    };

    return this.http
      .post<Auth>(`${this.appSettings.apiBaseUrl}/auth/login`, payload, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => localStorage.setItem(this.tokenKey, response.token?.accessToken)),
        map((response) => this.mapUser(response.user)),
        tap((user) => this.persistUser(user)),
      );
  }

  refreshAccessToken(expiredAccessToken: string): Observable<string> {
    return this.http
      .post<Token>(
        `${this.appSettings.apiBaseUrl}/auth/refresh`,
        { expiredAccessToken },
        { withCredentials: true },
      )
      .pipe(
        map((response) => response.accessToken),
        tap((accessToken) => localStorage.setItem(this.tokenKey, accessToken)),
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._currentUser.set(null);
  }

  private mapUser(user: UserDto): User {
    return {
      id: user.id,
      role: parseUserRole(user.role),
      personalInformation: {
        name: user.name,
        email: '',
        phoneNumber: '',
      },
    };
  }

  private persistUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this._currentUser.set(user);
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem(this.userKey);

    if (!token || !storedUser) {
      this.clearSession();
      return;
    }

    try {
      const user = JSON.parse(storedUser) as User;
      this._currentUser.set(user);
    } catch {
      this.clearSession();
    }
  }
}
