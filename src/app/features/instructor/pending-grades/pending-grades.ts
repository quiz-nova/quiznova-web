import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ProgressSpinner } from 'primeng/progressspinner';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { PaginatedList } from '@shared/models/pagination/paginated-list.model';
import { PendingManualAnswers } from '@shared/models/quiz-attempt/pending-manual-answer.model';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';
import { initials } from '@shared/utils/utilities';

import { NoPendingGrades } from './no-pending-grades';
import { PendingGradesStats } from './pending-grades-stats';

@Component({
  selector: 'app-pending-grades',
  imports: [
    ProgressSpinner,
    RoleDashboardHeader,
    DatePipe,
    NoPendingGrades,
    PendingGradesStats,
    OperationFailed,
    NavigationButtons,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="Pending Grades"
          description="Essay submissions awaiting your review"
        />
      </header>

      @if (pendingResource.isLoading()) {
        <div class="status-container">
          <p-progress-spinner ariaLabel="Loading pending grades" />
        </div>
      } @else if (pendingResource.error()) {
        <app-operation-failed>
          <p>Failed to load pending grades. Please try again.</p>
        </app-operation-failed>
      } @else {
        <!-- Stats row -->
        <app-pending-grades-stats [stats]="stats()" />

        <!-- Pending list -->
        @if (pendingList().length === 0) {
          <app-no-pending-grades />
        } @else {
          <section class="list-container" aria-label="Pending grading submissions">
            <div class="list-header">
              <span>Student</span>
              <span>Quiz / Course</span>
              <span>Submitted</span>
              <span>Pending</span>
              <span></span>
            </div>

            @for (item of pendingList(); track item.attemptId) {
              <article
                class="submission-row"
                (click)="navigateToReview(item)"
                (keydown.enter)="navigateToReview(item)"
                tabindex="0"
                [attr.aria-label]="'Review submission by ' + item.studentName"
                role="button"
              >
                <!-- Avatar + Student Name -->
                <div class="student-cell">
                  <div class="avatar" aria-hidden="true">
                    {{ initials(item.studentName) }}
                  </div>
                  <div>
                    <p class="student-name">{{ item.studentName }}</p>
                  </div>
                </div>

                <!-- Quiz / Course -->
                <div class="quiz-cell">
                  <p class="quiz-title">{{ item.quizTitle }}</p>
                  <p class="course-name">
                    <i class="fa-solid fa-book-open"></i>
                    {{ item.courseName }}
                  </p>
                </div>

                <!-- Submitted At -->
                <div class="date-cell">
                  <p>{{ item.submittedAt | date: 'MMM d, y' }}</p>
                  <p class="time">{{ item.submittedAt | date: 'h:mm a' }}</p>
                </div>

                <!-- Badge -->
                <div class="badge-cell">
                  <span class="pending-badge">
                    {{ item.ungradedCount }}
                    {{ item.ungradedCount === 1 ? 'question' : 'questions' }}
                  </span>
                </div>

                <!-- Arrow -->
                <div class="arrow-cell" aria-hidden="true">
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              </article>
            }

            <!-- Pagination Row -->
            <div class="pagination-row">
              <p class="page-info">
                Page {{ pendingResource.value()?.pageNumber ?? 1 }} of
                {{ pendingResource.value()?.totalPages ?? 1 }}
              </p>
              <app-navigation-buttons
                ariaLabel="Pending grades pagination"
                previousLabel="Previous page"
                nextLabel="Next page"
                [canGoPrevious]="pendingResource.value()?.hasPreviousPage ?? false"
                [canGoNext]="pendingResource.value()?.hasNextPage ?? false"
                (previousButtonClicked)="goToPreviousPage()"
                (nextButtonClicked)="goToNextPage()"
              />
            </div>
          </section>
        }
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      background-color: var(--clr-gray-50);
    }

    .page {
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }


    /* ── List ───────────────────────────────── */
    .list-container {
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: 0 4px 16px rgb(15 23 42 / 5%);
    }

    .list-header {
      display: grid;
      grid-template-columns: 2fr 2fr 1.5fr 1fr 0.25fr;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      background: var(--clr-gray-50);
      border-bottom: 1px solid var(--clr-gray-200);
      color: var(--clr-gray-600);
      font-size: var(--fs-300);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .submission-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1.5fr 1fr 0.25fr;
      gap: 1rem;
      align-items: center;
      padding: 1.125rem 1.5rem;
      border-bottom: 1px solid var(--clr-gray-100);
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .submission-row:last-child { border-bottom: none; }

    .submission-row:hover,
    .submission-row:focus-visible {
      background-color: var(--clr-green-50);
      outline: none;
    }

    /* Student cell */
    .student-cell {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--gradient-main);
      color: var(--clr-white);
      font-size: 0.875rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .student-name {
      font-weight: 600;
      color: var(--clr-gray-800);
    }

    /* Quiz cell */
    .quiz-title {
      font-weight: 600;
      color: var(--clr-gray-800);
    }

    .course-name {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      margin-top: 0.2rem;
    }

    .course-name i { font-size: 0.7rem; }

    /* Date cell */
    .date-cell p { color: var(--clr-gray-800); font-weight: 500; }

    .time {
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      margin-top: 0.15rem;
    }

    /* Badge */
    .pending-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      background: #fef3c7;
      color: #92400e;
      font-size: var(--fs-300);
      font-weight: 600;
    }

    /* Arrow */
    .arrow-cell {
      display: flex;
      justify-content: flex-end;
      color: var(--clr-gray-500);
      transition: transform 0.15s ease, color 0.15s ease;
    }

    .submission-row:hover .arrow-cell,
    .submission-row:focus-visible .arrow-cell {
      transform: translateX(3px);
      color: var(--clr-green-500);
    }

    /* Pagination Row */
    .pagination-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: var(--clr-gray-50);
      border-top: 1px solid var(--clr-gray-200);
    }

    .page-info {
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      font-weight: 500;
      margin: 0;
    }

    /* Status helpers */
    .status-container {
      display: grid;
      place-items: center;
      min-height: 14rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingGrades {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly router = inject(Router);

  protected readonly pageNumber = signal(1);

  protected readonly pendingResource = rxResource<PaginatedList<PendingManualAnswers>, { page: number }>({
    params: () => ({ page: this.pageNumber() }),
    stream: ({ params }) => this.quizAttemptService.getPendingManualAnswers(params.page, 10),
  });

  protected readonly pendingList = computed<PendingManualAnswers[]>(
    () => this.pendingResource.value()?.items ?? [],
  );

  protected readonly stats = computed(() => {
    const response = this.pendingResource.value();
    const totalCount = response?.totalCount ?? 0;
    const items = response?.items ?? [];
    const totalUngraded = items.reduce((sum: number, item: PendingManualAnswers) => sum + item.ungradedCount, 0);

    return [
      {
        label: 'Awaiting Review',
        value: totalCount,
        icon: 'fa-solid fa-hourglass-half',
        iconClass: 'stat-icon amber',
      },
      {
        label: 'Total Questions (Page)',
        value: totalUngraded,
        icon: 'fa-solid fa-pen-nib',
        iconClass: 'stat-icon violet',
      },
    ];
  });

  protected goToPreviousPage(): void {
    this.pageNumber.update((value) => Math.max(1, value - 1));
  }

  protected goToNextPage(): void {
    this.pageNumber.update((value) => value + 1);
  }

  protected navigateToReview(item: PendingManualAnswers): void {
    this.router.navigate(['/instructor/grade', item.attemptId]);
  }

  protected readonly initials = initials;
}
