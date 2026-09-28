import { REQUEST } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CookieService, ICookieService } from './cookie.service';

describe(CookieService.name, () => {
  let service: ICookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService, { provide: REQUEST, useValue: {} }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CookieService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should construct', () => {
    expect(service).toBeDefined();
  });
});
