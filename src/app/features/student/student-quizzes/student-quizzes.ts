import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@Features/auth/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { map, of } from 'rxjs';

import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { QuizService } from '@shared/services/quiz.service';

import { StudentQuizzesApiResponse, StudentQuizStatus } from './models/student-quizzes.model';
import { StudentAvailableQuizzes } from './student-available-quizzes';
import { StudentScheduledQuizzes } from './student-scheduled-quizzes';

@Component({
  selector: 'app-student-quizzes',
  imports: [
    ProgressSpinner,
    RoleDashboardHeader,
    StudentAvailableQuizzes,
    StudentScheduledQuizzes,
    OperationFailed,
  ],
  template: `
    <section class="quizzes-page">
      <app-role-dashboard-header
        title="Quizzes"
        description="Take available quizzes before they expire and check upcoming schedules."
      />

      @if (quizzesResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="Loading quizzes" />
        </div>
      } @else if (quizzesResource.error()) {
        <app-operation-failed>
          <p>Failed to load quizzes.</p>
        </app-operation-failed>
      } @else {
        @if (availableQuizzes().length === 0 && scheduledQuizzes().length === 0) {
          <div class="empty-state" role="status">
            <p>You don't have any quizzes at the moment.</p>
          </div>
        } @else {
          <app-student-available-quizzes [quizzes]="availableQuizzes()" [serverUtc]="serverUtc()" />

          <app-student-scheduled-quizzes [quizzes]="scheduledQuizzes()" [serverUtc]="serverUtc()" />
        }
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--clr-gray-50);
    }

    .quizzes-page {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      padding: 1.5rem;
    }

    .empty-state {
      padding: 2rem;
      border: 1px dashed var(--clr-gray-300);
      border-radius: var(--radius-lg);
      color: var(--clr-gray-600);
      text-align: center;
    }

    @media (width <= 60rem) {
      .quizzes-page {
        padding: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizzes {
  private readonly authService = inject(AuthService);
  private readonly quizService = inject(QuizService);

  protected readonly studentId = computed(() => this.authService.currentUser()?.id ?? null);

  protected readonly quizzesResource = rxResource({
    stream: () => {
      const studentId = this.studentId();
      if (!studentId) {
        return of({
          serverUtc: new Date().toISOString(),
          quizzes: [],
        } satisfies StudentQuizzesApiResponse);
      }

      return this.quizService
        .getStudentQuizzesLifecycle(studentId)
        .pipe(map((response) => response as unknown as StudentQuizzesApiResponse));
    },
    defaultValue: {
      serverUtc: new Date().toISOString(),
      quizzes: [],
    } satisfies StudentQuizzesApiResponse,
  });

  protected readonly serverUtc = computed(() => this.quizzesResource.value().serverUtc);

  protected readonly availableQuizzes = computed(() => {
    return this.quizzesResource
      .value()
      .quizzes.filter(
        (quiz) =>
          quiz.quizStatus === StudentQuizStatus.AvailableNow &&
          quiz.attemptStatus !== 'Completed',
      );
  });

  protected readonly scheduledQuizzes = computed(() => {
    return this.quizzesResource
      .value()
      .quizzes.filter(
        (quiz) =>
          quiz.quizStatus === StudentQuizStatus.Scheduled &&
          quiz.attemptStatus !== 'Completed',
      );
  });
}
