import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [],
  template: `
    @if (loading()) {
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
    }
    <ng-content></ng-content>
  `,
  host: {
    'class': 'btn',
    '[class.btn-green]': 'variant() === "green"',
    '[class.btn-gray]': 'variant() === "gray"',
    '[class.btn-red]': 'variant() === "red"',
    '[attr.disabled]': 'disabled() || loading() ? "" : null',
    '[attr.aria-disabled]': 'disabled() || loading() ? "true" : null',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: fit-content;
      min-height: 3rem;
      padding: 0.75rem 1rem;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      transition:
        background-color 0.2s ease-in-out,
        color 0.2s ease-in-out,
        border-color 0.2s ease-in-out;
      cursor: pointer;
    }

    :host(:disabled), :host([disabled]) {
      background-color: var(--clr-gray-100);
      color: var(--clr-gray-500);
      opacity: 0.6;
      cursor: not-allowed;
      border-color: var(--clr-gray-200);
    }

    :host(.btn-green:not(:disabled):not([disabled])) {
      background-color: var(--clr-green-500);
      color: var(--clr-white);
    }

    :host(.btn-gray:not(:disabled):not([disabled])) {
      background-color: var(--clr-gray-50);
      border-color: var(--clr-gray-500);
      color: var(--clr-blue-900);
    }

    :host(.btn-gray:not(:disabled):not([disabled])):hover {
      background-color: var(--clr-violet-500);
      color: var(--clr-white);
    }

    :host(.btn-red:not(:disabled):not([disabled])) {
      background-color: var(--clr-red-500);
      color: var(--clr-white);
    }

    :host(.btn-red:not(:disabled):not([disabled])):hover {
      background-color: var(--clr-red-700);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<'green' | 'gray' | 'red'>('green');
  readonly loading = input(false);
  readonly disabled = input(false);
}
