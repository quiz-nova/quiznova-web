import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, NavigationEnd, Params, Router } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;
  const paramName1 = 'name';
  const paramValue1 = 'Test Name';
  const paramName2 = 'id';
  const paramValue2a = 'Test id';
  const paramValue2b = 'another id';
  const nonExistingParamName = 'non existing name';
  const nonExistingParamValue = 'non existing value';

  const paramObject: Params = {
    [paramName1]: paramValue1,
    [paramName2]: [paramValue2a, paramValue2b],
  };

  let queryParamMap$: BehaviorSubject<any>;
  let queryParams$: BehaviorSubject<any>;
  let events$: Subject<any>;

  beforeEach(() => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap(paramObject));
    queryParams$ = new BehaviorSubject(paramObject);
    events$ = new Subject();

    const activatedRouteMock = {
      queryParamMap: queryParamMap$.asObservable(),
      queryParams: queryParams$.asObservable(),
      params: queryParams$.asObservable(),
      data: new BehaviorSubject({}).asObservable(),
    };

    const routerMock = {
      events: events$.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [
        RouteService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    service = TestBed.inject(RouteService);
  });

  describe('hasQueryParam', () => {
    it('should return true when the parameter name exists', () => {
      service.hasQueryParam(paramName1).subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });

    it('should return false when parameter does not exist', () => {
      service.hasQueryParam(nonExistingParamName).subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

  describe('hasQueryParamWithValue', () => {
    it('should return true when parameter exists and contains specified value', () => {
      service.hasQueryParamWithValue(paramName2, paramValue2a).subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });

    it('should return false when parameter exists and does not contain value', () => {
      service.hasQueryParamWithValue(paramName1, nonExistingParamValue).subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('should return false when parameter does not exist', () => {
      service
        .hasQueryParamWithValue(nonExistingParamName, nonExistingParamValue)
        .subscribe((status) => {
          expect(status).toBeFalsy();
        });
    });
  });

  describe('getQueryParameterValues', () => {
    it('should return list of values when parameter exists', () => {
      service.getQueryParameterValues(paramName2).subscribe((params) => {
        expect(params).toEqual([paramValue2a, paramValue2b]);
      });
    });

    it('should return empty array when parameter does not exist', () => {
      service.getQueryParameterValues(nonExistingParamName).subscribe((params) => {
        expect(params).toEqual([]);
      });
    });
  });

  describe('getQueryParameterValue', () => {
    it('should return single value when parameter exists', () => {
      service.getQueryParameterValue(paramName1).subscribe((params) => {
        expect(params).toEqual(paramValue1);
      });
    });

    it('should return only first value when parameter has multiple values', () => {
      service.getQueryParameterValue(paramName2).subscribe((params) => {
        expect(params).toEqual(paramValue2a);
      });
    });

    it('should return null when parameter does not exist', () => {
      service.getQueryParameterValue(nonExistingParamName).subscribe((params) => {
        expect(params).toBeNull();
      });
    });
  });

  describe('saveRouting', () => {
    it('should update history signal on NavigationEnd event', () => {
      events$.next(new NavigationEnd(0, 'url', 'url'));
      events$.next(new NavigationEnd(1, 'newurl', 'newurl'));

      expect(service.history()).toEqual(['url', 'newurl']);
    });
  });

  describe('getCurrentUrl and getPreviousUrl', () => {
    it('should return current and previous url from history signal', () => {
      service.history.set(['url', 'newurl']);

      service.getCurrentUrl().subscribe((url) => {
        expect(url).toEqual('newurl');
      });

      service.getPreviousUrl().subscribe((url) => {
        expect(url).toEqual('url');
      });
    });
  });
});
