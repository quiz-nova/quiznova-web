import { bootstrapApplication } from '@angular/platform-browser';

import { datadogRum } from '@datadog/browser-rum';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

datadogRum.init({
  applicationId: '1cc68f18-4ca4-4e61-97e8-a2a339475abc',
  clientToken: 'pub8a57176ddc46d9e85b17a627ba11d3dd',
  site: 'us5.datadoghq.com',
  service: 'quiznova-web',
  env: environment.isProduction ? 'prd' : 'dev',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
  allowedTracingUrls: [
    'http://localhost:8080',
    (url: string) => url.includes('.azurecontainerapps.io'),
    (url: string) => url.includes('quiznova'),
  ],
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
