import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateQuizStore } from './create-quiz.store';

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
    }

    .stat-icon {
      color: #1f2937;
    }
  `,
})
export class QuizHeader {
  protected readonly createQuizStore = inject(CreateQuizStore);
  protected readonly numberOfQuestions = this.createQuizStore.numberOfQuestions;
  protected readonly totalMarks = this.createQuizStore.totalMarks;
}
