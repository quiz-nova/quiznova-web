import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

import {
  DEFAULT_LANGUAGE,
  isRtlLanguage,
  LANGUAGE_STORAGE_KEY,
  LanguageOption,
  SUPPORTED_LANGUAGES,
} from '@Core/config/language.config';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);

  readonly supportedLanguages: LanguageOption[] = SUPPORTED_LANGUAGES;
  readonly currentLang = signal<string>(DEFAULT_LANGUAGE);
  readonly currentDir = computed<'ltr' | 'rtl'>(() =>
    isRtlLanguage(this.currentLang()) ? 'rtl' : 'ltr',
  );

  initLanguage(): void {
    this.translate.setFallbackLang(DEFAULT_LANGUAGE);

    let savedLang = DEFAULT_LANGUAGE;
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        savedLang = stored;
      } else if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.split('-')[0];
        if (SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
          savedLang = browserLang;
        }
      }
    } catch {
      savedLang = DEFAULT_LANGUAGE;
    }

    this.applyLanguage(savedLang);
  }

  setLanguage(langCode: string): void {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === langCode)) {
      return;
    }

    const apply = () => {
      this.applyLanguage(langCode);
    };

    const doc = this.document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };

    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => apply());
    } else {
      apply();
    }
  }

  private applyLanguage(langCode: string): void {
    this.currentLang.set(langCode);
    this.translate.use(langCode);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const dir = isRtlLanguage(langCode) ? 'rtl' : 'ltr';
    this.document.documentElement.dir = dir;
    this.document.documentElement.lang = langCode;
  }
}
