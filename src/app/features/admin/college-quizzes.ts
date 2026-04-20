import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { QuizService } from '../../shared/services/quiz.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-college-quizzes',
  imports: [ProgressSpinner],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Quizzes</p>
          <h1>Quiz Schedule</h1>
          <p class="description">Track quiz ownership, score weight, and delivery state.</p>
        </div>
      </header>

      @if (quizzesResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (quizzesResource.error()) {
        <div class="error">
          <p>Failed to load quiz data.</p>
        </div>
      } @else if (!(quizzesResource.value()?.length ?? 0)) {
        <p class="feedback">No quizzes are available yet.</p>
      } @else {
        <div class="table-shell">
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
              <!-- @for (quiz of quizzesResource.value() ?? []; track quiz.quizId) {
              <tr>
                <td>{{ quiz.title }}</td>
                <td>{{ quiz.courseName }}</td>
                <td>{{ quiz.instructorName }}</td>
                <td>{{ quiz.marks }}</td>
                <td>{{ quiz.startsAtUtc | date: 'medium' }}</td>
                <td>{{ quiz.endsAtUtc | date: 'medium' }}</td>
                <td>
                  <span class="state" [class]="quiz.state.toLowerCase()">{{ quiz.state }}</span>
                </td>
              </tr>
            } -->
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: `
    .page {
      display: grid;
      gap: 1.5rem;
      padding: 2rem;
    }

    .eyebrow {
      margin: 0 0 0.25rem;
      color: var(--clr-green-500);
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.75rem);
    }

    .description {
      margin: 0.75rem 0 0;
      color: var(--clr-gray-600);
    }

    .table-shell {
      overflow: auto;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--clr-gray-200);
      white-space: nowrap;
    }

    th {
      color: var(--clr-gray-600);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    tbody tr:last-child td {
      border-bottom: 0;
    }

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

    .feedback {
      padding: 1rem 1.25rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
      color: var(--clr-gray-600);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeQuizzes {
  private readonly quizService = inject(QuizService);

  protected readonly quizzesResource = rxResource({
    stream: () => this.quizService.getAllQuizzes(),
  });
}
