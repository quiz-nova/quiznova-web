import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';

import { DeleteButton } from '@shared/components/delete-button/delete-button';
import { ManageButton } from '@shared/components/manage-button/manage-button';
import { Course } from '@shared/models/course/course.model';

import { ManageCourseStore } from './manage-course.store';

@Component({
  selector: 'app-manage-course-modal',
  imports: [DeleteButton, DialogModule, FormsModule, ManageButton, ProgressSpinner, SelectModule],
  providers: [ManageCourseStore],
  template: `
    <app-manage-button
      [ariaLabel]="'Manage ' + course().courseName"
      (manageButtonClicked)="openDialog()"
    />

    <p-dialog
      [visible]="isDialogOpen()"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: 'min(42rem, 95vw)' }"
      (visibleChange)="onDialogVisibilityChange($event)"
      header="Manage Course"
    >
      @if (store.isPending()) {
        <div class="dialog-spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (store.error()) {
        <p class="submit-error">{{ store.error() }}</p>
      } @else if (store.isFulfilled()) {
        <div class="manage-layout">
          <div>
            <p class="course-title">{{ store.course()?.courseName }}</p>
            <p class="course-subtitle">
              Assign instructor and manage enrolled students.
            </p>
          </div>

          <div class="form-field">
            <label for="manage-course-instructor">Instructor</label>
            <div class="inline-action">
              <p-select
                inputId="manage-course-instructor"
                [ngModel]="selectedInstructorId()"
                (ngModelChange)="onInstructorSelectionChange($event)"
                [options]="store.instructorOptions()"
                optionLabel="name"
                optionValue="id"
                [filter]="true"
                filterBy="name"
                [showClear]="true"
                placeholder="No instructor"
                appendTo="body"
              ></p-select>
              <button
                class="btn btn-green"
                [disabled]="!hasInstructorChange()"
                (click)="onUpdateInstructor()"
                type="button"
              >
                Save
              </button>
            </div>
          </div>

          <div class="form-field">
            <label for="manage-course-student">Enroll student</label>
            <div class="inline-action">
              <p-select
                inputId="manage-course-student"
                [ngModel]="selectedStudentId()"
                (ngModelChange)="onStudentSelectionChange($event)"
                [options]="store.availableStudentOptions()"
                optionLabel="name"
                optionValue="id"
                [filter]="true"
                filterBy="name"
                [showClear]="true"
                placeholder="Select a student"
                appendTo="body"
              ></p-select>
              <button
                class="btn btn-green"
                [disabled]="!selectedStudentId()"
                (click)="onEnrollStudent()"
                type="button"
              >
                Enroll
              </button>
            </div>
          </div>

          <div class="enrolled-list">
            <p class="list-heading">
              Enrolled students ({{ store.enrolledStudents().length }})
            </p>
            @if (store.enrolledStudents().length) {
              @for (student of store.enrolledStudents(); track student.id) {
                <div class="student-row">
                  <span>{{ student.name }}</span>
                  <span class="student-id">{{ student.id.slice(0, 8) }}</span>
                  <app-delete-button
                    ariaLabel="Remove student from course"
                    (deleteButtonClicked)="onRemoveStudent(student.id)"
                  />
                </div>
              }
            } @else {
              <p class="empty-state">No students enrolled.</p>
            }
          </div>

          @if (store.actionError()) {
            <p class="submit-error">{{ store.actionError() }}</p>
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
      border-radius: 999px;
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
})
export class ManageCourseModal {
  readonly course = input.required<Course>();
  readonly changed = output<void>();

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
    this.store.loadCourse(this.course().courseId);
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

  protected onInstructorSelectionChange(value: string | null | undefined): void {
    this.selectedInstructorId.set(value ?? null);
  }

  protected onStudentSelectionChange(value: string | null | undefined): void {
    this.selectedStudentId.set(value ?? null);
  }

  protected onUpdateInstructor(): void {
    this.store.updateInstructor(this.selectedInstructorId());
    this.changed.emit();
  }

  protected onEnrollStudent(): void {
    const studentId = this.selectedStudentId();
    if (!studentId) {
      return;
    }

    this.store.enrollStudent(studentId);
    this.selectedStudentId.set(null);
    this.changed.emit();
  }

  protected onRemoveStudent(studentId: string): void {
    this.store.removeStudent(studentId);
    this.changed.emit();
  }
}
