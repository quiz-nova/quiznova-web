import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@Features/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  imports: [],
  template: `
    <header class="dashboard-top-bar">
      <button
        class="dashboard-top-bar__menu-btn focus-green-ring"
        (click)="toggleMenu.emit()"
        type="button"
        aria-label="Toggle sidebar"
      >
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
      </button>

      <button
        class="dashboard-top-bar__logout btn btn-gray focus-green-ring"
        type="button"
        aria-label="Logout"
        (click)="onLogout()"
      >
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
        <span>Logout</span>
      </button>
    </header>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ff-heading), serif;
    }

    .dashboard-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 2rem;
      border-bottom: 1px solid var(--clr-gray-200);
      background-color: var(--clr-white);
    }

    .dashboard-top-bar__menu-btn {
      display: inline-grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid var(--clr-gray-500);
      border-radius: var(--radius-md);
      color: var(--clr-blue-900);
      transition:
        background-color 0.2s ease-in-out,
        border-color 0.2s ease-in-out,
        color 0.2s ease-in-out;

      &:hover {
        border-color: var(--clr-violet-500);
        background-color: var(--clr-violet-500);
        color: var(--clr-white);
      }
    }

    .dashboard-top-bar__logout {
      min-width: 7.5rem;
      font-weight: 600;
    }
  `,
})
export class TopBar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  toggleMenu = output<void>();

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
