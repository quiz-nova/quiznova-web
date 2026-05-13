import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-quiz-header',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz-header-stats" aria-label="Quiz summary">
      <div class="stat-pill">
        <i class="fa-solid fa-rectangle-list stat-icon" aria-hidden="true"></i>
        <span>{{ numberOfQuestions() }} Questions</span>
      </div>

      <div class="stat-pill">
        <i class="fa-solid fa-arrow-trend-up stat-icon" aria-hidden="true"></i>
        <span>{{ totalMarks() }} Marks</span>
      </div>

      <div class="stat-pill" [class.stat-pill--warning]="remainingMarks() !== null && remainingMarks()! <= 0">
        <i class="fa-solid fa-coins stat-icon" aria-hidden="true"></i>
        <span>{{ remainingMarks() !== null ? remainingMarks() : '—' }} Remaining</span>
      </div>
    </div>
  `,
  styles: `
    .quiz-header-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border: 1px solid #d8dee8;
      border-radius: 999px;
      background-color: #fff;
      color: #0f172a;
      font-size: var(--fs-300);
      font-weight: 500;
      line-height: 1;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .stat-pill--warning {
      border-color: #fecaca;
      background-color: #fef2f2;
      color: #991b1b;
    }

    .stat-pill--warning .stat-icon {
      color: #991b1b;
    }

    .stat-icon {
      color: #1f2937;
    }
  `,
})
export class QuizHeader {
  readonly numberOfQuestions = input.required<number>();
  readonly totalMarks = input.required<number>();
  readonly remainingMarks = input<number | null>(null);
}
