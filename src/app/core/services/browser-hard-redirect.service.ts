import { inject, Injectable, InjectionToken } from '@angular/core';

import { HardRedirectService } from './hard-redirect.service';
import { environment } from '../../../environments/environment';

export const LocationToken = new InjectionToken<Location>('Location', {
  providedIn: 'root',
  factory: () => window.location,
});

export function locationProvider(): Location {
  return window.location;
}

/**
 * Service for performing hard redirects within the browser app module
 */
@Injectable({ providedIn: 'root' })
export class BrowserHardRedirectService extends HardRedirectService {
  protected location = inject(LocationToken);

  /**
   * Perform a hard redirect to URL
   * @param url
   */
  redirect(url: string) {
    this.location.replace(url);
  }

  /**
   * Get the current route, with query params included
   * e.g. /search?page=1&query=open%20access
   */
  getCurrentRoute(): string {
    return this.location.pathname + this.location.search;
  }

  /**
   * Get the base public URL of our application.
   * This is used as the base URL for redirects, and should be in the format of
   * i.e. <scheme> "://" <hostname> [ ":" <port> ]
   */
  getBaseUrl(): string {
    return (environment as any).ui?.baseUrl || this.location.origin || '';
  }
}
