import { Component, output } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  imports: [],
  template: `
    <header class="dashboard-top-bar">
      <button
        type="button"
        class="dashboard-top-bar__menu-btn focus-green-ring"
        (click)="toggleMenu.emit()"
        aria-label="Toggle sidebar"
      >
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
      </button>

      <button
        type="button"
        class="dashboard-top-bar__logout btn btn-gray focus-green-ring"
        aria-label="Logout"
      >
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
        <span>Logout</span>
      </button>
    </header>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ff-heading);
    }
  `,
})
export class TopBar {
  toggleMenu = output<void>();
}
