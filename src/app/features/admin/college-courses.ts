import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { Instructor } from '@shared/models/users/instructor.model';
import { CoursesService } from '@shared/services/courses.service';
import { InstructorService } from '@shared/services/instructor.service';

import { AddCourseModal } from './college-courses/add-course-modal';
import { DeleteCourseModal } from './college-courses/delete-course-modal';
import { ManageCourseModal } from './college-courses/manage-course-modal';

@Component({
  selector: 'app-college-courses',
  imports: [
    AddCourseModal,
    DeleteCourseModal,
    ManageCourseModal,
    ProgressSpinner,
    FormsModule,
    InputText,
    InputNumber,
    SelectModule,
    NavigationButtons,
    RoleDashboardHeader,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="Course Status"
          description="Each row shows ownership, enrollment, and quiz coverage."
        />
        <app-add-course-modal (created)="reloadCourses()" />
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="course-search">Search</label>
          <input
            class="focus-green-ring"
            id="course-search"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            pInputText
            placeholder="Search by course ID or course name"
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
          <label for="quizzes-count">Quizzes count</label>
          <p-inputnumber
            [(ngModel)]="quizzesCount"
            [min]="0"
            [showButtons]="true"
            (ngModelChange)="onQuizzesCountChange($event)"
            inputId="quizzes-count"
            placeholder="Any"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="enrolled-count">Enrolled students</label>
          <p-inputnumber
            [(ngModel)]="enrolledStudentsCount"
            [min]="0"
            [showButtons]="true"
            (ngModelChange)="onEnrolledStudentsCountChange($event)"
            inputId="enrolled-count"
            placeholder="Any"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="instructor-filter">Instructor</label>
          <p-select
            [ngModel]="instructorId()"
            [options]="instructorOptions()"
            [filter]="true"
            [showClear]="true"
            (ngModelChange)="onInstructorChange($event)"
            (onShow)="onInstructorDropdownShow()"
            inputId="instructor-filter"
            optionLabel="name"
            optionValue="id"
            filterBy="name"
            placeholder="All instructors"
            appendTo="body"
          ></p-select>
        </div>
      </div>

      <div class="table-shell">
        @if (coursesResource.isLoading()) {
          <div class="table-overlay-spinner">
            <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
          </div>
        }
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Enrolled</th>
              <th>Quizzes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (coursesResource.error()) {
              <tr>
                <td colspan="6">
                  <div class="error">
                    <p>Failed to load course data.</p>
                  </div>
                </td>
              </tr>
            } @else if (
              !coursesResource.isLoading() && !(coursesResource.value()?.items?.length ?? 0)
            ) {
              <tr>
                <td colspan="6">
                  <p class="feedback">No courses match your filters.</p>
                </td>
              </tr>
            } @else {
              @for (course of coursesResource.value()?.items ?? []; track course.courseId) {
                <tr>
                  <td>{{ course.courseId.slice(0, 8) }}</td>
                  <td>{{ course.courseName }}</td>
                  <td>{{ course.instructorName || 'Unassigned' }}</td>
                  <td>{{ course.enrolledStudentsCount }}</td>
                  <td>{{ course.quizzesCount }}</td>
                  <td>
                    <div class="actions">
                      <app-manage-course-modal [course]="course" (changed)="reloadCourses()" />
                      <app-delete-course-modal [course]="course" (deleted)="reloadCourses()" />
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
          Page {{ coursesResource.value()?.pageNumber ?? 1 }} of
          {{ coursesResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          [canGoPrevious]="coursesResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="coursesResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
          ariaLabel="Courses pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly quizzesCount = signal<number | null>(
    this.route.snapshot.queryParams['quizzes']
      ? Number(this.route.snapshot.queryParams['quizzes'])
      : null,
  );
  protected readonly enrolledStudentsCount = signal<number | null>(
    this.route.snapshot.queryParams['enrolled']
      ? Number(this.route.snapshot.queryParams['enrolled'])
      : null,
  );
  protected readonly instructorId = signal<string | null>(
    this.route.snapshot.queryParams['instructor'] || null,
  );

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm() || null,
          page: this.pageNumber(),
          size: this.pageSize(),
          quizzes: this.quizzesCount(),
          enrolled: this.enrolledStudentsCount(),
          instructor: this.instructorId(),
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

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
        : of({
          items: [],
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
          totalCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        } as PaginatedList<Instructor>),
  });

  protected readonly instructorOptions = computed(() =>
    (this.instructorsResource.value()?.items ?? []).map((instructor: Instructor) => ({
      id: instructor.id,
      name: instructor.personalInformation.name,
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
    if (!value || value <= 0) {
      this.pageSize.set(10);
    }
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

  protected reloadCourses(): void {
    this.coursesResource.reload();
  }
}
