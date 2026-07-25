import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { APP_SETTINGS, appSettings, validateSettings } from '@Core/config/app.settings';
import { authInterceptor } from '@Core/interceptors/auth.interceptor';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

const QuizNovaPreset = definePreset(Aura, {
  primitive: {
    fontFamily: "'Inter', sans-serif",
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '5px',
      md: '10px',
      lg: '15px',
      xl: '20px',
    },
  },
  semantic: {
    primary: {
      50: '#f0faf8',
      100: '#eaf6f3',
      200: '#a7f3d0',
      300: '#42b7a0',
      400: '#12a588',
      500: '#0f9f73',
      600: '#0f8a71',
      700: '#15803d',
      800: '#0c6e5a',
      900: '#064e3b',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.400}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.800}',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: QuizNovaPreset,
        options: {
          darkModeSelector: false,
          cssLayer: false,
        },
      },
    }),
    MessageService,
    {
      provide: APP_SETTINGS,
      useValue: appSettings,
    },
    provideAppInitializer(() => validateSettings(appSettings)),
  ],
};
