import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LogInterceptor } from './log.interceptor';
import { CORRELATION_ID_OREJIME_KEY } from '../cookies/orejime-configuration';
import { OrejimeService } from '../cookies/orejime.service';
import { CorrelationIdService } from '../correlation-id/correlation-id.service';

describe('LogInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  const mockOrejimeService = {
    getSavedPreferences: vi.fn(),
  };

  const mockCorrelationIdService = {
    getCorrelationId: vi.fn().mockReturnValue('123455'),
  };

  const mockRouter = {
    url: '/statistics',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LogInterceptor,
          multi: true,
        },
        { provide: Router, useValue: mockRouter },
        { provide: CorrelationIdService, useValue: mockCorrelationIdService },
        { provide: OrejimeService, useValue: mockOrejimeService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('headers should be set when cookie is accepted', () => {
    mockOrejimeService.getSavedPreferences.mockReturnValue(
      of({ [CORRELATION_ID_OREJIME_KEY]: true }),
    );

    httpClient.get('/api/test').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/api/test');
    expect(httpRequest.request.headers.has('X-CORRELATION-ID')).toBe(true);
    expect(httpRequest.request.headers.has('X-REFERRER')).toBe(true);
    expect(httpRequest.request.headers.get('X-CORRELATION-ID')).toBe('123455');
    expect(httpRequest.request.headers.get('X-REFERRER')).toBe('/statistics');
    httpRequest.flush({ id: 1 });
  });

  it('headers should not set correlation id when cookie is declined', () => {
    mockOrejimeService.getSavedPreferences.mockReturnValue(
      of({ [CORRELATION_ID_OREJIME_KEY]: false }),
    );

    httpClient.get('/api/test').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/api/test');
    expect(httpRequest.request.headers.has('X-CORRELATION-ID')).toBe(false);
    expect(httpRequest.request.headers.has('X-REFERRER')).toBe(true);
    expect(httpRequest.request.headers.get('X-REFERRER')).toBe('/statistics');
    httpRequest.flush({ id: 1 });
  });
});
