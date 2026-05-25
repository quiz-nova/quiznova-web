import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { QuizService } from '@shared/services/quiz.service';

@Component({
  selector: 'app-college-quizzes',
  imports: [ProgressSpinner, FormsModule, InputText, InputNumber, NavigationButtons, RoleDashboardHeader],
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
            id="quiz-search"
            pInputText
            class="focus-green-ring"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            placeholder="Search by title, course, or instructor"
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
          <label for="marks">Marks</label>
          <p-inputnumber
            inputId="marks"
            [(ngModel)]="marks"
            (ngModelChange)="onMarksChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        @if (quizzesResource.isLoading()) {
          <div class="table-overlay-spinner">
            <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
          </div>
        }
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Marks</th>
              <th>Starts At</th>
              <th>Ends At</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            @if (quizzesResource.error()) {
              <tr>
                <td colspan="7">
                  <div class="error">
                    <p>Failed to load quiz data.</p>
                  </div>
                </td>
              </tr>
            } @else if (!quizzesResource.isLoading() && !(quizzesResource.value()?.items?.length ?? 0)) {
              <tr>
                <td colspan="7">
                  <p class="feedback">No quizzes match your filters.</p>
                </td>
              </tr>
            } @else {
              @for (quiz of quizzesResource.value()?.items ?? []; track quiz.quizId) {
                <tr>
                  <td>{{ quiz.title }}</td>
                  <td>{{ quiz.courseName }}</td>
                  <td>{{ quiz.instructorName }}</td>
                  <td>{{ quiz.marks }}</td>
                  <td>{{ quiz.startsAtUtc }}</td>
                  <td>{{ quiz.endsAtUtc }}</td>
                  <td>
                    <span class="state" [class]="quiz.state.toLowerCase()">{{ quiz.state }}</span>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ quizzesResource.value()?.pageNumber ?? 1 }} of
          {{ quizzesResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          ariaLabel="Quizzes pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
          [canGoPrevious]="quizzesResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="quizzesResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: './shared/college-tables-shared.css',
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
  protected readonly marks = signal<number | null>(
    this.route.snapshot.queryParams['marks'] ? Number(this.route.snapshot.queryParams['marks']) : null
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
