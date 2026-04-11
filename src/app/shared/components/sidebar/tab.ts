import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';
import { ROLE_DEFINITIONS } from '../../models/user-role.model';

@Component({
  selector: 'app-tab',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      class="tab"
      [routerLink]="routeLink()"
      routerLinkActive="active"
      [routerLinkActiveOptions]="{ exact: true }"
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
        padding: 0.875rem 1rem;
        border-radius: 1rem;
        color: var(--clr-gray-600);
        font-size: var(--fs-500);
        font-weight: 600;
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
      .tab-banner {
        padding: 1rem;
      }
    `,
  ],
})
export class Tab {
  readonly tabName = input.required<string>();
  private readonly authService = inject(AuthService);
  private readonly iconMap: Record<string, string> = {
    Dashboard: 'fa-regular fa-grid-2',
    'My Courses': 'fa-regular fa-book-open',
    'Create Quiz': 'fa-regular fa-pen-to-square',
    'Question Bank': 'fa-regular fa-database',
    'Assign Quiz': 'fa-regular fa-clipboard-list',
    'View Results': 'fa-regular fa-eye',
    Analytics: 'fa-regular fa-chart-column',
    Profile: 'fa-regular fa-user',
    Quizzes: 'fa-regular fa-file-lines',
    Results: 'fa-regular fa-square-poll-vertical',
    Departments: 'fa-regular fa-building',
    Instructors: 'fa-regular fa-chalkboard-user',
    Students: 'fa-regular fa-users',
    Courses: 'fa-regular fa-book',
    Settings: 'fa-regular fa-gear',
  };

  protected readonly routeLink = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return null;

    const roleConfig = ROLE_DEFINITIONS[user.userRole];
    return roleConfig.actionRouteLinks?.[this.tabName()] ?? null;
  });

  protected readonly iconClass = computed(
    () => this.iconMap[this.tabName()] ?? 'fa-regular fa-circle',
  );
}
