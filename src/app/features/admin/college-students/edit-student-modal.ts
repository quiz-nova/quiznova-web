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

import { EditButton } from '@shared/components/edit-button/edit-button';
import { FieldError } from '@shared/components/field-error/field-error';
import { Student } from '@shared/models/student/student.model';
import { StudentService } from '@shared/services/student.service';

type EditStudentFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phoneNumber: FormControl<string>;
}>;

@Component({
  selector: 'app-edit-student-modal',
  imports: [ReactiveFormsModule, DialogModule, FloatLabel, InputText, Password, EditButton, FieldError],
  template: `
    <app-edit-button
      (editButtonClicked)="openDialog()"
      ariaLabel="Edit student"
    ></app-edit-button>

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(40rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Edit Student"
    >
      <form class="edit-form" [formGroup]="EditStudentForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="edit-student-name"
              [fluid]="true"
              pInputText
              type="text"
              formControlName="name"
            />
            <label for="edit-student-name">Name</label>
          </p-floatlabel>
          @if (nameControl.invalid && nameControl.touched) {
            <app-field-error errorText="Name is required."/>
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="edit-student-email"
              [fluid]="true"
              pInputText
              type="email"
              formControlName="email"
            />
            <label for="edit-student-email">Email</label>
          </p-floatlabel>
          @if (emailControl.invalid && emailControl.touched) {
            @if (emailControl.hasError('required')) {
              <app-field-error errorText="Email is required."/>
            } @else if (emailControl.hasError('email')) {
              <app-field-error errorText="Please enter a valid email address."/>
            }
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <p-password
              [feedback]="false"
              [toggleMask]="true"
              [fluid]="true"
              inputId="edit-student-password"
              formControlName="password"
            />
            <label for="edit-student-password">Password</label>
          </p-floatlabel>
          @if (passwordControl.invalid && passwordControl.touched) {
            <app-field-error errorText="Password is required."/>
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="edit-student-phone"
              [fluid]="true"
              pInputText
              type="text"
              formControlName="phoneNumber"
            />
            <label for="edit-student-phone">Phone Number</label>
          </p-floatlabel>
          @if (phoneNumberControl.invalid && phoneNumberControl.touched) {
            <app-field-error errorText="Phone number is required."/>
          }
        </div>

        @if (submitError()) {
          <p class="submit-error">Failed to update student. Please check your input.</p>
        }

        <div class="form-actions">
          <button class="btn btn-gray" (click)="closeDialog()" type="button">Cancel</button>
          <button class="btn btn-green" [disabled]="isSubmitting()" type="submit">
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
export class EditStudentModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly studentService = inject(StudentService);

  readonly student = input.required<Student>();
  readonly updated = output<void>();

  protected readonly isDialogOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal(false);

  protected readonly EditStudentForm: EditStudentFormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
  });

  protected get nameControl() {
    return this.EditStudentForm.controls.name;
  }

  protected get emailControl() {
    return this.EditStudentForm.controls.email;
  }

  protected get passwordControl() {
    return this.EditStudentForm.controls.password;
  }

  protected get phoneNumberControl() {
    return this.EditStudentForm.controls.phoneNumber;
  }

  protected openDialog(): void {
    this.EditStudentForm.reset({
      name: this.student().name,
      email: this.student().email,
      password: this.student().password,
      phoneNumber: this.student().phoneNumber,
    });
    this.EditStudentForm.markAsPristine();
    this.EditStudentForm.markAsUntouched();
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
    if (this.EditStudentForm.invalid) {
      this.EditStudentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);

    this.studentService
      .updateStudent(this.student().studentId, this.EditStudentForm.getRawValue())
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
