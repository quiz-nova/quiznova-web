import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';

import { appSettings, validateSettings } from '@Core/config/app.settings';
import { HeadTagService } from '@Core/metadata/head-tag.service';
import { LanguageService } from '@Core/services/language.service';

import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';

export const AppInitializers: EnvironmentProviders[] = [
  provideAppInitializer(() => validateSettings(appSettings)),
  provideAppInitializer(() => inject(LanguageService).initLanguage()),
  provideAppInitializer(() => {
    inject(HeadTagService).listenForRouteChange();
    inject(BreadcrumbsService).listenForRouteChanges();
  }),
];
