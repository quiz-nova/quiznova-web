import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT_USER_ROUTE } from '@Core/config/role.config';
import { AuthService } from '@Features/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
  selector: 'qn-breadcrumbs',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    @if (showBreadcrumbs()) {
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a [routerLink]="defualtRoute">{{ 'home.breadcrumbs' | translate }}</a>
          </li>
          @for (bc of breadcrumbs(); track bc.url; let last = $last) {
            <li class="breadcrumb-item" [class.active]="last">
              @if (!last) {
                <a [routerLink]="bc.url">{{ bc.text | translate }}</a>
              } @else {
                <span class="text-truncate">{{ bc.text | translate }}</span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
})
export class BreadcrumbsComponent {
  private authService = inject(AuthService);
  private breadcrumbsService = inject(BreadcrumbsService);
  readonly defualtRoute = DEFAULT_USER_ROUTE[this.authService.currentUser()!.role];
  readonly breadcrumbs = this.breadcrumbsService.breadcrumbs;
  readonly showBreadcrumbs = this.breadcrumbsService.showBreadcrumbs;
}
