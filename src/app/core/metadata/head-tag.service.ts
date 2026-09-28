import { inject, Injectable, signal } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TRANSLATION_TOKENS } from '@Core/config/language.config';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeadTagService {
  protected router = inject(Router);
  protected translate = inject(TranslateService);
  protected meta = inject(Meta);
  protected title = inject(Title);

  readonly activeTitle = signal<string>('');
  readonly tagsInUse = signal<string[]>([]);
  private lastRouteInfo: any = null;

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      this.processRouteChange(this.lastRouteInfo);
    });
  }

  public listenForRouteChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map((route: ActivatedRoute) => {
          route = this.getCurrentRoute(route);
          return { ...route.snapshot.params, ...route.snapshot.data };
        }),
      )
      .subscribe((routeInfo: any) => {
        this.processRouteChange(routeInfo);
      });
  }

  protected processRouteChange(routeData: any): void {
    this.lastRouteInfo = routeData;
    this.clearMetaTags();

    const hasRouteTitle = Boolean(routeData?.['title']);

    if (hasRouteTitle) {
      const titlePrefix$ = this.translate.get(TRANSLATION_TOKENS.APP.TITLE.PREFIX);
      const title$ = this.translate.get(routeData['title'], routeData);

      combineLatest([titlePrefix$, title$])
        .pipe(take(1))
        .subscribe(([prefix, title]) => {
          const fullTitle = `${prefix || ''}${title || ''}`;
          this.title.setTitle(fullTitle);
          this.meta.updateTag({ name: 'title', content: fullTitle });
          this.activeTitle.set(fullTitle);
        });
    } else {
      this.translate
        .get(TRANSLATION_TOKENS.DEFAULT.PAGE.TITLE)
        .pipe(take(1))
        .subscribe((defaultTitle: string) => {
          this.title.setTitle(defaultTitle);
          this.meta.updateTag({ name: 'title', content: defaultTitle });
          this.activeTitle.set(defaultTitle);
        });
    }

    const descKey = routeData?.['description'] ?? TRANSLATION_TOKENS.DEFAULT.PAGE.DESCRIPTION;
    this.translate
      .get(descKey)
      .pipe(take(1))
      .subscribe((translatedDesc: string) => {
        this.meta.updateTag({ name: 'description', content: translatedDesc });
      });
  }

  protected getCurrentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  public addMetaTag(name: string, content: string): void {
    if (content) {
      const tag = { name, content } as MetaDefinition;
      this.meta.addTag(tag);
      this.tagsInUse.update((tags) => [...tags, name]);
    }
  }

  public addMetaTags(name: string, content: string[]): void {
    if (Array.isArray(content)) {
      for (const value of content) {
        this.addMetaTag(name, value);
      }
    }
  }

  public clearMetaTags(): void {
    for (const name of this.tagsInUse()) {
      this.meta.removeTag(`name='${name}'`);
    }
    this.tagsInUse.set([]);
  }
}
