import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { I18nBreadcrumbsService } from './i18n-breadcrumbs.service';
import { BreadcrumbConfig } from './models/breadcrumb-config.model';
import { currentPathFromSnapshot } from '../router/utils/route.utils';

/**
 * Method for resolving an I18n breadcrumb configuration object
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {I18nBreadcrumbsService} breadcrumbService
 * @returns BreadcrumbConfig object
 */
export const i18nBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
  breadcrumbService: I18nBreadcrumbsService = inject(I18nBreadcrumbsService),
): BreadcrumbConfig<string> => {
  const key = route.data['breadcrumbKey'];
  if (key == null) {
    throw new Error(
      'You provided an i18nBreadcrumbResolver for url "' +
        route.url +
        '" but no breadcrumbKey in the route\'s data',
    );
  }
  const fullPath = currentPathFromSnapshot(route);
  return { provider: breadcrumbService, key: key, url: fullPath };
};
