import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UUIDService } from '@shared/services/uuid.service';

import { CorrelationIdService } from './correlation-id.service';
import { CookieService } from '../cookies/cookie.service';
import { CORRELATION_ID_COOKIE } from '../cookies/orejime-configuration';
import { OrejimeService } from '../cookies/orejime.service';
import { WindowService } from '../services/window.service';

describe('CorrelationIdService', () => {
  let service: CorrelationIdService;
  let cookieServiceMock: any;
  let uuidServiceMock: any;
  let orejimeServiceMock: any;

  beforeEach(() => {
    cookieServiceMock = {
      store: {} as Record<string, string>,
      get(key: string) {
        return this.store[key] || '';
      },
      set(key: string, value: string) {
        this.store[key] = value;
      },
    };

    uuidServiceMock = {
      generate: vi.fn().mockReturnValue('generated-uuid-1234'),
    };

    orejimeServiceMock = {
      getSavedPreferences: vi.fn().mockReturnValue(of({ 'correlation-id': true })),
      initialize: vi.fn(),
      showSettings: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CorrelationIdService,
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: UUIDService, useValue: uuidServiceMock },
        { provide: OrejimeService, useValue: orejimeServiceMock },
        { provide: WindowService, useValue: { nativeWindow: {} } },
      ],
    });

    service = TestBed.inject(CorrelationIdService);
  });

  describe('setCorrelationId', () => {
    const cookieCID = 'cookie CID';

    it('should set cookie and signal to newly generated value if neither exist', () => {
      service.setCorrelationId();

      expect(cookieServiceMock.get(CORRELATION_ID_COOKIE)).toBe('generated-uuid-1234');
      expect(service.getCorrelationId()).toBe('generated-uuid-1234');
    });

    it('should set signal to cookie value if cookie present', () => {
      cookieServiceMock.set(CORRELATION_ID_COOKIE, cookieCID);

      service.setCorrelationId();

      expect(cookieServiceMock.get(CORRELATION_ID_COOKIE)).toBe(cookieCID);
      expect(service.getCorrelationId()).toBe(cookieCID);
    });
  });
});
