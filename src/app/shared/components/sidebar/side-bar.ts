import {Component, computed, inject} from '@angular/core';
import {Logo} from '../logo/logo';
import {ROLE_DEFINITIONS} from '../../models/user-role.model';
import {AuthService} from '../../../features/auth/auth.service';
import {TabGroup} from './tab-group';
import {Tab} from './tab';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-side-bar',
  imports: [Logo, TabGroup, Tab],
  template: `
    <aside class="side-bar">
      <app-logo/>

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
      .side-bar {
        display: grid;
        align-content: start;
        gap: 2rem;
        min-height: 100vh;
        padding: 1.75rem 1.25rem;
        background-color: var(--clr-white);
        border-right: 1px solid var(--clr-gray-200);
        width: 15vw;
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
