import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { StudentService } from '@shared/services/student.service';

import { AddStudentModal } from './add-student-modal';
import { DeleteStudentModal } from './delete-student-modal';
import { EditStudentModal } from './edit-student-modal';

@Component({
  selector: 'app-college-students',
  imports: [
    ProgressSpinner,
    AddStudentModal,
    EditStudentModal,
    DeleteStudentModal,
    FormsModule,
    InputText,
    InputNumber,
    NavigationButtons,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Students</p>
          <h1>Student Roster</h1>
          <p class="description">A simple roster view of enrollment load.</p>
        </div>
        <app-add-student-modal (created)="reloadStudents()"></app-add-student-modal>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="student-search">Search</label>
          <input
            id="student-search"
            pInputText
            class="focus-green-ring"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            placeholder="Search by name or email"
          />
        </div>

        <div class="filter-item">
          <label for="page-size">Page size</label>
          <p-inputnumber
            inputId="page-size"
            [ngModel]="pageSize()"
            (ngModelChange)="onPageSizeChange($event)"
            [min]="1"
            [max]="100"
            [showButtons]="true"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="enrolled-count">Enrolled courses</label>
          <p-inputnumber
            inputId="enrolled-count"
            [ngModel]="enrolledCoursesCount()"
            (ngModelChange)="onEnrolledCoursesCountChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      @if (studentsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (studentsResource.error()) {
        <div class="error">
          <p>Failed to load student data.</p>
        </div>
      } @else if (!(studentsResource.value()?.items?.length ?? 0)) {
        <p class="feedback">No students match your filters.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Enrolled Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (student of studentsResource.value()?.items ?? []; track student.studentId) {
                <tr>
                  <td>{{ student.name }}</td>
                  <td>{{ student.enrolledCoursesCount }}</td>
                  <td>
                    <div class="actions">
                      <app-edit-student-modal
                        [student]="student"
                        (updated)="reloadStudents()"
                      ></app-edit-student-modal>
                      <app-delete-student-modal
                        [student]="student"
                        (deleted)="reloadStudents()"
                      ></app-delete-student-modal>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <div class="pagination-row">
        <p class="page-info">
          Page {{ studentsResource.value()?.pageNumber ?? 1 }} of
          {{ studentsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          ariaLabel="Students pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
          [canGoPrevious]="studentsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="studentsResource.value()?.hasNextPage ?? false"
          (previousClicked)="goToPreviousPage()"
          (nextClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeStudents {
  private readonly studentService = inject(StudentService);

  protected readonly searchTerm = model('');
  protected readonly pageNumber = model(1);
  protected readonly pageSize = model(10);
  protected readonly enrolledCoursesCount = model<number | null>(null);

  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(
      map((value) => value?.trim() || ''),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  protected readonly studentsResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      enrolledCoursesCount: this.enrolledCoursesCount(),
    }),
    stream: ({ params }) =>
      this.studentService.getAllStudents({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        enrolledCoursesCount: params.enrolledCoursesCount ?? undefined,
      }),
  });

  protected onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.pageNumber.set(1);
  }

  protected onPageSizeChange(value: number | null | undefined): void {
    this.pageSize.set(value && value > 0 ? value : 10);
    this.pageNumber.set(1);
  }

  protected onEnrolledCoursesCountChange(value: number | null | undefined): void {
    this.enrolledCoursesCount.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected goToPreviousPage(): void {
    if (this.studentsResource.value()?.hasPreviousPage) {
      this.pageNumber.update((value) => Math.max(1, value - 1));
    }
  }

  protected goToNextPage(): void {
    if (this.studentsResource.value()?.hasNextPage) {
      this.pageNumber.update((value) => value + 1);
    }
  }

  protected reloadStudents(): void {
    this.studentsResource.reload();
  }
}
