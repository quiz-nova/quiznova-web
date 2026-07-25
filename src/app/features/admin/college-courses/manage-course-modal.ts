import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Select } from 'primeng/select';

import { Course } from '@shared/models/course/course.model';
import { shortId } from '@shared/utils/utilities';

import { ManageCourseStore } from './manage-course.store';

@Component({
  selector: 'app-manage-course-modal',
  imports: [Dialog, FormsModule, ProgressSpinner, Select, Button],
  providers: [ManageCourseStore],
  template: `
    <p-button
      [attr.aria-label]="'Manage ' + course().courseName"
      (onClick)="openDialog()"
      label="Manage"
      severity="secondary"
      type="button"
    />

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(42rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Manage Course"
    >
      @if (store.isPending()('loadCourse')) {
        <div class="dialog-spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (store.error()('loadCourse')) {
        <p class="submit-error">{{ store.error()('loadCourse') }}</p>
      } @else if (store.isFulfilled()('loadCourse')) {
        <div class="manage-layout">
          <div>
            <p class="course-title">{{ store.course()?.courseName }}</p>
            <p class="course-subtitle">Assign instructor and manage enrolled students.</p>
          </div>

          <div class="form-field">
            <label for="manage-course-instructor">Instructor</label>
            <div class="inline-action">
              <p-select
                [(ngModel)]="selectedInstructorId"
                [options]="store.instructorOptions()"
                [filter]="true"
                [showClear]="true"
                inputId="manage-course-instructor"
                optionLabel="name"
                optionValue="id"
                filterBy="name"
                placeholder="No instructor"
                appendTo="body"
              ></p-select>
              <p-button
                [disabled]="!hasInstructorChange()"
                (onClick)="onUpdateInstructor()"
                label="Save"
                severity="success"
                type="button"
              />
            </div>
          </div>

          <div class="form-field">
            <label for="manage-course-student">Enroll student</label>
            <div class="inline-action">
              <p-select
                [(ngModel)]="selectedStudentId"
                [options]="store.availableStudentOptions()"
                [filter]="true"
                [showClear]="true"
                inputId="manage-course-student"
                optionLabel="name"
                optionValue="id"
                filterBy="name"
                placeholder="Select a student"
                appendTo="body"
              ></p-select>
              <p-button
                [loading]="store.isPending()('enrollStudent')"
                [disabled]="!selectedStudentId()"
                [label]="store.isPending()('enrollStudent') ? 'Enrolling...' : 'Enroll'"
                (onClick)="onEnrollStudent()"
                severity="success"
                type="button"
              />
            </div>
          </div>

          <div class="enrolled-list">
            <p class="list-heading">Enrolled students ({{ store.enrolledStudents().length }})</p>
            @if (store.enrolledStudents().length) {
              @for (student of store.enrolledStudents(); track student.id) {
                <div class="student-row">
                  <span>{{ student.personalInformation.name }}</span>
                  <span class="student-id">{{ shortId(student.id) }}</span>
                  <p-button
                    [rounded]="true"
                    [text]="true"
                    (onClick)="onRemoveStudent(student.id)"
                    ariaLabel="Remove student from course"
                    icon="pi pi-trash"
                    severity="danger"
                  />
                </div>
              }
            } @else {
              <p class="empty-state">No students enrolled.</p>
            }
          </div>

          @if (store.anyError()) {
            <p class="submit-error">{{ store.anyError() }}</p>
          }
        </div>
      }
    </p-dialog>
  `,
  styles: `
    .dialog-spinner {
      display: grid;
      place-items: center;
      min-height: 12rem;
    }

    .manage-layout {
      display: grid;
      gap: 1.25rem;
    }

    .course-title {
      margin: 0;
      color: var(--clr-blue-900);
      font-size: 1.125rem;
      font-weight: 700;
    }

    .course-subtitle {
      margin: 0.25rem 0 0;
      color: var(--clr-gray-600);
      font-size: 0.875rem;
    }

    .form-field {
      display: grid;
      gap: 0.5rem;
    }

    .form-field > label,
    .list-heading {
      color: var(--clr-gray-600);
      font-size: 0.875rem;
      font-weight: 700;
    }

    .inline-action {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .enrolled-list {
      display: grid;
      gap: 0;
      overflow: hidden;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
    }

    .list-heading {
      margin: 0;
      padding: 0.875rem 1rem;
      background-color: var(--clr-gray-50);
    }

    .student-row {
      display: grid;
      align-items: center;
      gap: 0.75rem;
      grid-template-columns: minmax(0, 1fr) auto auto;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--clr-gray-200);
    }

    .student-id {
      padding: 0.25rem 0.65rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-sm);
      color: var(--clr-gray-600);
      font-size: 0.8rem;
      font-weight: 700;
    }

    .empty-state {
      margin: 0;
      padding: 1rem;
      border-top: 1px solid var(--clr-gray-200);
      color: var(--clr-gray-600);
    }

    .submit-error {
      margin: 0;
      color: var(--clr-red-500);
      font-size: 0.875rem;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCourseModal {
  readonly course = input.required<Course>();
  readonly changed = output<void>();
  protected readonly shortId = shortId;

  protected readonly store = inject(ManageCourseStore);
  protected readonly isDialogOpen = model(false);
  protected readonly selectedInstructorId = model<string | null>(null);
  protected readonly selectedStudentId = model<string | null>(null);
  protected readonly hasInstructorChange = computed(
    () => (this.store.course()?.instructorId ?? null) !== this.selectedInstructorId(),
  );

  constructor() {
    effect(() => {
      this.selectedInstructorId.set(this.store.course()?.instructorId ?? null);
    });
  }

  protected openDialog(): void {
    this.isDialogOpen.set(true);
    this.store.loadCourse(this.course().id);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.selectedInstructorId.set(null);
    this.selectedStudentId.set(null);
  }

  protected onDialogVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
      return;
    }

    this.isDialogOpen.set(true);
  }

  protected onUpdateInstructor(): void {
    const instructorId = this.selectedInstructorId();
    if (!instructorId) {
      return;
    }

    this.store.updateInstructor({
      instructorId,
      onSuccess: () => this.changed.emit(),
    });
  }

  protected onEnrollStudent(): void {
    const studentId = this.selectedStudentId();
    if (!studentId) {
      return;
    }

    this.store.enrollStudent({
      studentId,
      onSuccess: () => {
        this.selectedStudentId.set(null);
        this.changed.emit();
      },
    });
  }

  protected onRemoveStudent(studentId: string): void {
    this.store.removeStudent({
      studentId,
      onSuccess: () => this.changed.emit(),
    });
  }
}
