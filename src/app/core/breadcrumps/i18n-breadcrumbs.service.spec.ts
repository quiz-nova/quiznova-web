import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { BREADCRUMB_MESSAGE_POSTFIX, I18nBreadcrumbsService } from './i18n-breadcrumbs.service';

describe('I18nBreadcrumbsService', () => {
  let service: I18nBreadcrumbsService;
  let exampleString: string;
  let exampleURL: string;

  beforeEach(() => {
    exampleString = 'example.string';
    exampleURL = 'example.com';
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nBreadcrumbsService);
  });

  describe('getBreadcrumbs', () => {
    it('should return a breadcrumb based on a string by adding the postfix', () => {
      service.getBreadcrumbs(exampleString, exampleURL).subscribe((breadcrumbs) => {
        expect(breadcrumbs).toEqual([
          { text: exampleString + BREADCRUMB_MESSAGE_POSTFIX, url: exampleURL },
        ]);
      });
    });
  });
});
