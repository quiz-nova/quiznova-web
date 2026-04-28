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
import { UserRole } from '@shared/models/user/user-role.model';
import { InstructorService } from '@shared/services/instructor.service';

type AddInstructorFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phoneNumber: FormControl<string>;
  role: FormControl<UserRole>;
}>;

@Component({
  selector: 'app-add-instructor-modal',
  imports: [ReactiveFormsModule, FloatLabel, InputText, Password, DialogModule, FieldError],
  template: `
    <button class="btn btn-green" (click)="openDialog()" type="button">Add Instructor</button>

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
              pInputText
              type="text"
              formControlName="name"
            />
            <label for="instructor-name">Name</label>
          </p-floatlabel>
          @if (nameControl.invalid && nameControl.touched) {
            <app-field-error errorText="Name is required."/>
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="instructor-email"
              [fluid]="true"
              pInputText
              type="email"
              formControlName="email"
            />
            <label for="instructor-email">Email</label>
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
              inputId="instructor-password"
              formControlName="password"
            />
            <label for="instructor-password">Password</label>
          </p-floatlabel>
          @if (passwordControl.invalid && passwordControl.touched) {
            <app-field-error errorText="Password is required."/>
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <input
              id="instructor-phone"
              [fluid]="true"
              pInputText
              type="text"
              formControlName="phoneNumber"
            />
            <label for="instructor-phone">Phone Number</label>
          </p-floatlabel>
          @if (phoneNumberControl.invalid && phoneNumberControl.touched) {
            <app-field-error errorText="Phone number is required."/>
          }
        </div>

        @if (submitError()) {
          <p class="submit-error">Failed to create instructor. Please check your input.</p>
        }

        @if (submitSuccess()) {
          <p class="submit-success">Instructor created successfully.</p>
        }

        <div class="form-actions">
          <button class="btn btn-gray" (click)="closeDialog()" type="button">Cancel</button>
          <button class="btn btn-green" [disabled]="isSubmitting()" type="submit">
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
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
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

    this.instructorService
      .createInstructor({
        id: crypto.randomUUID(),
        ...this.AddInstructorForm.getRawValue(),
      })
      .subscribe({
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
