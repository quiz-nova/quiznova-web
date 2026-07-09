import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-confirm-action-modal',
  imports: [FormsModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="modal-backdrop"
      (click)="onCancel()"
      (keyup.escape)="onCancel()"
      tabindex="-1"
      role="presentation"
    >
      <div
        class="modal-dialog"
        (click)="$event.stopPropagation()"
        (keyup.escape)="onCancel()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div class="modal-header">
          <i [class]="headerIconClass()" aria-hidden="true"></i>
          <h3 id="confirm-modal-title">{{ title() }}</h3>
        </div>
        <div class="modal-body">
          <p [class]="'modal-warning-text ' + variant()">
            <i [class]="bodyIconClass()" aria-hidden="true"></i>
            {{ warningMessage() }}
          </p>
          <p class="modal-instruction">
            To confirm, type <strong>{{ confirmationPhrase() }}</strong> below:
          </p>
          <input
            class="modal-confirm-input focus-green-ring"
            id="confirm-action-input"
            [(ngModel)]="confirmationInput"
            type="text"
            placeholder="Type the phrase to confirm"
            autocomplete="off"
          />
        </div>
        <div class="modal-actions">
          <button (click)="onCancel()" appButton variant="gray" type="button">Cancel</button>
          <button
            [variant]="confirmButtonVariant()"
            [disabled]="confirmationInput !== confirmationPhrase()"
            (click)="onConfirm()"
            appButton
            type="button"
          >
            {{ confirmButtonText() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      background: rgb(0 0 0 / 50%);
      backdrop-filter: blur(4px);
    }

    .modal-dialog {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-width: 28rem;
      width: 90%;
      padding: 1.75rem;
      border-radius: var(--radius-lg);
      background: var(--clr-white);
      box-shadow: 0 20px 60px rgb(0 0 0 / 25%);
      animation: modal-enter 0.2s ease-out;
    }

    @keyframes modal-enter {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(0.5rem);
      }

      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-warning-icon {
      font-size: 1.5rem;
    }

    .modal-warning-icon.danger {
      color: var(--clr-red-500);
    }

    .modal-warning-icon.info {
      color: var(--clr-blue-500);
    }

    .modal-warning-icon.success {
      color: var(--clr-green-500);
    }

    .modal-header h3 {
      font-size: var(--fs-600);
      font-weight: 700;
      color: var(--clr-blue-900);
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .modal-warning-text {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      font-size: var(--fs-400);
      line-height: 1.5;
    }

    .modal-warning-text.danger {
      border-color: var(--clr-red-200);
      background-color: var(--clr-red-50);
      color: var(--clr-red-800);
    }

    .modal-warning-text.info {
      border-color: var(--clr-blue-200);
      background-color: var(--clr-blue-100);
      color: var(--clr-blue-700);
    }

    .modal-warning-text.success {
      border-color: var(--clr-green-200);
      background-color: var(--clr-green-50);
      color: var(--clr-green-800);
    }

    .modal-warning-text i {
      margin-top: 0.15rem;
      flex-shrink: 0;
    }

    .modal-instruction {
      color: var(--clr-gray-600);
      font-size: var(--fs-400);
    }

    .modal-confirm-input {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: var(--radius-sm);
      font-size: var(--fs-400);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `,
})
export class ConfirmActionModal {
  readonly title = input.required<string>();
  readonly warningMessage = input.required<string>();
  readonly confirmationPhrase = input.required<string>();
  readonly confirmButtonText = input('I understand, confirm');
  readonly variant = input<'danger' | 'info' | 'success'>('danger');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected confirmationInput = '';

  protected readonly headerIconClass = computed(() => {
    switch (this.variant()) {
      case 'info':
        return 'fa-solid fa-circle-info modal-warning-icon info';
      case 'success':
        return 'fa-solid fa-circle-check modal-warning-icon success';
      case 'danger':
      default:
        return 'fa-solid fa-triangle-exclamation modal-warning-icon danger';
    }
  });

  protected readonly bodyIconClass = computed(() => {
    switch (this.variant()) {
      case 'info':
        return 'fa-solid fa-circle-info';
      case 'success':
        return 'fa-solid fa-circle-check';
      case 'danger':
      default:
        return 'fa-solid fa-circle-exclamation';
    }
  });

  protected readonly confirmButtonVariant = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'red';
      case 'info':
      case 'success':
      default:
        return 'green';
    }
  });

  protected onConfirm(): void {
    this.confirmationInput = '';
    this.confirmed.emit();
  }

  protected onCancel(): void {
    this.confirmationInput = '';
    this.cancelled.emit();
  }
}
