import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StudentQuizApiDto } from './models/student-quizzes.model';

@Component({
  selector: 'app-student-scheduled-quizzes',
  imports: [DatePipe],
  template: `
    <section class="quiz-section" aria-labelledby="scheduled-heading">
      <h2 id="scheduled-heading">Scheduled</h2>
      @if (quizzes().length === 0) {
        <p class="empty-state">No scheduled quizzes.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Course</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Starts In</th>
                <th>Starts On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (quiz of quizzes(); track quiz.quizId) {
                <tr>
                  <td>{{ quiz.title }}</td>
                  <td>{{ quiz.courseName }}</td>
                  <td>{{ quiz.questionsCount }}</td>
                  <td>{{ durationInMinutes(quiz) }} min</td>
                  <td>{{ startsInLabel(quiz.startsAtUtc) }}</td>
                  <td>{{ quiz.startsAtUtc | date: 'd MMM, h:mm a' }}</td>
                  <td><span class="locked-tag">Locked</span></td>
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

    .locked-tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 1.75rem;
      padding: 0.2rem 0.75rem;
      border: 1px solid var(--clr-gray-500);
      border-radius: 999px;
      color: var(--clr-gray-800);
      font-size: var(--fs-300);
      font-weight: 700;
      white-space: nowrap;
    }

    @media (width <= 60rem) {
      table {
        min-width: 42rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentScheduledQuizzes {
  readonly quizzes = input.required<StudentQuizApiDto[]>();
  readonly serverUtc = input.required<string>();

  protected durationInMinutes(quiz: StudentQuizApiDto): number {
    const startsAtMs = new Date(quiz.startsAtUtc).getTime();
    const endsAtMs = new Date(quiz.endsAtUtc).getTime();

    if (!Number.isFinite(startsAtMs) || !Number.isFinite(endsAtMs)) {
      return 0;
    }
    return Math.max(0, Math.round((endsAtMs - startsAtMs) / 60000));
  }

  protected startsInLabel(startsAtUtc: string): string {
    const serverMs = new Date(this.serverUtc()).getTime();
    const startsAtMs = new Date(startsAtUtc).getTime();

    if (!Number.isFinite(serverMs) || !Number.isFinite(startsAtMs)) {
      return 'Unknown';
    }

    const diffSeconds = Math.max(0, Math.floor((startsAtMs - serverMs) / 1000));
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
