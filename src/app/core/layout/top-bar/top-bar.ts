import { Component, output } from '@angular/core';

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
  `,
})
export class TopBar {
  toggleMenu = output<void>();
}
