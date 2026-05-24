import { Component, input, output } from '@angular/core';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-navigation-buttons',
  imports: [Button],
  template: `
    <nav class="nav-actions" [attr.aria-label]="ariaLabel()">
      <button
        appButton
        variant="gray"
        [disabled]="!canGoPrevious()"
        type="button"
        (click)="previousButtonClicked.emit()"
      >
        {{ previousLabel() }}
      </button>
      <button
        appButton
        variant="green"
        [disabled]="!canGoNext()"
        type="button"
        (click)="nextButtonClicked.emit()"
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
  readonly canGoPrevious = input.required<boolean>();
  readonly canGoNext = input.required<boolean>();
  readonly previousLabel = input('Previous');
  readonly nextLabel = input('Next');
  readonly ariaLabel = input.required<string>();

  readonly previousButtonClicked = output<void>();
  readonly nextButtonClicked = output<void>();
}
