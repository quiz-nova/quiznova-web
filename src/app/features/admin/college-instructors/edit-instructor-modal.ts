import { Component, inject, input, output, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormControl,
  type FormGroup,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { EditButton } from '../../../shared/components/edit-button/edit-button';
import { Instructor } from '../../../shared/models/instructor/instructor.model';
import { InstructorService } from '../../../shared/services/instructor.service';

type EditInstructorFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phoneNumber: FormControl<string>;
}>;

@Component({
  selector: 'app-edit-instructor-modal',
  imports: [ReactiveFormsModule, DialogModule, FloatLabel, InputText, Password, EditButton],
  template: `
    <app-edit-button ariaLabel="Edit instructor" (edited)="openDialog()"></app-edit-button>

    <p-dialog
      header="Edit Instructor"
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(40rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
    >
      <form class="edit-form" [formGroup]="EditInstructorForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              pInputText
              id="edit-instructor-name"
              type="text"
              formControlName="name"
              [fluid]="true"
            />
            <label for="edit-instructor-name">Name</label>
          </p-floatlabel>
          <div class="field-error">
            @if (nameControl.invalid && nameControl.touched) {
              <span>Name is required.</span>
            }
          </div>
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              pInputText
              id="edit-instructor-email"
              type="email"
              formControlName="email"
              [fluid]="true"
            />
            <label for="edit-instructor-email">Email</label>
          </p-floatlabel>
          <div class="field-error">
            @if (emailControl.invalid && emailControl.touched) {
              @if (emailControl.hasError('required')) {
                <span>Email is required.</span>
              } @else if (emailControl.hasError('email')) {
                <span>Please enter a valid email address.</span>
              }
            }
          </div>
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <p-password
              inputId="edit-instructor-password"
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
              [fluid]="true"
            />
            <label for="edit-instructor-password">Password</label>
          </p-floatlabel>
          <div class="field-error">
            @if (passwordControl.invalid && passwordControl.touched) {
              <span>Password is required.</span>
            }
          </div>
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              pInputText
              id="edit-instructor-phone"
              type="text"
              formControlName="phoneNumber"
              [fluid]="true"
            />
            <label for="edit-instructor-phone">Phone Number</label>
          </p-floatlabel>
          <div class="field-error">
            @if (phoneNumberControl.invalid && phoneNumberControl.touched) {
              <span>Phone number is required.</span>
            }
          </div>
        </div>

        @if (submitError()) {
          <p class="submit-error">Failed to update instructor. Please check your input.</p>
        }

        <div class="form-actions">
          <button type="button" class="btn btn-gray" (click)="closeDialog()">Cancel</button>
          <button type="submit" class="btn btn-green" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: `
    .edit-form {
      display: grid;
      gap: 1rem;
      padding-top: 0.5rem;
    }

    .form-field {
      display: grid;
      gap: 0.5rem;
    }

    .field-error {
      min-height: 1.25rem;
      color: var(--clr-red-500);
      font-size: 0.875rem;
    }

    .submit-error {
      color: var(--clr-red-500);
      font-size: 0.875rem;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
  `,
})
export class EditInstructorModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly instructorService = inject(InstructorService);

  readonly instructor = input.required<Instructor>();
  readonly updated = output<void>();

  protected readonly isDialogOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal(false);

  protected readonly EditInstructorForm: EditInstructorFormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
  });

  protected get nameControl() {
    return this.EditInstructorForm.controls.name;
  }

  protected get emailControl() {
    return this.EditInstructorForm.controls.email;
  }

  protected get passwordControl() {
    return this.EditInstructorForm.controls.password;
  }

  protected get phoneNumberControl() {
    return this.EditInstructorForm.controls.phoneNumber;
  }

  protected openDialog(): void {
    this.EditInstructorForm.reset({
      name: this.instructor().name,
      email: this.instructor().email,
      password: this.instructor().password,
      phoneNumber: this.instructor().phoneNumber,
    });
    this.EditInstructorForm.markAsPristine();
    this.EditInstructorForm.markAsUntouched();
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

  protected onSubmit(): void {
    if (this.EditInstructorForm.invalid) {
      this.EditInstructorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);

    this.instructorService
      .updateInstructor(this.instructor().instructorId, this.EditInstructorForm.getRawValue())
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.updated.emit();
          this.closeDialog();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.submitError.set(true);
        },
      });
  }
}
