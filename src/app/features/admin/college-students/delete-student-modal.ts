import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import { Student } from '@shared/models/users/student.model';
import { StudentService } from '@shared/services/student.service';

@Component({
  selector: 'app-delete-student-modal',
  imports: [Dialog, Button],
  template: `
    <p-button
      [rounded]="true"
      [text]="true"
      (onClick)="openDialog()"
      ariaLabel="Delete student"
      icon="pi pi-trash"
      severity="danger"
    />

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(30rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Delete Student"
    >
      <p class="message">
        Are you sure you want to delete <strong>{{ student().personalInformation.name }}</strong
        >?
      </p>

      @if (submitError()) {
        <p class="submit-error">Failed to delete student. Please try again.</p>
      }

      <div class="actions">
        <p-button
          [text]="true"
          (onClick)="closeDialog()"
          label="Cancel"
          severity="secondary"
          type="button"
        />
        <p-button
          [loading]="isSubmitting()"
          (onClick)="onDelete()"
          label="Delete"
          severity="danger"
          type="button"
        />
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteStudentModal {
  private readonly studentService = inject(StudentService);

  readonly student = input.required<Student>();
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

    this.studentService.deleteStudent(this.student().id).subscribe({
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
