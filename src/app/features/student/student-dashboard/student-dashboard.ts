import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@Features/auth/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { forkJoin, of } from 'rxjs';

import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { RoleDashboardCard } from '@shared/components/role-dashboard-card/role-dashboard-card';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { CoursesService } from '@shared/services/courses.service';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';


@Component({
  selector: 'app-student-dashboard',
  imports: [ProgressSpinner, RoleDashboardHeader, OperationFailed, RoleDashboardCard],
  template: `
    <section class="dashboard">
      <header class="dashboard-header">
        <app-role-dashboard-header
          [description]="'Welcome back, ' + welcomeName()"
          title="Student Dashboard"
        />
      </header>

      @if (summaryResource.isLoading()) {
        <div class="status-container">
          <p-progress-spinner ariaLabel="Loading student dashboard" />
        </div>
      } @else if (summaryResource.error()) {
        <app-operation-failed>
          <p>Failed to load dashboard data.</p>
        </app-operation-failed>
      } @else {
        <section class="card-grid" aria-label="Student summary">
          @for (card of cards(); track card.title) {
            <app-role-dashboard-card
              [title]="card.title"
              [value]="card.value"
              [icon]="card.icon"
              [theme]="card.theme"
            />
          }
        </section>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      background-color: var(--clr-gray-50);
    }

    .dashboard {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      padding: 1.5rem;
    }

    .dashboard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .status-container {
      display: grid;
      min-height: 12rem;
      place-items: center;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDashboard {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly quizAttemptsService = inject(QuizAttemptService);

  protected readonly welcomeName = computed(
    () => this.authService.currentUser()?.name || 'Student',
  );
  protected readonly studentId = computed(() => this.authService.currentUser()?.id ?? null);

  protected readonly summaryResource = rxResource({
    stream: () => {
      const studentId = this.studentId();

      if (!studentId) {
        return of({
          courses: {
            coursesCount: 0,
          },
          quizAttempts: {
            quizAttemptCount: 0,
          },
        });
      }

      return forkJoin({
        courses: this.coursesService.getEnrollmentsCount(studentId),
        quizAttempts: this.quizAttemptsService.getStudentQuizAttemptsCount(studentId),
      });
    },
    defaultValue: {
      courses: {
        coursesCount: 0,
      },
      quizAttempts: {
        quizAttemptCount: 0,
      },
    },
  });

  protected readonly cards = computed(() => {
    const summary = this.summaryResource.value();

    return [
      {
        title: 'Enrolled Courses',
        value: summary.courses.coursesCount,
        icon: 'fa-solid fa-book-open',
        theme: 'green' as const,
      },
      {
        title: 'Quizzes Taken',
        value: summary.quizAttempts.quizAttemptCount,
        icon: 'fa-regular fa-clipboard',
        theme: 'cyan' as const,
      },
    ];
  });
}
