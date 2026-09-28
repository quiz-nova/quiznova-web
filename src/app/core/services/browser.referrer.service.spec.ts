import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BrowserReferrerService } from './browser.referrer.service';
import { HardRedirectService } from './hard-redirect.service';
import { RouteService } from './route.service';

describe('BrowserReferrerService', () => {
  let service: BrowserReferrerService;
  const documentReferrer = 'https://www.referrer.com';
  const origin = 'https://www.quiznova.org';
  let routeServiceMock: Partial<RouteService>;

  beforeEach(() => {
    routeServiceMock = {
      getHistory: () => of([]),
    };

    TestBed.configureTestingModule({
      providers: [
        BrowserReferrerService,
        { provide: DOCUMENT, useValue: { referrer: documentReferrer } },
        { provide: RouteService, useValue: routeServiceMock },
        { provide: HardRedirectService, useValue: { getBaseUrl: () => origin } },
      ],
    });
    service = TestBed.inject(BrowserReferrerService);
  });

  describe('getReferrer', () => {
    describe('when the history is empty', () => {
      beforeEach(() => {
        vi.spyOn(routeServiceMock, 'getHistory').mockReturnValue(of([]));
      });

      it('should return document.referrer', () => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(documentReferrer);
        });
      });
    });

    describe('when the history only contains the current route', () => {
      beforeEach(() => {
        vi.spyOn(routeServiceMock, 'getHistory').mockReturnValue(of(['/current/route']));
      });

      it('should return document.referrer', () => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(documentReferrer);
        });
      });
    });

    describe('when the history contains multiple routes', () => {
      const prevUrl = '/the/route/we/need';
      beforeEach(() => {
        vi.spyOn(routeServiceMock, 'getHistory').mockReturnValue(
          of(['/first/route', '/second/route', prevUrl, '/current/route']),
        );
      });

      it('should return the last route before current combined with origin', () => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(origin + prevUrl);
        });
      });
    });
  });
});
