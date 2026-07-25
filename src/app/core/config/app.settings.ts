import { InjectionToken } from '@angular/core';

import { environment } from '@Environments/environment';

import { normalizeBaseUrl } from '@shared/utils/utilities';

export interface AppSettings {
  appName: string;
  apiBaseUrl: string;
  isProduction: boolean;
  enableDevTools: boolean;
  defaultPageSize: number;
  debounceTimeMs: number;
  quizTimerIntervalMs: number;
  storage: {
    accessTokenKey: string;
    currentUserKey: string;
  };
}

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS');

export const appSettings: AppSettings = {
  appName: environment.appName,
  apiBaseUrl: normalizeBaseUrl(environment.apiUrl),
  isProduction: environment.isProduction,
  enableDevTools: environment.enableDevTools,
  defaultPageSize: environment.defaultPageSize,
  debounceTimeMs: environment.debounceTimeMs,
  quizTimerIntervalMs: environment.quizTimerIntervalMs,
  storage: {
    accessTokenKey: environment.storage.accessTokenKey,
    currentUserKey: environment.storage.currentUserKey,
  },
};

export function validateSettings(settings: AppSettings): void {
  const errors: string[] = [];

  if (!settings.apiBaseUrl) {
    errors.push('apiBaseUrl is empty');
  }

  if (settings.defaultPageSize < 1) {
    errors.push('defaultPageSize must be >= 1');
  }

  if (settings.debounceTimeMs < 1) {
    errors.push('debounceTimeMs must be >= 1');
  }

  if (settings.quizTimerIntervalMs < 1) {
    errors.push('quizTimerIntervalMs must be >= 1');
  }

  if (!settings.storage.accessTokenKey) {
    errors.push('storage.accessTokenKey is empty');
  }

  if (!settings.storage.currentUserKey) {
    errors.push('storage.currentUserKey is empty');
  }

  if (errors.length > 0) {
    throw new Error(`AppSettings validation failed:\n  - ${errors.join('\n  - ')}`);
  }
}
