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
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { FieldError } from '@shared/components/field-error/field-error';
import { Instructor } from '@shared/models/instructor/instructor.model';
import { CoursesService } from '@shared/services/courses.service';
import { InstructorService } from '@shared/services/instructor.service';

type AddCourseFormGroup = FormGroup<{
  name: FormControl<string>;
  instructorId: FormControl<string | null>;
  minimumPassingMarks: FormControl<number>;
  maximumMarks: FormControl<number>;
}>;

@Component({
  selector: 'app-add-course-modal',
  imports: [
    DialogModule,
    FieldError,
    FloatLabel,
    InputNumber,
    InputText,
    ReactiveFormsModule,
    SelectModule,
  ],
  template: `
    <button class="btn btn-green" (click)="openDialog()" type="button">Add Course</button>

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(40rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Add Course"
    >
      <form class="add-form" [formGroup]="addCourseForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <p-floatlabel variant="on">
            <input 
              id="course-name" 
              [fluid]="true" 
              pInputText 
              type="text" 
              formControlName="name"
              [attr.aria-invalid]="nameControl.invalid && nameControl.touched ? 'true' : null"
              aria-describedby="course-name-is-required-error"
            />
            <label for="course-name">Course Name</label>
          </p-floatlabel>
          @if (nameControl.invalid && nameControl.touched) {
            <app-field-error id="course-name-is-required-error"
              >Course name is required.</app-field-error
            >
          }
        </div>

        <div class="form-field">
          <label class="field-label" for="course-instructor">Instructor</label>
          <p-select
            [options]="instructorOptions()"
            [filter]="true"
            [showClear]="true"
            (onShow)="loadInstructors()"
            inputId="course-instructor"
            formControlName="instructorId"
            optionLabel="name"
            optionValue="id"
            filterBy="name"
            placeholder="No instructor"
            appendTo="body"
          ></p-select>
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <p-inputnumber
              [min]="1"
              inputId="minimum-passing-marks"
              formControlName="minimumPassingMarks"
              [attr.aria-invalid]="minimumPassingMarksControl.invalid && minimumPassingMarksControl.touched ? 'true' : null"
              aria-describedby="minimum-passing-marks-must-be-greater-than-zero-error"
            />
            <label for="minimum-passing-marks">Minimum Passing Marks</label>
          </p-floatlabel>
          @if (minimumPassingMarksControl.invalid && minimumPassingMarksControl.touched) {
            <app-field-error id="minimum-passing-marks-must-be-greater-than-zero-error"
              >Minimum passing marks must be greater than zero.</app-field-error
            >
          }
        </div>

        <div class="form-field">
          <p-floatlabel variant="on">
            <p-inputnumber 
              [min]="1" 
              inputId="maximum-marks" 
              formControlName="maximumMarks"
              [attr.aria-invalid]="maximumMarksControl.invalid && maximumMarksControl.touched ? 'true' : null"
              aria-describedby="maximum-marks-must-be-greater-than-zero-error"
            />
            <label for="maximum-marks">Maximum Marks</label>
          </p-floatlabel>
          @if (maximumMarksControl.invalid && maximumMarksControl.touched) {
            <app-field-error id="maximum-marks-must-be-greater-than-zero-error"
              >Maximum marks must be greater than zero.</app-field-error
            >
          }
        </div>

        @if (submitError()) {
          <p class="submit-error">Failed to create course. Please check your input.</p>
        }

        <div class="form-actions">
          <button class="btn btn-gray" (click)="closeDialog()" type="button">Cancel</button>
          <button class="btn btn-green" [disabled]="isSubmitting()" type="submit">
            {{ isSubmitting() ? 'Saving...' : 'Save Course' }}
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

    .field-label {
      color: var(--clr-gray-600);
      font-size: 0.875rem;
      font-weight: 600;
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
export class AddCourseModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly coursesService = inject(CoursesService);
  private readonly instructorService = inject(InstructorService);

  readonly created = output<void>();

  protected readonly isDialogOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal(false);
  protected readonly instructors = signal<Instructor[]>([]);

  protected readonly addCourseForm: AddCourseFormGroup = this.fb.group({
    name: ['', [Validators.required]],
    instructorId: this.fb.control<string | null>(null),
    minimumPassingMarks: [1, [Validators.required, Validators.min(1)]],
    maximumMarks: [1, [Validators.required, Validators.min(1)]],
  });

  protected readonly instructorOptions = () =>
    this.instructors().map((instructor) => ({
      id: instructor.instructorId,
      name: instructor.name,
    }));

  protected get nameControl() {
    return this.addCourseForm.controls.name;
  }

  protected get minimumPassingMarksControl() {
    return this.addCourseForm.controls.minimumPassingMarks;
  }

  protected get maximumMarksControl() {
    return this.addCourseForm.controls.maximumMarks;
  }

  protected openDialog(): void {
    this.submitError.set(false);
    this.isDialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.resetForm();
  }

  protected onDialogVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
      return;
    }

    this.isDialogOpen.set(true);
  }

  protected loadInstructors(): void {
    if (this.instructors().length) {
      return;
    }

    this.instructorService.getAllInstructors({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (response) => this.instructors.set(response.items),
    });
  }

  protected resetForm(): void {
    this.addCourseForm.reset({
      name: '',
      instructorId: null,
      minimumPassingMarks: 1,
      maximumMarks: 1,
    });
    this.addCourseForm.markAsPristine();
    this.addCourseForm.markAsUntouched();
    this.submitError.set(false);
  }

  protected onSubmit(): void {
    if (this.addCourseForm.invalid) {
      this.addCourseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);

    this.coursesService
      .createCourse({
        id: crypto.randomUUID(),
        ...this.addCourseForm.getRawValue(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
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
