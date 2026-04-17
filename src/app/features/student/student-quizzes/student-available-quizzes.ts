import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {QuizCountdownTag} from '../../../shared/components/quiz-countdown-tag/quiz-countdown-tag';
import {StudentQuizApiDto} from './student-quizzes.model';

@Component({
  selector: 'app-student-available-quizzes',
  imports: [RouterLink, QuizCountdownTag],
  template: `
    <section class="quiz-section" aria-labelledby="available-heading">
      <h2 id="available-heading">Available Now</h2>
      @if (quizzes().length === 0) {
        <p class="empty-state">No available quizzes at the moment.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
            <tr>
              <th>Quiz</th>
              <th>Course</th>
              <th>Questions</th>
              <th>Duration</th>
              <th>Time Remaining</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
              @for (quiz of quizzes(); track quiz.quizId) {
                <tr>
                  <td>{{ quiz.title }}</td>
                  <td>{{ quiz.courseName }}</td>
                  <td>{{ quiz.questionsCount }}</td>
                  <td>{{ durationInMinutes(quiz) }} min</td>
                  <td>
                    <app-quiz-countdown-tag
                      [endsAtUtc]="quiz.endsAtUtc"
                      [serverUtc]="serverUtc()"
                      (expired)="markQuizExpired(quiz.quizId)"
                    />
                  </td>
                  <td>
                    <a
                      class="btn btn-green start-btn"
                      [routerLink]="['/student/quiz-attempt', quiz.quizId]"
                      [class.start-btn--disabled]="isQuizExpired(quiz.quizId)"
                      [attr.aria-disabled]="isQuizExpired(quiz.quizId)"
                      [tabIndex]="isQuizExpired(quiz.quizId) ? -1 : 0"
                    >Start Quiz</a
                    >
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
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

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 46rem;
    }

    th,
    td {
      padding: 0.85rem;
      border-bottom: 1px solid var(--clr-gray-200);
      text-align: left;
      vertical-align: middle;
      color: var(--clr-blue-900);
      font-size: var(--fs-300);
    }

    th {
      color: var(--clr-gray-600);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    tbody tr:last-child td {
      border-bottom: 0;
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

    .start-btn--disabled {
      cursor: not-allowed;
      opacity: 0.6;
      pointer-events: none;
    }

    @media (width <= 60rem) {
      table {
        min-width: 42rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAvailableQuizzes {
  readonly quizzes = input.required<StudentQuizApiDto[]>();
  readonly serverUtc = input.required<string>();

  private readonly expiredQuizIds = signal<Record<string, true>>({});

  protected markQuizExpired(quizId: string): void {
    this.expiredQuizIds.update((state) => ({
      ...state,
      [quizId]: true,
    }));
  }

  protected isQuizExpired(quizId: string): boolean {
    return this.expiredQuizIds()[quizId];
  }

  protected durationInMinutes(quiz: StudentQuizApiDto): number {
    const startsAtMs = new Date(quiz.startsAtUtc).getTime();
    const endsAtMs = new Date(quiz.endsAtUtc).getTime();

    if (!Number.isFinite(startsAtMs) || !Number.isFinite(endsAtMs)) {
      return 0;
    }

    return Math.max(0, Math.round((endsAtMs - startsAtMs) / 60000));
  }
}
