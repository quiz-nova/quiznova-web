import { DatePipe } from '@angular/common';
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
import { Quiz } from '@shared/models/quiz/quiz.model';
import { QuizService } from '@shared/services/quiz.service';

@Component({
  selector: 'app-college-quizzes',
  imports: [
    TableModule,
    SkeletonModule,
    FormsModule,
    InputText,
    InputNumber,
    NavigationButtons,
    RoleDashboardHeader,
    DatePipe,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="Quiz Schedule"
          description="Track quiz ownership, score weight, and delivery state."
        />
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="quiz-search">Search</label>
          <input
            class="focus-green-ring"
            id="quiz-search"
            [(ngModel)]="searchTerm"
            (ngModelChange)="pageNumber.set(1)"
            pInputText
            placeholder="Search by title, course, or instructor"
          />
        </div>

        <div class="filter-item">
          <label for="page-size">Page size</label>
          <p-inputnumber
            [(ngModel)]="pageSize"
            (ngModelChange)="onPageSizeChange($event)"
            [min]="1"
            [max]="100"
            [showButtons]="true"
            inputId="page-size"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="marks">Marks</label>
          <p-inputnumber
            [(ngModel)]="marks"
            (ngModelChange)="onMarksChange($event)"
            [min]="0"
            [showButtons]="true"
            inputId="marks"
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
              <th>Title</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Marks</th>
              <th>Starts At</th>
              <th>Ends At</th>
              <th style="width: 8rem">State</th>
            </tr>
          </ng-template>
          <ng-template #body let-quiz>
            <tr>
              @if (quizzesResource.isLoading()) {
                <td><p-skeleton width="60%" height="1.5rem" /></td>
                <td><p-skeleton width="50%" height="1.5rem" /></td>
                <td><p-skeleton width="50%" height="1.5rem" /></td>
                <td><p-skeleton width="30%" height="1.5rem" /></td>
                <td><p-skeleton width="60%" height="1.5rem" /></td>
                <td><p-skeleton width="60%" height="1.5rem" /></td>
                <td><p-skeleton width="4rem" height="1.5rem" /></td>
              } @else {
                <td>{{ quiz.title }}</td>
                <td>{{ quiz.courseName }}</td>
                <td>{{ quiz.instructorName }}</td>
                <td>{{ quiz.marks }}</td>
                <td>{{ quiz.startsAtUtc | date: 'short' }}</td>
                <td>{{ quiz.endsAtUtc | date: 'short' }}</td>
                <td>
                  <span class="state" [class]="quiz.state.toLowerCase()">{{ quiz.state }}</span>
                </td>
              }
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="7">
                @if (quizzesResource.error()) {
                  <div class="error">
                    <p>Failed to load quiz data.</p>
                  </div>
                } @else {
                  <p class="feedback">No quizzes match your filters.</p>
                }
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ quizzesResource.value()?.pageNumber ?? 1 }} of
          {{ quizzesResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          [canGoPrevious]="quizzesResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="quizzesResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
          ariaLabel="Quizzes pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  styles: `
    .state {
      display: inline-flex;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .state.upcoming {
      background-color: #e0f2fe;
      color: #0369a1;
    }

    .state.active {
      background-color: #dcfce7;
      color: #15803d;
    }

    .state.completed {
      background-color: #f3f4f6;
      color: #4b5563;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeQuizzes {
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly tableData = computed<Quiz[]>(() => {
    if (this.quizzesResource.isLoading()) {
      return Array.from<unknown, Quiz>({ length: this.pageSize() }, (_, i) => ({
        quizId: `skeleton-${i}`,
      } as unknown as Quiz));
    }
    if (this.quizzesResource.error()) {
      return [];
    }
    return this.quizzesResource.value()?.items ?? [];
  });
  protected readonly marks = signal<number | null>(
    this.route.snapshot.queryParams['marks']
      ? Number(this.route.snapshot.queryParams['marks'])
      : null,
  );

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm() || null,
          page: this.pageNumber(),
          size: this.pageSize(),
          marks: this.marks(),
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

  protected readonly quizzesResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      marks: this.marks(),
    }),
    stream: ({ params }) =>
      this.quizService.getAllQuizzes({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        marks: params.marks ?? undefined,
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

  protected onMarksChange(value: number | null | undefined): void {
    this.marks.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected goToPreviousPage(): void {
    if (this.quizzesResource.value()?.hasPreviousPage) {
      this.pageNumber.update((value) => Math.max(1, value - 1));
    }
  }

  protected goToNextPage(): void {
    if (this.quizzesResource.value()?.hasNextPage) {
      this.pageNumber.update((value) => value + 1);
    }
  }
}
