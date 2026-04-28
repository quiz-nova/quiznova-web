import { InjectionToken } from '@angular/core';

import { environment } from '@Environments/environment';

export interface AppSettings {
  appName: string;
  apiBaseUrl: string;
  production: boolean;
  enableDevTools: boolean;
}

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS');

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');

export const appSettings: AppSettings = {
  appName: environment.appName,
  apiBaseUrl: normalizeBaseUrl(environment.apiUrl),
  production: environment.production,
  enableDevTools: environment.enableDevTools,
};
