import { Component, inject, input, output, signal } from '@angular/core';

import { DialogModule } from 'primeng/dialog';

import { DeleteButton } from '@shared/components/delete-button/delete-button';
import { Button } from '@shared/components/button/button';
import { Admin } from '@shared/models/users/admin.model';
import { AdminService } from '@shared/services/admin.service';

@Component({
  selector: 'app-delete-admin-modal',
  imports: [DialogModule, DeleteButton, Button],
  template: `
    <app-delete-button
      (deleteButtonClicked)="openDialog()"
      ariaLabel="Delete admin"
    ></app-delete-button>

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(30rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Delete Admin"
    >
      <p class="message">
        Are you sure you want to delete <strong>{{ admin().name }}</strong
      >?
      </p>

      @if (submitError()) {
        <p class="submit-error">Failed to delete admin. Please try again.</p>
      }

      <div class="actions">
        <button appButton variant="gray" (click)="closeDialog()" type="button">Cancel</button>
        <button appButton variant="red" [loading]="isSubmitting()" (click)="onDelete()" type="button">
          {{ isSubmitting() ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </p-dialog>
  `,
  styles: `
    .message {
      margin: 0;
      color: var(--clr-gray-600);
      line-height: 1.6;
    }

    .submit-error {
      margin: 1rem 0 0;
      color: var(--clr-red-500);
      font-size: 0.875rem;
      font-weight: 600;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
  `,
})
export class DeleteAdminModal {
  private readonly adminService = inject(AdminService);

  readonly admin = input.required<Admin>();
  readonly deleted = output<void>();

  protected readonly isDialogOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal(false);

  protected openDialog(): void {
    this.submitError.set(false);
    this.isDialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
  }

  protected onDialogVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
      return;
    }

    this.isDialogOpen.set(true);
  }

  protected onDelete(): void {
    this.isSubmitting.set(true);
    this.submitError.set(false);

    this.adminService.deleteAdmin(this.admin().id).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.deleted.emit();
        this.closeDialog();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submitError.set(true);
      },
    });
  }
}
