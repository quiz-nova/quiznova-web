import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { Instructor } from '@shared/models/instructor/instructor.model';
import { CoursesService } from '@shared/services/courses.service';
import { InstructorService } from '@shared/services/instructor.service';

@Component({
  selector: 'app-college-courses',
  imports: [
    ProgressSpinner,
    FormsModule,
    InputText,
    InputNumber,
    SelectModule,
    NavigationButtons,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Courses</p>
          <h1>Course Status</h1>
          <p class="description">Each row shows ownership, enrollment, and quiz coverage.</p>
        </div>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="course-search">Search</label>
          <input
            id="course-search"
            pInputText
            class="focus-green-ring"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            placeholder="Search by course ID or course name"
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
          <label for="quizzes-count">Quizzes count</label>
          <p-inputnumber
            inputId="quizzes-count"
            [ngModel]="quizzesCount()"
            (ngModelChange)="onQuizzesCountChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="enrolled-count">Enrolled students</label>
          <p-inputnumber
            inputId="enrolled-count"
            [ngModel]="enrolledStudentsCount()"
            (ngModelChange)="onEnrolledStudentsCountChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="instructor-filter">Instructor</label>
          <p-select
            inputId="instructor-filter"
            [ngModel]="instructorId()"
            (ngModelChange)="onInstructorChange($event)"
            [options]="instructorOptions()"
            optionLabel="name"
            optionValue="id"
            [filter]="true"
            filterBy="name"
            [showClear]="true"
            placeholder="All instructors"
            appendTo="body"
            (onShow)="onInstructorDropdownShow()"
          ></p-select>
        </div>
      </div>

      @if (coursesResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
        </div>
      } @else if (coursesResource.error()) {
        <div class="error">
          <p>Failed to load course data.</p>
        </div>
      } @else if (!(coursesResource.value()?.items?.length ?? 0)) {
        <p class="feedback">No courses match your filters.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
            <tr>
              <th>Id</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Enrolled</th>
              <th>Quizzes</th>
            </tr>
            </thead>
            <tbody>
              @for (course of coursesResource.value()?.items ?? []; track course.courseId) {
                <tr>
                  <td>{{ course.courseId.slice(0, 8) }}</td>
                  <td>{{ course.courseName }}</td>
                  <td>{{ course.instructorName }}</td>
                  <td>{{ course.enrolledStudentsCount }}</td>
                  <td>{{ course.quizzesCount }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <div class="pagination-row">
        <p class="page-info">
          Page {{ coursesResource.value()?.pageNumber ?? 1 }} of {{ coursesResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          ariaLabel="Courses pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
          [canGoPrevious]="coursesResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="coursesResource.value()?.hasNextPage ?? false"
          (previousClicked)="goToPreviousPage()"
          (nextClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: './shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeCourses {
  private readonly coursesService = inject(CoursesService);
  private readonly instructorService = inject(InstructorService);

  protected readonly searchTerm = model('');
  protected readonly pageNumber = model(1);
  protected readonly pageSize = model(10);
  protected readonly quizzesCount = model<number | null>(null);
  protected readonly enrolledStudentsCount = model<number | null>(null);
  protected readonly instructorId = model<string | null>(null);

  protected readonly dropdownOpen = model(false);

  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(
      map((value) => value?.trim() || ''),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  protected readonly instructorsResource = rxResource({
    params: () => this.dropdownOpen(),
    stream: (shouldFetch) =>
      shouldFetch
        ? this.instructorService.getAllInstructors({
            pageNumber: 1,
            pageSize: 10,
          })
        : of({ items: [], pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false } as any),
  });

  protected readonly instructorOptions = computed(() =>
    (this.instructorsResource.value()?.items ?? []).map((instructor: Instructor) => ({
      id: instructor.instructorId,
      name: instructor.name,
    })),
  );

  protected readonly coursesResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      quizzesCount: this.quizzesCount(),
      enrolledStudentsCount: this.enrolledStudentsCount(),
      instructorId: this.instructorId(),
    }),
    stream: ({ params }) =>
      this.coursesService.getAllCourses({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        quizzesCount: params.quizzesCount ?? undefined,
        enrolledStudentsCount: params.enrolledStudentsCount ?? undefined,
        instructorId: params.instructorId ?? undefined,
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

  protected onQuizzesCountChange(value: number | null | undefined): void {
    this.quizzesCount.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected onEnrolledStudentsCountChange(value: number | null | undefined): void {
    this.enrolledStudentsCount.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected onInstructorChange(value: string | null | undefined): void {
    this.instructorId.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected goToPreviousPage(): void {
    if (this.coursesResource.value()?.hasPreviousPage) {
      this.pageNumber.update((value) => Math.max(1, value - 1));
    }
  }

  protected goToNextPage(): void {
    if (this.coursesResource.value()?.hasNextPage) {
      this.pageNumber.update((value) => value + 1);
    }
  }

  protected onInstructorDropdownShow(): void {
    this.dropdownOpen.set(true);
  }
}
