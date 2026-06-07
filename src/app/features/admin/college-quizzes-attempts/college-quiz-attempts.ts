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
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';

@Component({
  selector: 'app-college-quizzes-attempts',
  imports: [
    ProgressSpinner,
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
          title="Attempts Overview"
          description="Review student submissions, answers, and scores."
        />
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="attempt-search">Search</label>
          <input
            class="focus-green-ring"
            id="attempt-search"
            [(ngModel)]="searchTerm"
            (ngModelChange)="pageNumber.set(1)"
            pInputText
            placeholder="Search by quiz title or student"
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
          <label for="correct-answers">Correct answers</label>
          <p-inputnumber
            [(ngModel)]="correctAnswers"
            (ngModelChange)="onCorrectAnswersChange($event)"
            [min]="0"
            [showButtons]="true"
            inputId="correct-answers"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        @if (quizAttemptsResource.isLoading()) {
          <div class="table-overlay-spinner">
            <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
          </div>
        }
        <table>
          <thead>
            <tr>
              <th>Attempt ID</th>
              <th>Quiz Title</th>
              <th>Answered</th>
              <th>Correct</th>
              <th>Score</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            @if (quizAttemptsResource.error()) {
              <tr>
                <td colspan="6">
                  <div class="error">
                    <p>Failed to load quiz attempts data.</p>
                  </div>
                </td>
              </tr>
            } @else if (
              !quizAttemptsResource.isLoading() &&
              !(quizAttemptsResource.value()?.items?.length ?? 0)
            ) {
              <tr>
                <td colspan="6">
                  <p class="feedback">No quiz attempts match your filters.</p>
                </td>
              </tr>
            } @else {
              @for (
                attempt of quizAttemptsResource.value()?.items ?? [];
                track attempt.quizAttemptId
              ) {
                <tr>
                  <td>{{ attempt.quizAttemptId.slice(0, 8) }}</td>
                  <td>{{ attempt.quizTitle }}</td>
                  <td>{{ attempt.answeredQuestions }}/{{ attempt.totalQuestions }}</td>
                  <td>{{ attempt.correctAnswers }}</td>
                  <td>{{ attempt.score }}</td>
                  <td>{{ attempt.submittedAt }}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ quizAttemptsResource.value()?.pageNumber ?? 1 }} of
          {{ quizAttemptsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          [canGoPrevious]="quizAttemptsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="quizAttemptsResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
          ariaLabel="Quiz attempts pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeQuizzesAttempts {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly correctAnswers = signal<number | null>(
    this.route.snapshot.queryParams['correct']
      ? Number(this.route.snapshot.queryParams['correct'])
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
          correct: this.correctAnswers(),
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

  protected readonly quizAttemptsResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      correctAnswers: this.correctAnswers(),
    }),
    stream: ({ params }) =>
      this.quizAttemptService.getAllQuizAttempts({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        correctAnswers: params.correctAnswers ?? undefined,
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

  protected onCorrectAnswersChange(value: number | null | undefined): void {
    this.correctAnswers.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected goToPreviousPage(): void {
    if (this.quizAttemptsResource.value()?.hasPreviousPage) {
      this.pageNumber.update((value) => Math.max(1, value - 1));
    }
  }

  protected goToNextPage(): void {
    if (this.quizAttemptsResource.value()?.hasNextPage) {
      this.pageNumber.update((value) => value + 1);
    }
  }
}
