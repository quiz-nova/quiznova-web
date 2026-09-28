import { bootstrapApplication } from '@angular/platform-browser';

import * as Sentry from '@sentry/angular';

import { App } from './app/app';
import { appConfig } from './app/app.config';

Sentry.init({
  dsn: 'https://cac32201850ee1f01c12f5a2599679ff@o4512163593453568.ingest.de.sentry.io/4512163623731280',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of traces. Adjust this value in production.
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/quiznova-api\.purpleforest-454b82e9\.swedencentral\.azurecontainerapps\.io/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
