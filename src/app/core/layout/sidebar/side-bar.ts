import { Component, computed, inject } from '@angular/core';

import { Tab } from '@Core/layout/sidebar/tab';
import { TabGroup } from '@Core/layout/sidebar/tab-group';
import { AuthService } from '@Features/auth/auth.service';

import { Logo } from '@shared/components/logo/logo';
import { ROLE_DEFINITIONS } from '@shared/models/user/user-role.model';
import { User } from '@shared/models/user/user.model';


@Component({
  selector: 'app-side-bar',
  imports: [Logo, TabGroup, Tab],
  template: `
    <aside class="side-bar">
      <app-logo />

      <p class="user-role">{{ currentUser()?.role }}</p>

      <app-tab-group>
        @for (action of roleActions(); track action) {
          <app-tab [tabName]="action"></app-tab>
        }
      </app-tab-group>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .side-bar {
        display: grid;
        align-content: start;
        gap: 2rem;
        min-height: 100%;
        padding: 1.75rem 1.25rem;
        background-color: var(--clr-white);
        border-right: 1px solid var(--clr-gray-200);
        width: 100%;
      }

      .user-role {
        color: var(--clr-gray-600);
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
    `,
  ],
})
export class SideBar {
  private readonly authService = inject(AuthService);

  protected readonly currentUser = computed<User | null>(() => this.authService.currentUser());

  protected readonly roleActions = computed<string[]>(() => {
    const role = this.currentUser()?.role;
    return role ? [...ROLE_DEFINITIONS[role].actions] : [];
  });
}
