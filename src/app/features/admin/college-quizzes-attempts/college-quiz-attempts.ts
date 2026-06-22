import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
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
import { QuizAttempt } from '@shared/models/quiz-attempt/quiz-attempt.model';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';
import { shortId } from '@shared/utils/utilities';

@Component({
  selector: 'app-college-quizzes-attempts',
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
            [min]="1"
            [max]="100"
            [showButtons]="true"
            (ngModelChange)="onPageSizeChange($event)"
            inputId="page-size"
          ></p-inputnumber>
        </div>

        <div class="filter-item">
          <label for="correct-answers">Correct answers</label>
          <p-inputnumber
            [(ngModel)]="correctAnswers"
            [min]="0"
            [showButtons]="true"
            (ngModelChange)="onCorrectAnswersChange($event)"
            inputId="correct-answers"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        <p-table [value]="tableData()" [tableStyle]="{ 'min-width': '50rem' }">
          <ng-template #header>
            <tr>
              <th>Attempt ID</th>
              <th>Quiz Title</th>
              <th>Answered</th>
              <th>Correct</th>
              <th>Score</th>
              <th>Submitted At</th>
            </tr>
          </ng-template>
          <ng-template #body let-attempt>
            <tr>
              @if (quizAttemptsResource.isLoading()) {
                <td><p-skeleton width="50%" height="1.5rem" /></td>
                <td><p-skeleton width="70%" height="1.5rem" /></td>
                <td><p-skeleton width="40%" height="1.5rem" /></td>
                <td><p-skeleton width="40%" height="1.5rem" /></td>
                <td><p-skeleton width="30%" height="1.5rem" /></td>
                <td><p-skeleton width="60%" height="1.5rem" /></td>
              } @else {
                <td>{{ shortId(attempt.quizAttemptId) }}</td>
                <td>{{ attempt.quizTitle }}</td>
                <td>{{ attempt.answeredQuestions }}/{{ attempt.totalQuestions }}</td>
                <td>{{ attempt.correctAnswers }}</td>
                <td>{{ attempt.score }}</td>
                <td>{{ attempt.submittedAt | date: 'short' }}</td>
              }
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="6">
                @if (quizAttemptsResource.error()) {
                  <div class="error">
                    <p>Failed to load quiz attempts data.</p>
                  </div>
                } @else {
                  <p class="feedback">No quiz attempts match your filters.</p>
                }
              </td>
            </tr>
          </ng-template>
        </p-table>
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
  protected readonly shortId = shortId;

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly tableData = computed<QuizAttempt[]>(() => {
    if (this.quizAttemptsResource.isLoading()) {
      return Array.from<unknown, QuizAttempt>(
        { length: this.pageSize() },
        (_, i) =>
          ({
            quizAttemptId: `skeleton-${i}`,
          }) as unknown as QuizAttempt,
      );
    }
    if (this.quizAttemptsResource.error()) {
      return [];
    }
    return this.quizAttemptsResource.value()?.items ?? [];
  });
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
