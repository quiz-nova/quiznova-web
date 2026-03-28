import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, Type } from '@angular/core';
import { Logo } from '../logo/logo';
import { ROLE_DEFINITIONS } from '../../models/user-role.model';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../models/user.model';
import { TabGroup } from './tab-group/tab-group';
import { Tab } from './tab/tab';

@Component({
  selector: 'app-side-bar',
  imports: [Logo, TabGroup, Tab, NgComponentOutlet],
  template: `
    <div class="side-bar">
      <app-logo />

      <p class="user-role">{{ currentUser()?.userRole }}</p>

      <app-tab-group>
        @for (action of roleActions(); track action) {
          <app-tab [tabName]="action">
            <ng-container [ngComponentOutlet]="getComponentForAction(action)"></ng-container>
          </app-tab>
        }
      </app-tab-group>
    </div>
  `,
  styles: [],
})
export class SideBar {
  private readonly authService = inject(AuthService);

  readonly currentUser = computed<User | null>(() => this.authService.currentUser());
  readonly roleActions = computed<string[]>(() => {
    const role = this.currentUser()?.userRole;
    return role ? [...ROLE_DEFINITIONS[role].actions] : [];
  });

  getComponentForAction(action: string): Type<unknown> | null {
    const role = this.currentUser()?.userRole;
    if (!role) {
      return null;
    }

    return ROLE_DEFINITIONS[role].actionComponents[action] ?? null;
  }
}
