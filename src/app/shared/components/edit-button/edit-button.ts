import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  imports: [],
  template: `
    <button
      class="edit-button"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      (click)="editButtonClicked.emit()"
      type="button"
    >
      <i class="fa-regular fa-pen-to-square"></i>
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

    .edit-button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class EditButton {
  readonly ariaLabel = input('edit item');
  readonly disabled = input(false);
  readonly editButtonClicked = output<void>();
}
