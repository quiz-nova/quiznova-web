import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Breadcrumb } from '@Core/breadcrumps/models/breadcrumb.model';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly breadcrumbs = signal<Breadcrumb[]>([]);
  readonly showBreadcrumbs = signal<boolean>(true);

  listenForRouteChanges(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        tap(() => this.showBreadcrumbs.set(true)),
        switchMap(() => this.resolveBreadcrumbs(this.route.root)),
      )
      .subscribe((crumbs) => {
        this.breadcrumbs.set(crumbs);
      });
  }

  private resolveBreadcrumbs(route: ActivatedRoute): Observable<Breadcrumb[]> {
    const data = route.snapshot.data;

    const last = !route.firstChild;

    // visiablity of the breadcrumps based on the last node,
    // the component that visualize breadcrumps breadcrumps.ts will read this signal
    if (last) {
      if (data?.['showBreadcrumbs'] !== undefined) {
        this.showBreadcrumbs.set(data['showBreadcrumbs']);
      } else if (!data?.['breadcrumb']) {
        this.showBreadcrumbs.set(false);
      }
    }
    // check if the current route has a configured the breadcrump resolver output
    // the resolver the url and the key
    if (data?.['breadcrumb']?.provider && route.snapshot.routeConfig?.resolve?.['breadcrumb']) {
      const { provider, key, url } = data['breadcrumb'];
      const currentBreadcrumbs$ = provider.getBreadcrumbs(key, url) as Observable<Breadcrumb[]>;
      if (!last) {
        return combineLatest([currentBreadcrumbs$, this.resolveBreadcrumbs(route.firstChild)]).pipe(
          map((crumbs) => crumbs.flat()),
        );
      } else {
        return currentBreadcrumbs$;
      }
    }

    return !last ? this.resolveBreadcrumbs(route.firstChild) : of([]);
  }
}
