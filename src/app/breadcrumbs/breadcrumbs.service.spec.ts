import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { BreadcrumbsProviderService } from '@Core/breadcrumps/breadcrumbsProviderService';
import { BreadcrumbConfig } from '@Core/breadcrumps/models/breadcrumb-config.model';
import { Breadcrumb } from '@Core/breadcrumps/models/breadcrumb.model';
import { Observable, of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { BreadcrumbsService } from './breadcrumbs.service';

class TestBreadcrumbsService implements BreadcrumbsProviderService<string> {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return of([{ text: key, url }]);
  }
}

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;
  let routerEventsObs: Subject<any>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let currentRootRoute: Partial<ActivatedRoute>;
  let breadcrumbProvider: TestBreadcrumbsService;
  let breadcrumbConfigA: BreadcrumbConfig<string>;
  let breadcrumbConfigB: BreadcrumbConfig<string>;

  const initBreadcrumbs = () => {
    breadcrumbProvider = new TestBreadcrumbsService();
    breadcrumbConfigA = { provider: breadcrumbProvider, key: 'example.path', url: 'example.com' };
    breadcrumbConfigB = { provider: breadcrumbProvider, key: 'another.path', url: 'another.com' };
  };

  const changeActivatedRoute = (newRootRoute: any) => {
    currentRootRoute = newRootRoute;
    routerEventsObs.next(new NavigationEnd(0, '', ''));
  };

  beforeEach(() => {
    initBreadcrumbs();
    routerEventsObs = new Subject<any>();

    routerMock = {
      events: routerEventsObs.asObservable(),
    };

    activatedRouteMock = {
      get root() {
        return currentRootRoute as ActivatedRoute;
      },
    };

    TestBed.configureTestingModule({
      providers: [
        BreadcrumbsService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });
    service = TestBed.inject(BreadcrumbsService);
    service.listenForRouteChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('breadcrumbs signal', () => {
    it('should update breadcrumbs signal corresponding to the current route', () => {
      const route1 = {
        snapshot: {
          data: { breadcrumb: breadcrumbConfigA },
          routeConfig: { resolve: { breadcrumb: {} } },
        },
      };

      const expectation1 = [{ text: breadcrumbConfigA.key, url: breadcrumbConfigA.url }];

      changeActivatedRoute(route1);
      expect(service.breadcrumbs()).toEqual(expectation1);

      const route2 = {
        snapshot: {
          data: { breadcrumb: breadcrumbConfigA },
          routeConfig: { resolve: { breadcrumb: {} } },
        },
        firstChild: {
          snapshot: {
            data: { breadcrumb: breadcrumbConfigA },
          },
          firstChild: {
            snapshot: {
              data: { breadcrumb: breadcrumbConfigB },
              routeConfig: { resolve: { breadcrumb: {} } },
            },
          },
        },
      };

      const expectation2 = [
        { text: breadcrumbConfigA.key, url: breadcrumbConfigA.url },
        { text: breadcrumbConfigB.key, url: breadcrumbConfigB.url },
      ];

      changeActivatedRoute(route2);
      expect(service.breadcrumbs()).toEqual(expectation2);
    });
  });

  describe('showBreadcrumbs signal', () => {
    it('should return showBreadcrumbs value based on route data', () => {
      const route1 = {
        snapshot: {
          data: {
            breadcrumb: breadcrumbConfigA,
            showBreadcrumbs: false,
          },
          routeConfig: { resolve: { breadcrumb: {} } },
        },
      };

      changeActivatedRoute(route1);
      expect(service.showBreadcrumbs()).toBe(false);

      const route2 = {
        snapshot: {
          data: {
            breadcrumb: breadcrumbConfigA,
            showBreadcrumbs: true,
          },
          routeConfig: { resolve: { breadcrumb: {} } },
        },
      };

      changeActivatedRoute(route2);
      expect(service.showBreadcrumbs()).toBe(true);
    });

    it('should return false when last part of route has no breadcrumb in data', () => {
      const route1 = {
        snapshot: {
          data: {},
          routeConfig: { resolve: { breadcrumb: {} } },
        },
      };

      changeActivatedRoute(route1);
      expect(service.showBreadcrumbs()).toBe(false);
    });
  });
});
