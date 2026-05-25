import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
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

import { Button } from '@shared/components/button/button';
import { FieldError } from '@shared/components/field-error/field-error';
import { UserRole } from '@shared/models/users/user-role.model';
import { InstructorService } from '@shared/services/instructor.service';
import { CustomValidators } from '@shared/validators/custom-validators';

type AddInstructorFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phoneNumber: FormControl<string>;
  role: FormControl<UserRole>;
}>;

@Component({
  selector: 'app-add-instructor-modal',
  imports: [ReactiveFormsModule, FloatLabel, InputText, Password, DialogModule, FieldError, Button],
  template: `
    <button appButton variant="green" (click)="openDialog()" type="button">Add Instructor</button>

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(40rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Add Instructor"
    >
      <form class="add-form" [formGroup]="AddInstructorForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="instructor-name"
              [fluid]="true"
              [attr.aria-invalid]="nameControl.invalid && nameControl.touched ? 'true' : null"
              pInputText
              type="text"
              formControlName="name"
              aria-describedby="name-is-required-error name-minlength-error"
            />
            <label for="instructor-name">Name</label>
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
              id="instructor-email"
              [fluid]="true"
              [attr.aria-invalid]="emailControl.invalid && emailControl.touched ? 'true' : null"
              pInputText
              type="email"
              formControlName="email"
              aria-describedby="email-is-required-error please-enter-a-valid-email-address-error"
            />
            <label for="instructor-email">Email</label>
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
              inputId="instructor-password"
              formControlName="password"
              aria-describedby="password-is-required-error password-minlength-error password-strong-error"
            />
            <label for="instructor-password">Password</label>
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
              id="instructor-phone"
              [fluid]="true"
              [attr.aria-invalid]="
                phoneNumberControl.invalid && phoneNumberControl.touched ? 'true' : null
              "
              pInputText
              type="text"
              formControlName="phoneNumber"
              aria-describedby="phone-number-is-required-error phone-minlength-error phone-maxlength-error"
            />
            <label for="instructor-phone">Phone Number</label>
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
          <p class="submit-error">Failed to create instructor. Please check your input.</p>
        }

        @if (submitSuccess()) {
          <p class="submit-success">Instructor created successfully.</p>
        }

        <div class="form-actions">
          <button appButton variant="gray" (click)="closeDialog()" type="button">Cancel</button>
          <button appButton variant="green" [loading]="isSubmitting()" type="submit">
            {{ isSubmitting() ? 'Saving...' : 'Save Instructor' }}
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddInstructorModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly instructorService = inject(InstructorService);

  readonly created = output<void>();

  protected readonly isDialogOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal(false);
  protected readonly submitSuccess = signal(false);

  protected readonly AddInstructorForm: AddInstructorFormGroup = this.fb.group({
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
    role: [UserRole.instructor, [Validators.required]],
  });

  protected get nameControl() {
    return this.AddInstructorForm.controls.name;
  }

  protected get emailControl() {
    return this.AddInstructorForm.controls.email;
  }

  protected get passwordControl() {
    return this.AddInstructorForm.controls.password;
  }

  protected get phoneNumberControl() {
    return this.AddInstructorForm.controls.phoneNumber;
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
    this.AddInstructorForm.reset({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: UserRole.instructor,
    });
    this.AddInstructorForm.markAsPristine();
    this.AddInstructorForm.markAsUntouched();
    this.submitError.set(false);
  }

  protected onSubmit(): void {
    if (this.AddInstructorForm.invalid) {
      this.AddInstructorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);
    this.submitSuccess.set(false);

    this.instructorService.createInstructor(this.AddInstructorForm.getRawValue()).subscribe({
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
