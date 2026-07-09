/* eslint-disable @angular-eslint/component-selector */
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
    class: 'btn',
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
      padding: 0.75rem 1.25rem;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      font-weight: 600;
      transition:
        background-color 0.2s var(--ease-standard),
        color 0.2s var(--ease-standard),
        border-color 0.2s var(--ease-standard),
        transform 0.15s var(--ease-standard),
        box-shadow 0.2s var(--ease-standard);
      cursor: pointer;
    }

    :host(:focus-visible) {
      outline: none;
      border-color: var(--clr-green-400);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-green-400) 25%, transparent);
    }

    :host(:disabled),
    :host([disabled]) {
      background-color: var(--clr-gray-100);
      color: var(--clr-gray-500);
      opacity: 0.6;
      cursor: not-allowed;
      border-color: var(--clr-gray-200);
      transform: none !important;
      box-shadow: none !important;
    }

    :host(.btn-green:not(:disabled):not([disabled])) {
      background-color: var(--clr-green-400);
      color: var(--clr-white);
    }

    :host(.btn-green:not(:disabled):not([disabled])):hover {
      background-color: var(--clr-green-600);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(18, 165, 136, 0.2);
    }

    :host(.btn-green:not(:disabled):not([disabled])):active {
      background-color: var(--clr-green-800);
      transform: translateY(1px);
    }

    :host(.btn-gray:not(:disabled):not([disabled])) {
      background-color: var(--clr-gray-50);
      border-color: var(--clr-gray-500);
      color: var(--clr-blue-900);
    }

    :host(.btn-gray:not(:disabled):not([disabled])):hover {
      background-color: var(--clr-gray-100);
      border-color: var(--clr-violet-500);
      color: var(--clr-violet-700);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(130, 84, 211, 0.1);
    }

    :host(.btn-gray:not(:disabled):not([disabled])):active {
      background-color: var(--clr-gray-200);
      transform: translateY(1px);
    }

    :host(.btn-red:not(:disabled):not([disabled])) {
      background-color: var(--clr-red-500);
      color: var(--clr-white);
    }

    :host(.btn-red:not(:disabled):not([disabled])):hover {
      background-color: var(--clr-red-600);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    }

    :host(.btn-red:not(:disabled):not([disabled])):active {
      background-color: var(--clr-red-700);
      transform: translateY(1px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<'green' | 'gray' | 'red'>('green');
  readonly loading = input(false);
  readonly disabled = input(false);
}
