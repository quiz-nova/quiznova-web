import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-navigation-buttons',
  imports: [],
  template: `
    <nav class="nav-actions" [attr.aria-label]="ariaLabel()">
      <button
        class="btn btn-gray"
        [disabled]="!canGoPrevious()"
        type="button"
        (click)="previousClicked.emit()"
      >
        {{ previousLabel() }}
      </button>
      <button
        class="btn btn-green"
        [disabled]="!canGoNext()"
        type="button"
        (click)="nextClicked.emit()"
      >
        {{ nextLabel() }}
      </button>
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

    button:disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }
  `,
})
export class NavigationButtons {
  readonly canGoPrevious = input(false);
  readonly canGoNext = input(false);
  readonly previousLabel = input('Previous');
  readonly nextLabel = input('Next');
  readonly ariaLabel = input('Navigation');

  readonly previousClicked = output<void>();
  readonly nextClicked = output<void>();
}
