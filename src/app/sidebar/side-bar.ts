import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, signal, Type } from '@angular/core';
import { Logo } from '../shared/components/logo/logo';
import { ROLE_DEFINITIONS, ROLES } from '../shared/models/user-role.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/models/user.model';
import { TabGroup } from './tab-group/tab-group';
import { Tab } from './tab/tab';

@Component({
  selector: 'app-side-bar',
  imports: [Logo, TabGroup, Tab, NgComponentOutlet],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  private readonly roles = signal(ROLES);
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
