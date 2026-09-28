import { DOCUMENT, inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HardRedirectService } from './hard-redirect.service';
import { ReferrerService } from './referrer.service';
import { RouteService } from './route.service';
import { URLCombiner } from '../url-combiner/url-combiner';

/**
 * A service to determine the referrer
 *
 * The browser implementation will get the referrer from document.referrer, in the event that the
 * previous page visited was not an angular URL. If it was, the route history in the store must be
 * used, since document.referrer doesn't get updated on route changes
 */
@Injectable({ providedIn: 'root' })
export class BrowserReferrerService extends ReferrerService {
  protected document = inject(DOCUMENT);
  protected routeService = inject(RouteService);
  protected hardRedirectService = inject(HardRedirectService);

  /**
   * Return the referrer
   *
   * Return the referrer URL based on the route history in the store. If there is no route history
   * in the store yet, document.referrer will be used
   */
  public getReferrer(): Observable<string> {
    return this.routeService.getHistory().pipe(
      map((history: string[]) => {
        const currentURL = history[history.length - 1];
        // if the current URL isn't set yet, or the only URL in the history is the current one,
        // return document.referrer (note that that may be empty too, e.g. if you've just opened a
        // new browser tab)
        if (currentURL == null || history.every((url: string) => url === currentURL)) {
          return this.document.referrer;
        } else {
          // reverse the history
          const reversedHistory = [...history].reverse();
          // and find the first URL that differs from the current one
          const prevUrl = reversedHistory.find((url: string) => url !== currentURL);
          return new URLCombiner(this.hardRedirectService.getBaseUrl(), prevUrl || '').toString();
        }
      }),
    );
  }
}
