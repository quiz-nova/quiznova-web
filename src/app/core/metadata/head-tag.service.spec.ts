import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { TRANSLATION_TOKENS } from '@Core/config/language.config';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HeadTagService } from './head-tag.service';

describe('HeadTagService', () => {
  let headTagService: HeadTagService;
  let meta: Meta;
  let title: Title;
  let translateService: TranslateService;
  let router: Router;
  let onLangChangeSubject: Subject<any>;

  beforeEach(() => {
    meta = {
      addTag: vi.fn(),
      updateTag: vi.fn(),
      removeTag: vi.fn(),
    } as any;

    title = {
      setTitle: vi.fn(),
    } as any;

    onLangChangeSubject = new Subject<any>();

    translateService = {
      get: vi.fn((key: string) => {
        if (key === TRANSLATION_TOKENS.APP.TITLE.PREFIX) {
          return of('QuizNova - ');
        }
        return of(key);
      }),
      onLangChange: onLangChangeSubject,
    } as any;

    router = {
      url: '/home',
      events: of(new NavigationEnd(1, '/home', '/home')),
      routerState: {
        root: {},
      },
    } as any;

    TestBed.configureTestingModule({
      providers: [
        HeadTagService,
        { provide: Meta, useValue: meta },
        { provide: Title, useValue: title },
        { provide: TranslateService, useValue: translateService },
        { provide: Router, useValue: router },
      ],
    });

    headTagService = TestBed.inject(HeadTagService);
  });

  it('should create', () => {
    expect(headTagService).toBeTruthy();
  });

  it('should process route change WITH title and set prefix + title, updating activeTitle', () => {
    (headTagService as any).processRouteChange({
      title: 'home.title',
      description: 'home.description',
    });

    expect(title.setTitle).toHaveBeenCalledWith('QuizNova - home.title');
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: 'QuizNova - home.title',
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'home.description',
    });
    expect(headTagService.activeTitle()).toBe('QuizNova - home.title');
  });

  it('should process route change WITHOUT title and set pure default title without prefix, updating activeTitle', () => {
    (headTagService as any).processRouteChange({
      description: 'home.description',
    });

    expect(title.setTitle).toHaveBeenCalledWith(TRANSLATION_TOKENS.DEFAULT.PAGE.TITLE);
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: TRANSLATION_TOKENS.DEFAULT.PAGE.TITLE,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'home.description',
    });
    expect(headTagService.activeTitle()).toBe(TRANSLATION_TOKENS.DEFAULT.PAGE.TITLE);
  });

  it('should update title when language changes', () => {
    (headTagService as any).processRouteChange({
      title: 'home.title',
      description: 'home.description',
    });

    vi.mocked(title.setTitle).mockClear();

    onLangChangeSubject.next({ lang: 'ar', translations: {} });

    expect(title.setTitle).toHaveBeenCalledWith('QuizNova - home.title');
  });

  it('should listen for route change and process it using snapshot data and params', () => {
    const mockRoute = {
      snapshot: {
        params: { id: '123' },
        data: { title: 'quiz.title', description: 'quiz.description' },
      },
      firstChild: null,
    };
    (router.routerState as any).root = mockRoute;

    vi.spyOn(headTagService as any, 'processRouteChange');

    headTagService.listenForRouteChange();

    expect((headTagService as any).processRouteChange).toHaveBeenCalledWith({
      id: '123',
      title: 'quiz.title',
      description: 'quiz.description',
    });
  });

  it('should add meta tag and update tagsInUse when content is provided', () => {
    headTagService.addMetaTag('keywords', 'quiz, test');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'keywords', content: 'quiz, test' });
    expect(headTagService.tagsInUse()).toEqual(['keywords']);
  });

  it('should not add meta tag or update tagsInUse when content is empty', () => {
    headTagService.addMetaTag('keywords', '');
    expect(meta.addTag).not.toHaveBeenCalled();
    expect(headTagService.tagsInUse()).toEqual([]);
  });

  it('should add multiple meta tags when array is provided', () => {
    vi.spyOn(headTagService, 'addMetaTag');
    headTagService.addMetaTags('keywords', ['quiz', 'test']);
    expect(headTagService.addMetaTag).toHaveBeenCalledTimes(2);
    expect(headTagService.addMetaTag).toHaveBeenCalledWith('keywords', 'quiz');
    expect(headTagService.addMetaTag).toHaveBeenCalledWith('keywords', 'test');
  });

  it('should not add meta tags when array is not provided', () => {
    vi.spyOn(headTagService, 'addMetaTag');
    headTagService.addMetaTags('keywords', null as any);
    expect(headTagService.addMetaTag).not.toHaveBeenCalled();
  });

  it('should clear meta tags and reset tagsInUse signal', () => {
    headTagService.addMetaTag('keywords', 'quiz, test');
    headTagService.clearMetaTags();
    expect(meta.removeTag).toHaveBeenCalledWith("name='keywords'");
    expect(headTagService.tagsInUse()).toEqual([]);
  });
});
