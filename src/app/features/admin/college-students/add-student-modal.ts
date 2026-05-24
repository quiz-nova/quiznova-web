import { Component, inject, output, signal } from '@angular/core';
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

import { FieldError } from '@shared/components/field-error/field-error';
import { Button } from '@shared/components/button/button';
import { UserRole } from '@shared/models/users/user-role.model';
import { StudentService } from '@shared/services/student.service';
import { CustomValidators } from '@shared/validators/custom-validators';

type AddStudentFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phoneNumber: FormControl<string>;
  role: FormControl<UserRole>;
}>;

@Component({
  selector: 'app-add-student-modal',
  imports: [ReactiveFormsModule, FloatLabel, InputText, Password, DialogModule, FieldError, Button],
  template: `
    <button appButton variant="green" (click)="openDialog()" type="button">Add Student</button>

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(40rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Add Student"
    >
      <form class="add-form" [formGroup]="AddStudentForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="student-name"
              [fluid]="true"
              [attr.aria-invalid]="nameControl.invalid && nameControl.touched ? 'true' : null"
              pInputText
              type="text"
              formControlName="name"
              aria-describedby="name-is-required-error name-minlength-error"
            />
            <label for="student-name">Name</label>
          </p-floatlabel>
          @if (nameControl.invalid && nameControl.touched) {
            @if (nameControl.hasError('required')) {
              <app-field-error id="name-is-required-error">Name is required.</app-field-error>
            }
            @if (nameControl.hasError('minlength')) {
              <app-field-error id="name-minlength-error"
                >Name must be at least 3 characters.</app-field-error
              >
            }
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="student-email"
              [fluid]="true"
              [attr.aria-invalid]="emailControl.invalid && emailControl.touched ? 'true' : null"
              pInputText
              type="email"
              formControlName="email"
              aria-describedby="email-is-required-error please-enter-a-valid-email-address-error"
            />
            <label for="student-email">Email</label>
          </p-floatlabel>
          @if (emailControl.invalid && emailControl.touched) {
            @if (emailControl.hasError('required')) {
              <app-field-error id="email-is-required-error">Email is required.</app-field-error>
            } @else if (emailControl.hasError('email')) {
              <app-field-error id="please-enter-a-valid-email-address-error"
                >Please enter a valid email address.</app-field-error
              >
            }
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <p-password
              [feedback]="false"
              [toggleMask]="true"
              [fluid]="true"
              [attr.aria-invalid]="
                passwordControl.invalid && passwordControl.touched ? 'true' : null
              "
              inputId="student-password"
              formControlName="password"
              aria-describedby="password-is-required-error password-minlength-error password-strong-error"
            />
            <label for="student-password">Password</label>
          </p-floatlabel>
          @if (passwordControl.invalid && passwordControl.touched) {
            @if (passwordControl.hasError('required')) {
              <app-field-error id="password-is-required-error"
                >Password is required.</app-field-error
              >
            }
            @if (passwordControl.hasError('minlength')) {
              <app-field-error id="password-minlength-error"
                >Password must be at least 8 characters.</app-field-error
              >
            }
            @if (passwordControl.hasError('strongPassword')) {
              <app-field-error id="password-strong-error"
                >Password must contain uppercase, lowercase, number, and special
                character.</app-field-error
              >
            }
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="student-phone"
              [fluid]="true"
              [attr.aria-invalid]="
                phoneNumberControl.invalid && phoneNumberControl.touched ? 'true' : null
              "
              pInputText
              type="text"
              formControlName="phoneNumber"
              aria-describedby="phone-number-is-required-error phone-minlength-error phone-maxlength-error"
            />
            <label for="student-phone">Phone Number</label>
          </p-floatlabel>
          @if (phoneNumberControl.invalid && phoneNumberControl.touched) {
            @if (phoneNumberControl.hasError('required')) {
              <app-field-error id="phone-number-is-required-error"
                >Phone number is required.</app-field-error
              >
            }
            @if (phoneNumberControl.hasError('minlength')) {
              <app-field-error id="phone-minlength-error"
                >Phone number must be at least 7 characters.</app-field-error
              >
            }
            @if (phoneNumberControl.hasError('maxlength')) {
              <app-field-error id="phone-maxlength-error"
                >Phone number cannot exceed 15 characters.</app-field-error
              >
            }
          }
        </div>

        @if (submitError()) {
          <p class="submit-error">Failed to create student. Please check your input.</p>
        }

        @if (submitSuccess()) {
          <p class="submit-success">Student created successfully.</p>
        }

        <div class="form-actions">
          <button appButton variant="gray" (click)="closeDialog()" type="button">Cancel</button>
          <button appButton variant="green" [loading]="isSubmitting()" type="submit">
            {{ isSubmitting() ? 'Saving...' : 'Save Student' }}
          </button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: `
    .add-form {
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

    .submit-success {
      color: var(--clr-green-500);
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
export class AddStudentModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly studentService = inject(StudentService);

  readonly created = output<void>();

  protected readonly isDialogOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal(false);
  protected readonly submitSuccess = signal(false);

  protected readonly AddStudentForm: AddStudentFormGroup = this.fb.group({
    name: ['', [Validators.required, CustomValidators.trimMinLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, CustomValidators.trimMinLength(8), CustomValidators.strongPassword()],
    ],
    phoneNumber: [
      '',
      [Validators.required, CustomValidators.trimMinLength(7), CustomValidators.trimMaxLength(15)],
    ],
    role: [UserRole.student, [Validators.required]],
  });

  protected get nameControl() {
    return this.AddStudentForm.controls.name;
  }

  protected get emailControl() {
    return this.AddStudentForm.controls.email;
  }

  protected get passwordControl() {
    return this.AddStudentForm.controls.password;
  }

  protected get phoneNumberControl() {
    return this.AddStudentForm.controls.phoneNumber;
  }

  protected openDialog(): void {
    this.submitError.set(false);
    this.submitSuccess.set(false);
    this.isDialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.resetForm();
  }

  protected onDialogVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    } else {
      this.isDialogOpen.set(true);
    }
  }

  protected resetForm(): void {
    this.AddStudentForm.reset({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: UserRole.student,
    });
    this.AddStudentForm.markAsPristine();
    this.AddStudentForm.markAsUntouched();
    this.submitError.set(false);
  }

  protected onSubmit(): void {
    if (this.AddStudentForm.invalid) {
      this.AddStudentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);
    this.submitSuccess.set(false);

    this.studentService.createStudent(this.AddStudentForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.created.emit();
        this.closeDialog();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submitError.set(true);
      },
    });
  }
}
