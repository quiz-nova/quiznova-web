import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private nativeWindowRef = inject(WindowService);

  readonly history = signal<string[]>([]);

  constructor() {
    this.saveRouting();
  }

  public saveRouting(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.history.update((prev) => [...prev, event.urlAfterRedirects]);
      });
  }

  public getHistory(): Observable<string[]> {
    return of(this.history());
  }

  public getCurrentUrl(): Observable<string> {
    const hist = this.history();
    return of(hist[hist.length - 1] || '');
  }

  public getPreviousUrl(): Observable<string> {
    const hist = this.history();
    return of(hist[hist.length - 2] || '');
  }

  public getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.getQueryParamMap().pipe(
      map((params) => [...params.getAll(paramName)]),
      distinctUntilChanged(
        (a, b) => a.length === b.length && a.every((val, index) => val === b[index]),
      ),
    );
  }

  public getQueryParameterValue(paramName: string): Observable<string | null> {
    return this.getQueryParamMap().pipe(
      map((params) => params.get(paramName)),
      distinctUntilChanged(),
    );
  }

  public hasQueryParam(paramName: string): Observable<boolean> {
    return this.getQueryParamMap().pipe(
      map((params) => params.has(paramName)),
      distinctUntilChanged(),
    );
  }

  public hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.getQueryParamMap().pipe(
      map((params) => params.getAll(paramName).indexOf(paramValue) > -1),
      distinctUntilChanged(),
    );
  }

  public getRouteParameterValue(paramName: string): Observable<string | null> {
    return this.route.params.pipe(
      map((params) => params[paramName] ?? null),
      distinctUntilChanged(),
    );
  }

  public getRouteDataValue(datafield: string): Observable<any> {
    return this.route.data.pipe(
      map((data) => data[datafield]),
      distinctUntilChanged(),
    );
  }

  public getQueryParamMap(): Observable<any> {
    return this.route.queryParamMap;
  }

  public storeUrlInSession(key: string, url: string): void {
    const currentValue = this.nativeWindowRef?.nativeWindow?.sessionStorage.getItem(key);
    if (currentValue !== url) {
      this.nativeWindowRef?.nativeWindow?.sessionStorage.setItem(key, url);
    }
  }

  public getUrlFromSession(key: string): string | null {
    return this.nativeWindowRef?.nativeWindow?.sessionStorage.getItem(key) ?? null;
  }
}
