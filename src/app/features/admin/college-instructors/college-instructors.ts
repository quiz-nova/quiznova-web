import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { Instructor } from '@shared/models/users/instructor.model';
import { InstructorService } from '@shared/services/instructor.service';

import { AddInstructorModal } from './add-instructor-modal';
import { DeleteInstructorModal } from './delete-instructor-modal';
import { EditInstructorModal } from './edit-instructor-modal';

@Component({
  selector: 'app-college-instructors',
  imports: [
    TableModule,
    SkeletonModule,
    AddInstructorModal,
    EditInstructorModal,
    DeleteInstructorModal,
    FormsModule,
    InputText,
    InputNumber,
    NavigationButtons,
    RoleDashboardHeader,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="Instructor Directory"
          description="A quick view of teaching assignments and quiz activity."
        />
        <app-add-instructor-modal (created)="reloadInstructors()"></app-add-instructor-modal>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="instructor-search">Search</label>
          <input
            id="instructor-search"
            pInputText
            class="focus-green-ring"
            [(ngModel)]="searchTerm"
            (ngModelChange)="pageNumber.set(1)"
            placeholder="Search by name or email"
          />
        </div>

        <div class="filter-item">
          <label for="page-size">Page size</label>
          <p-inputnumber
            inputId="page-size"
            [(ngModel)]="pageSize"
            (ngModelChange)="onPageSizeChange($event)"
            [min]="1"
            [max]="100"
            [showButtons]="true"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="courses-count">Courses count</label>
          <p-inputnumber
            inputId="courses-count"
            [(ngModel)]="coursesCount"
            (ngModelChange)="onCoursesCountChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="quizzes-count">Quizzes count</label>
          <p-inputnumber
            inputId="quizzes-count"
            [(ngModel)]="quizzesCount"
            (ngModelChange)="onQuizzesCountChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        <p-table
          [value]="tableData()"
          [tableStyle]="{ 'min-width': '50rem' }"
        >
          <ng-template #header>
            <tr>
              <th>Name</th>
              <th>Courses</th>
              <th>Quizzes</th>
              <th style="width: 8rem">Actions</th>
            </tr>
          </ng-template>
          <ng-template #body let-instructor>
            <tr>
              @if (instructorsResource.isLoading()) {
                <td><p-skeleton width="60%" height="1.5rem" /></td>
                <td><p-skeleton width="40%" height="1.5rem" /></td>
                <td><p-skeleton width="40%" height="1.5rem" /></td>
                <td><p-skeleton width="4rem" height="1.5rem" /></td>
              } @else {
                <td>{{ instructor.personalInformation.name }}</td>
                <td>{{ instructor.coursesCount }}</td>
                <td>{{ instructor.quizzesCount }}</td>
                <td>
                  <div class="actions">
                    <app-edit-instructor-modal
                      [instructor]="instructor"
                      (updated)="reloadInstructors()"
                    ></app-edit-instructor-modal>
                    <app-delete-instructor-modal
                      [instructor]="instructor"
                      (deleted)="reloadInstructors()"
                    ></app-delete-instructor-modal>
                  </div>
                </td>
              }
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="4">
                @if (instructorsResource.error()) {
                  <div class="error">
                    <p>Failed to load instructor data.</p>
                  </div>
                } @else {
                  <p class="feedback">No instructors match your filters.</p>
                }
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ instructorsResource.value()?.pageNumber ?? 1 }} of
          {{ instructorsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          ariaLabel="Instructors pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
          [canGoPrevious]="instructorsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="instructorsResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeInstructors {
  private readonly instructorService = inject(InstructorService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly tableData = computed<Instructor[]>(() => {
    if (this.instructorsResource.isLoading()) {
      return Array.from<unknown, Instructor>({ length: this.pageSize() }, (_, i) => ({
        id: `skeleton-${i}`,
      } as unknown as Instructor));
    }
    if (this.instructorsResource.error()) {
      return [];
    }
    return this.instructorsResource.value()?.items ?? [];
  });
  protected readonly coursesCount = signal<number | null>(
    this.route.snapshot.queryParams['courses'] ? Number(this.route.snapshot.queryParams['courses']) : null
  );
  protected readonly quizzesCount = signal<number | null>(
    this.route.snapshot.queryParams['quizzes'] ? Number(this.route.snapshot.queryParams['quizzes']) : null
  );

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm() || null,
          page: this.pageNumber(),
          size: this.pageSize(),
          courses: this.coursesCount(),
          quizzes: this.quizzesCount(),
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

  protected readonly instructorsResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      coursesCount: this.coursesCount(),
      quizzesCount: this.quizzesCount(),
    }),
    stream: ({ params }) =>
      this.instructorService.getAllInstructors({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        coursesCount: params.coursesCount ?? undefined,
        quizzesCount: params.quizzesCount ?? undefined,
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

  protected onCoursesCountChange(value: number | null | undefined): void {
    this.coursesCount.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected onQuizzesCountChange(value: number | null | undefined): void {
    this.quizzesCount.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected goToPreviousPage(): void {
    if (this.instructorsResource.value()?.hasPreviousPage) {
      this.pageNumber.update((value) => Math.max(1, value - 1));
    }
  }

  protected goToNextPage(): void {
    if (this.instructorsResource.value()?.hasNextPage) {
      this.pageNumber.update((value) => value + 1);
    }
  }

  protected reloadInstructors(): void {
    this.instructorsResource.reload();
  }
}
