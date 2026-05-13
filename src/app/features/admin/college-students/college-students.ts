import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
            class="focus-green-ring"
            id="student-search"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            pInputText
            placeholder="Search by name or email"
          />
        </div>

        <div class="filter-item">
          <label for="page-size">Page size</label>
          <p-inputnumber
            [(ngModel)]="pageSize"
            [min]="1"
            [max]="100"
            [showButtons]="true"
            (ngModelChange)="onPageSizeChange($event)"
            inputId="page-size"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="enrolled-count">Enrolled courses</label>
          <p-inputnumber
            [ngModel]="enrolledCoursesCount()"
            [min]="0"
            [showButtons]="true"
            (ngModelChange)="onEnrolledCoursesCountChange($event)"
            inputId="enrolled-count"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        @if (studentsResource.isLoading()) {
          <div class="table-overlay-spinner">
            <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
          </div>
        }
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Enrolled Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (studentsResource.error()) {
              <tr>
                <td colspan="3">
                  <div class="error">
                    <p>Failed to load student data.</p>
                  </div>
                </td>
              </tr>
            } @else if (
              !studentsResource.isLoading() && !(studentsResource.value()?.items?.length ?? 0)
            ) {
              <tr>
                <td colspan="3">
                  <p class="feedback">No students match your filters.</p>
                </td>
              </tr>
            } @else {
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
            }
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ studentsResource.value()?.pageNumber ?? 1 }} of
          {{ studentsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          [canGoPrevious]="studentsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="studentsResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
          ariaLabel="Students pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeStudents {
  private readonly studentService = inject(StudentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly enrolledCoursesCount = signal<number | null>(
    this.route.snapshot.queryParams['enrolled'] ? Number(this.route.snapshot.queryParams['enrolled']) : null
  );

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm() || null,
          page: this.pageNumber(),
          size: this.pageSize(),
          enrolled: this.enrolledCoursesCount(),
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

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
    if (!value || value <= 0) {
      this.pageSize.set(10);
    }
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
