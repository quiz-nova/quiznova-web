import { DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { DEFAULT_USER_ROUTE } from '@Core/config/role.config';
import { AuthService } from '@Features/auth/auth.service';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';

import { UserRole } from '@shared/models/users/user-role.model';

import { BreadcrumbsComponent } from './breadcrumbs';
import { BreadcrumbsService } from './breadcrumbs.service';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadcrumbsServiceMock: Partial<BreadcrumbsService>;
  const authServiceMock = {
    currentUser: signal({
      id: '00000000-0000-0000-0000-000000000000',
      role: UserRole.student,
      personalInformation: {
        name: 'Test User',
        email: 'test.user@example.com',
        phoneNumber: '1234567890',
      },
    }),
  };

  const expectBreadcrumb = (listItem: DebugElement, text: string, url: string | null) => {
    const anchor = listItem.query(By.css('a'));

    if (url == null) {
      expect(anchor).toBeNull();
      expect(listItem.nativeElement.innerHTML).toContain(text);
    } else {
      expect(anchor).toBeTruthy();
      expect(anchor.attributes['href']).toEqual(url);
      expect(anchor.nativeElement.innerHTML).toContain(text);
    }
  };

  beforeEach(async () => {
    breadcrumbsServiceMock = {
      breadcrumbs: signal([
        { text: 'bc 1', url: 'example.com' },
        { text: 'bc 2', url: 'another.com' },
      ]),
      showBreadcrumbs: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: BreadcrumbsService, useValue: breadcrumbsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the breadcrumbs', () => {
    const breadcrumbs = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
    expect(breadcrumbs.length).toBe(3);
    expectBreadcrumb(
      breadcrumbs[0],
      'home.breadcrumbs',
      DEFAULT_USER_ROUTE[authServiceMock.currentUser()!.role],
    );
    expectBreadcrumb(breadcrumbs[1], 'bc 1', '/example.com');
    expectBreadcrumb(breadcrumbs[2].query(By.css('.text-truncate')), 'bc 2', null);
  });
});
