import { ActivatedRouteSnapshot, Router } from '@angular/router';

/**
 * Retrieves the current path string without query parameters
 */
export function currentPath(router: Router): string {
  const urlTree = router.parseUrl(router.url);
  const segments = urlTree.root.children['primary']?.segments;
  return segments ? '/' + segments.map((s) => s.path).join('/') : '/';
}

/**
 * Recursively climbs the ActivatedRouteSnapshot tree to build the full URL path
 * (e.g. combines parent '/admin' and child 'settings' into '/admin/settings')
 */
export function currentPathFromSnapshot(route: ActivatedRouteSnapshot): string {
  if (route.parent) {
    const parentPath = currentPathFromSnapshot(route.parent);
    const childPath = route.routeConfig?.path ?? '';

    // Cleanly join parent and child paths
    if (!parentPath) return childPath.startsWith('/') ? childPath : '/' + childPath;
    if (!childPath) return parentPath;
    return `${parentPath.replace(/\/$/, '')}/${childPath.replace(/^\//, '')}`;
  }

  return route.routeConfig?.path ? '/' + route.routeConfig.path : '';
}
