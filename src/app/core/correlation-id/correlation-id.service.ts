import { inject, Injectable, signal } from '@angular/core';

import { UUIDService } from '@shared/services/uuid.service';

import { CookieService } from '../cookies/cookie.service';
import {
  CORRELATION_ID_COOKIE,
  CORRELATION_ID_OREJIME_KEY,
} from '../cookies/orejime-configuration';
import { OrejimeService } from '../cookies/orejime.service';
import { WindowService } from '../services/window.service';

/**
 * Service to manage the correlation id using Angular Signals.
 */
@Injectable({
  providedIn: 'root',
})
export class CorrelationIdService {
  protected cookieService = inject(CookieService);
  protected uuidService = inject(UUIDService);
  protected orejimeService = inject(OrejimeService);
  protected _window = inject(WindowService);

  readonly correlationId = signal<string | null>(null);

  constructor() {
    if (this._window?.nativeWindow) {
      (this._window.nativeWindow as any).initCorrelationId = () => this.initCorrelationId();
    }
  }

  /**
   * Check if correlation id is allowed to be set, then set it
   */
  initCorrelationId(): void {
    this.orejimeService?.getSavedPreferences().subscribe((preferences) => {
      if (preferences != null && preferences[CORRELATION_ID_OREJIME_KEY]) {
        this.setCorrelationId();
      }
    });
  }

  /**
   * Initialize the correlation id based on cookie or generate a new one
   */
  setCorrelationId(): void {
    let cid = this.cookieService.get(CORRELATION_ID_COOKIE);

    if (!cid) {
      cid = this.getCorrelationId();
    }

    if (!cid) {
      cid = this.uuidService.generate();
    }

    this.correlationId.set(cid);
    this.cookieService.set(CORRELATION_ID_COOKIE, cid);
  }

  /**
   * Get current correlation id
   */
  getCorrelationId(): string | null {
    return this.correlationId();
  }
}
