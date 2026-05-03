import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { InstructorService } from '@shared/services/instructor.service';

import { AddInstructorModal } from './add-instructor-modal';
import { DeleteInstructorModal } from './delete-instructor-modal';
import { EditInstructorModal } from './edit-instructor-modal';

@Component({
  selector: 'app-college-instructors',
  imports: [
    ProgressSpinner,
    AddInstructorModal,
    EditInstructorModal,
    DeleteInstructorModal,
    FormsModule,
    InputText,
    InputNumber,
    NavigationButtons,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Instructors</p>
          <h1>Instructor Directory</h1>
          <p class="description">A quick view of teaching assignments and quiz activity.</p>
        </div>
        <app-add-instructor-modal (created)="reloadInstructors()"></app-add-instructor-modal>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="instructor-search">Search</label>
          <input
            id="instructor-search"
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
          <label for="courses-count">Courses count</label>
          <p-inputnumber
            inputId="courses-count"
            [ngModel]="coursesCount()"
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
            [ngModel]="quizzesCount()"
            (ngModelChange)="onQuizzesCountChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      @if (instructorsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (instructorsResource.error()) {
        <div class="error">
          <p>Failed to load instructor data.</p>
        </div>
      } @else if (!(instructorsResource.value()?.items?.length ?? 0)) {
        <p class="feedback">No instructors match your filters.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Courses</th>
                <th>Quizzes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (instructor of instructorsResource.value()?.items ?? []; track instructor.instructorId) {
                <tr>
                  <td>{{ instructor.name }}</td>
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
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

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
          (previousClicked)="goToPreviousPage()"
          (nextClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeInstructors {
  private readonly instructorService = inject(InstructorService);

  protected readonly searchTerm = model('');
  protected readonly pageNumber = model(1);
  protected readonly pageSize = model(10);
  protected readonly coursesCount = model<number | null>(null);
  protected readonly quizzesCount = model<number | null>(null);

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
    this.pageSize.set(value && value > 0 ? value : 10);
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
