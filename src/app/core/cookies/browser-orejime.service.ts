import { inject, Injectable, InjectionToken, signal } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { CookieService } from './cookie.service';
import { ANONYMOUS_STORAGE_NAME_OREJIME, getOrejimeConfiguration } from './orejime-configuration';
import { OrejimeService } from './orejime.service';
import { AuthService } from '../../features/auth/auth.service';
import { WindowService } from '../services/window.service';

/**
 * Metadata key for cookie preferences
 */
export const COOKIE_MDFIELD = 'qn.agreements.cookies';

/**
 * Prefix keys for consent messages
 */
const cookieNameMessagePrefix = 'cookies.consent.app.title.';
const cookieDescriptionMessagePrefix = 'cookies.consent.app.description.';
const cookiePurposeMessagePrefix = 'cookies.consent.purpose.';

/**
 * Injection token for lazily loaded Orejime
 */
const LAZY_OREJIME = new InjectionToken<Promise<any>>('Lazily loaded Orejime', {
  providedIn: 'root',
  // @ts-expect-error Orejime dynamic import
  factory: async () => await import('orejime/dist/orejime'),
});

/**
 * Browser implementation for the OrejimeService
 */
@Injectable({
  providedIn: 'root',
})
export class BrowserOrejimeService extends OrejimeService {
  private _window = inject(WindowService);
  private translateService = inject(TranslateService);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private lazyOrejime = inject<Promise<any>>(LAZY_OREJIME);

  readonly isInitialized = signal<boolean>(false);

  /**
   * Initial Orejime configuration
   */
  orejimeConfig = JSON.parse(JSON.stringify(getOrejimeConfiguration(this._window)));

  private orejimeInstance: any;

  /**
   * Initializes the service
   */
  initialize() {
    this.addAppMessages();
    this.createCategories();
    this.translateConfiguration();

    const currentUser = this.authService.currentUser();
    const userId = currentUser?.id ?? '';
    const storageName = userId ? this.getStorageName(userId) : ANONYMOUS_STORAGE_NAME_OREJIME;
    this.orejimeConfig.cookieName = storageName;

    this.lazyOrejime
      .then(({ init }) => {
        if (init) {
          this.orejimeInstance = init(this.orejimeConfig);
          this.isInitialized.set(true);
        }
      })
      .catch((err) => {
        console.warn('Orejime initialization warning:', err);
      });
  }

  /**
   * Return saved preferences stored in cookie
   */
  getSavedPreferences(): Observable<any> {
    const currentUser = this.authService.currentUser();
    const userId = currentUser?.id ?? '';
    const storageName = userId ? this.getStorageName(userId) : ANONYMOUS_STORAGE_NAME_OREJIME;
    const rawCookie = this.cookieService.get(storageName);
    let parsed: any = null;
    if (rawCookie) {
      try {
        parsed = typeof rawCookie === 'string' ? JSON.parse(rawCookie) : rawCookie;
      } catch {
        parsed = rawCookie;
      }
    }
    return of(parsed);
  }

  /**
   * Show the cookie consent form
   */
  showSettings() {
    this.orejimeInstance?.show();
  }

  /**
   * Add message keys for all apps and purposes
   */
  addAppMessages() {
    this.orejimeConfig.apps.forEach((app: any) => {
      this.orejimeConfig.translations.zz[app.name] = {
        title: this.getTitleTranslation(app.name),
        description: this.getDescriptionTranslation(app.name),
      };
      app.purposes.forEach((purpose: string) => {
        this.orejimeConfig.translations.zz.purposes[purpose] = this.getPurposeTranslation(purpose);
      });
    });
  }

  /**
   * Translate the translation section from the Orejime configuration
   */
  translateConfiguration() {
    this.translate(this.orejimeConfig.translations.zz);
  }

  /**
   * Create categories based on the purposes of the apps
   */
  createCategories() {
    this.orejimeConfig.categories = this.orejimeConfig.apps.reduce(
      (accumulator: any[], current: any) => {
        let category = accumulator.find((cat) => cat.name === current.purposes[0]);
        if (!category) {
          category = {
            name: current.purposes[0],
            title: this.translateService.instant(this.getPurposeTranslation(current.purposes[0])),
            apps: [],
          };
          accumulator.push(category);
        }
        category.apps.push(current.name);
        return accumulator;
      },
      [],
    );
  }

  private translate(object: any): any {
    if (typeof object === 'string') {
      return this.translateService.instant(object);
    }
    if (object && typeof object === 'object') {
      Object.entries(object).forEach(([key, value]: [string, any]) => {
        object[key] = this.translate(value);
      });
    }
    return object;
  }

  private getTitleTranslation(title: string) {
    return cookieNameMessagePrefix + title;
  }

  private getDescriptionTranslation(description: string) {
    return cookieDescriptionMessagePrefix + description;
  }

  private getPurposeTranslation(purpose: string) {
    return cookiePurposeMessagePrefix + purpose;
  }

  getStorageName(identifier: string) {
    return 'orejime-' + identifier;
  }
}
