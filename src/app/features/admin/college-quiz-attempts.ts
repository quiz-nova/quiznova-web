import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';

@Component({
  selector: 'app-college-quiz-attempts',
  imports: [ProgressSpinner, FormsModule, InputText, InputNumber, NavigationButtons],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Quiz Attempts</p>
          <h1>Attempts Overview</h1>
          <p class="description">Review student submissions, answers, and scores.</p>
        </div>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="attempt-search">Search</label>
          <input
            id="attempt-search"
            pInputText
            class="focus-green-ring"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            placeholder="Search by quiz title or student"
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
          <label for="correct-answers">Correct answers</label>
          <p-inputnumber
            inputId="correct-answers"
            [ngModel]="correctAnswers()"
            (ngModelChange)="onCorrectAnswersChange($event)"
            [min]="0"
            [showButtons]="true"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      @if (quizAttemptsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (quizAttemptsResource.error()) {
        <div class="error">
          <p>Failed to load quiz attempts data.</p>
        </div>
      } @else if (!(quizAttemptsResource.value()?.items?.length ?? 0)) {
        <p class="feedback">No quiz attempts match your filters.</p>
      } @else {
        <div class="table-shell">
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
              @for (attempt of quizAttemptsResource.value()?.items ?? []; track attempt.quizAttemptId) {
                <tr>
                  <td>{{ attempt.quizAttemptId.slice(0, 8) }}</td>
                  <td>{{ attempt.quizTitle }}</td>
                  <td>{{ attempt.answeredQuestions }}/{{ attempt.totalQuestions }}</td>
                  <td>{{ attempt.correctAnswers }}</td>
                  <td>{{ attempt.score }}</td>
                  <td>{{ attempt.submittedAt }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <div class="pagination-row">
        <p class="page-info">
          Page {{ quizAttemptsResource.value()?.pageNumber ?? 1 }} of
          {{ quizAttemptsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          ariaLabel="Quiz attempts pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
          [canGoPrevious]="quizAttemptsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="quizAttemptsResource.value()?.hasNextPage ?? false"
          (previousClicked)="goToPreviousPage()"
          (nextClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: './shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeQuizAttempts {
  private readonly quizAttemptService = inject(QuizAttemptService);

  protected readonly searchTerm = model('');
  protected readonly pageNumber = model(1);
  protected readonly pageSize = model(10);
  protected readonly correctAnswers = model<number | null>(null);

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
    this.pageSize.set(value && value > 0 ? value : 10);
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
