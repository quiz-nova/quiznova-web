import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  imports: [],
  template: `
    <button
      class="edit-button"
      [attr.aria-label]="ariaLabel()"
      [disabled]="isDisabled()"
      (click)="editButtonClicked.emit()"
      type="button"
    >
      <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
    </button>
  `,
  styles: `
    .edit-button {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      background-color: var(--clr-transparent);
      color: var(--clr-black-500);
      transition:
        background-color 0.3s ease,
        border-color 0.3s ease;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      flex-shrink: 0;
    }

    .edit-button:hover:not(:disabled) {
      background-color: var(--clr-violet-500);
      color: var(--clr-white);
    }

    .edit-button:focus-visible {
      outline: none;
      border-color: var(--clr-violet-500);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-violet-500) 20%, transparent);
    }

    .edit-button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditButton {
  readonly ariaLabel = input.required<string>();
  readonly isDisabled = input(false);
  readonly editButtonClicked = output<void>();
}
