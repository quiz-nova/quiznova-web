import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-buttons',
  imports: [],
  template: `
    <nav class="nav-actions" aria-label="Question navigation">
      <button type="button" class="btn btn-gray">Previous</button>
      <button type="button" class="btn btn-green">Next</button>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    .nav-actions {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
  `,
})
export class NavigationButtons {}
