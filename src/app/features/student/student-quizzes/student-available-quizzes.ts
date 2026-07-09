import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';

import { Button } from '@shared/components/button/button';
import { ConfirmActionModal } from '@shared/components/confirm-action-modal/confirm-action-modal';
import { QuizCountdownTag } from '@shared/components/quiz-countdown-tag/quiz-countdown-tag';
import { durationInMinutes } from '@shared/utils/utilities';

import { StudentQuizApiDto } from './models/student-quizzes.model';

@Component({
  selector: 'app-student-available-quizzes',
  imports: [RouterLink, QuizCountdownTag, Button, ConfirmActionModal, TableModule],
  template: `
    <section class="quiz-section" aria-labelledby="available-heading">
      <h2 id="available-heading">Available Now</h2>
      @if (quizzes().length === 0) {
        <p class="empty-state">No available quizzes at the moment.</p>
      } @else {
        <div class="table-shell">
          <p-table [value]="quizzes()" [tableStyle]="{ 'min-width': '46rem' }">
            <ng-template #header>
              <tr>
                <th>Quiz</th>
                <th>Course</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Time Remaining</th>
                <th>Action</th>
              </tr>
            </ng-template>
            <ng-template #body let-quiz>
              <tr>
                <td>{{ quiz.title }}</td>
                <td>{{ quiz.courseName }}</td>
                <td>{{ quiz.questionsCount }}</td>
                <td>{{ durationInMinutes(quiz.startsAtUtc, quiz.endsAtUtc) }} min</td>
                <td>
                  <app-quiz-countdown-tag
                    [endsAtUtc]="quiz.endsAtUtc"
                    [serverUtc]="serverUtc()"
                    (expired)="markQuizExpired(quiz.quizId)"
                  />
                </td>
                <td>
                  @if (quiz.attemptId) {
                    <a
                      appButton
                      variant="green"
                      class="start-btn"
                      [routerLink]="['/student/quiz-attempt', quiz.quizId]"
                      [queryParams]="{ attemptId: quiz.attemptId }"
                      >Continue</a
                    >
                  } @else {
                    <button
                      appButton
                      variant="green"
                      class="start-btn"
                      [disabled]="isQuizExpired(quiz.quizId)"
                      (click)="startQuiz(quiz)"
                      type="button"
                    >
                      Start Quiz
                    </button>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }
    </section>

    @if (pendingQuiz(); as quiz) {
      <app-confirm-action-modal
        title="Start Quiz"
        [warningMessage]="'You are about to start the quiz: ' + quiz.title"
        confirmationPhrase="start"
        confirmButtonText="Yes, Start Quiz"
        variant="info"
        (confirmed)="onConfirmStart()"
        (cancelled)="onCancelStart()"
      />
    }
  `,
  styles: `
    .quiz-section {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
    }

    h2 {
      margin: 0;
      color: var(--clr-blue-900);
      font-size: var(--fs-600);
    }

    .table-shell {
      overflow: auto;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
    }

    .empty-state {
      padding: 0.85rem 1rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      color: var(--clr-gray-600);
      background-color: var(--clr-gray-50);
    }

    .start-btn {
      min-height: 2.15rem;
      padding: 0.4rem 0.8rem;
      font-size: var(--fs-300);
      font-weight: 700;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAvailableQuizzes {
  readonly quizzes = input.required<StudentQuizApiDto[]>();
  readonly serverUtc = input.required<string>();

  private readonly router = inject(Router);
  private readonly expiredQuizIds = signal<Record<string, true>>({});
  private readonly pendingQuizSignal = signal<StudentQuizApiDto | null>(null);

  protected readonly pendingQuiz = computed(() => this.pendingQuizSignal());

  protected markQuizExpired(quizId: string): void {
    this.expiredQuizIds.update((state) => ({
      ...state,
      [quizId]: true,
    }));
  }

  protected isQuizExpired(quizId: string): boolean {
    return this.expiredQuizIds()[quizId];
  }

  protected startQuiz(quiz: StudentQuizApiDto): void {
    this.pendingQuizSignal.set(quiz);
  }

  protected onConfirmStart(): void {
    const quiz = this.pendingQuizSignal();
    if (!quiz) return;

    this.pendingQuizSignal.set(null);
    this.router.navigate(['/student/quiz-attempt', quiz.quizId]);
  }

  protected onCancelStart(): void {
    this.pendingQuizSignal.set(null);
  }

  protected readonly durationInMinutes = durationInMinutes;
}
