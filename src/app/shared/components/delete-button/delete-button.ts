import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  template: `
    <button
      class="delete-button"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      (click)="deleteButtonClicked.emit()"
      type="button"
    >
      <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
    </button>
  `,
  styles: [
    `
      .delete-button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        background-color: var(--clr-transparent);
        color: var(--clr-red-500);
        transition:
          background-color 0.3s ease,
          border-color 0.3s ease;
        inline-size: 2.5rem;
        block-size: 2.5rem;
        flex-shrink: 0;
      }

      .delete-button:hover:not(:disabled) {
        background-color: var(--clr-red-100);
      }

      .delete-button:focus-visible {
        outline: none;
        border-color: var(--clr-red-500);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-red-500) 20%, transparent);
      }

      .delete-button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButton {
  readonly ariaLabel = input('Delete item');
  readonly disabled = input(false);
  readonly deleteButtonClicked = output<void>();
}
