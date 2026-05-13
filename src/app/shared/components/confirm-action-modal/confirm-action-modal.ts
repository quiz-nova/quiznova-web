import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-action-modal',
  imports: [FormsModule],
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
          <i class="fa-solid fa-triangle-exclamation modal-warning-icon" aria-hidden="true"></i>
          <h3 id="confirm-modal-title">{{ title() }}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-warning-text">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            {{ warningMessage() }}
          </p>
          <p class="modal-instruction">
            To confirm, type <strong>{{ confirmationPhrase() }}</strong> below:
          </p>
          <input
            class="modal-confirm-input focus-green-ring"
            [(ngModel)]="confirmationInput"
            type="text"
            placeholder="Type the phrase to confirm"
            autocomplete="off"
            id="confirm-action-input"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-gray" (click)="onCancel()" type="button">Cancel</button>
          <button
            class="btn btn-danger"
            [disabled]="confirmationInput !== confirmationPhrase()"
            (click)="onConfirm()"
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
      border-radius: 1rem;
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
      color: var(--clr-red-500);
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
      border: 1px solid #fecaca;
      border-radius: 0.5rem;
      background-color: #fef2f2;
      color: #991b1b;
      font-size: var(--fs-400);
      line-height: 1.5;
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
      border-radius: 0.5rem;
      font-size: var(--fs-400);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn-danger {
      background-color: var(--clr-red-500);
      color: var(--clr-white);
      border: none;
      padding: 0.55rem 1.15rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #b91c1c;
    }

    .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class ConfirmActionModal {
  readonly title = input.required<string>();
  readonly warningMessage = input.required<string>();
  readonly confirmationPhrase = input.required<string>();
  readonly confirmButtonText = input('I understand, confirm');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected confirmationInput = '';

  protected onConfirm(): void {
    this.confirmationInput = '';
    this.confirmed.emit();
  }

  protected onCancel(): void {
    this.confirmationInput = '';
    this.cancelled.emit();
  }
}
