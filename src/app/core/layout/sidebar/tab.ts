import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@Features/auth/auth.service';

import { ROLE_DEFINITIONS } from '@shared/models/user/user-role.model';
import { User } from '@shared/models/user/user.model';


@Component({
  selector: 'app-tab',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      class="tab"
      [routerLink]="routeLink()"
      [routerLinkActiveOptions]="{ exact: true }"
      routerLinkActive="active"
    >
      <i class="tab-icon" [class]="iconClass()" aria-hidden="true"></i>
      <span class="tab-label">{{ tabName() }}</span>
    </a>
  `,
  styles: [
    `
      .tab {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        min-height: 3.5rem;
        padding: 0.5rem;
        border-radius: 1rem;
        color: var(--clr-gray-600);
        font-size: var(--fs-500);
        transition:
          background-color 0.2s ease-in-out,
          color 0.2s ease-in-out;
      }

      .tab:hover {
        background-color: var(--clr-green-100);
        color: var(--clr-green-500);
      }

      .tab.active {
        background-color: var(--clr-green-100);
        color: var(--clr-green-500);
      }

      .tab-icon {
        width: 1.125rem;
        text-align: center;
        font-size: 1rem;
      }
    `,
  ],
})
export class Tab {
  readonly tabName = input.required<string>();
  private readonly authService = inject(AuthService);
  private readonly iconMap: Record<string, string> = {
    Dashboard: 'fa-solid fa-gauge',
    'My Courses': 'fa-solid fa-book-open',
    'Create Quiz': 'fa-solid fa-pen-to-square',
    'Question Bank': 'fa-solid fa-database',
    'Assign Quiz': 'fa-solid fa-clipboard-list',
    'View Results': 'fa-solid fa-eye',
    Quizzes: 'fa-solid fa-file-lines',
    'Quiz Attempts': 'fa-solid fa-list-check',
    Results: 'fa-solid fa-square-poll-vertical',
    Instructors: 'fa-solid fa-chalkboard-user',
    Students: 'fa-solid fa-users',
    Courses: 'fa-solid fa-book',
    Admins: 'fa-solid fa-user-shield',
    Settings: 'fa-solid fa-gear',
  };

  protected readonly routeLink = computed(() => {
    const user: User | null = this.authService.currentUser();
    if (!user) return null;

    const roleConfig = ROLE_DEFINITIONS[user.role];
    return roleConfig.actionRouteLinks?.[this.tabName()] ?? null;
  });

  protected readonly iconClass = computed(
    () => this.iconMap[this.tabName()] ?? 'fa-solid fa-circle',
  );
}
