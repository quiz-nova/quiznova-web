import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CORRELATION_ID_OREJIME_KEY } from '../cookies/orejime-configuration';
import { OrejimeService } from '../cookies/orejime.service';
import { CorrelationIdService } from '../correlation-id/correlation-id.service';

/**
 * Log Interceptor intercepting Http Requests & Responses to
 * exchange add headers of the user using the application utilizing unique id in cookies.
 * Add header for users current page path.
 */
@Injectable()
export class LogInterceptor implements HttpInterceptor {
  private cidService = inject(CorrelationIdService);
  private router = inject(Router);
  private orejimeService = inject(OrejimeService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.orejimeService.getSavedPreferences().pipe(
      switchMap((preferences) => {
        // Check if the user has declined correlation id tracking
        const correlationDeclined = !preferences || !preferences[CORRELATION_ID_OREJIME_KEY];

        // Add headers from the intercepted request
        let headers = request.headers;
        if (!correlationDeclined) {
          // Get the correlation id for the user from the store
          const correlationId = this.cidService.getCorrelationId();
          if (correlationId != null) {
            headers = headers.append('X-CORRELATION-ID', correlationId);
          }
        }
        headers = headers.append('X-REFERRER', this.router.url);

        // Add new headers to the intercepted request
        request = request.clone({ withCredentials: true, headers: headers });
        return next.handle(request);
      }),
    );
  }
}
