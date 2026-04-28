import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ProgressBar } from 'primeng/progressbar';

import { QuizAttemptStore } from './quiz-attempt.store';

@Component({
  selector: 'app-questions-progrss-bar',
  imports: [ProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="progress-card" aria-label="Quiz progress">
      <p-progressbar
        class="quiz-progress"
        [value]="progressValue()"
        [showValue]="false"
        aria-label="Solved questions progress"
      >
      </p-progressbar>

      <p class="progress-summary">
        {{ quizAttemptStore.numberOfSolvedQuestions() }} of
        {{ quizAttemptStore.numberOfQuestions() }} answered
      </p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .progress-card {
      display: grid;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    .quiz-progress {
      height: 1rem;
      border-radius: var(--radius-lg);
      background: var(--clr-gray-200);
    }

    .quiz-progress .p-progressbar-value {
      border-radius: var(--radius-lg);
      background: var(--gradient-main);
    }

    .progress-label {
      color: var(--clr-blue-900);
      font-size: var(--fs-300);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .progress-summary {
      margin: 0;
      text-align: center;
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      font-weight: 600;
    }
  `,
})
export class QuestionsProgrssBar {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  protected readonly progressValue = computed(() => {
    const total = this.quizAttemptStore.numberOfQuestions();
    if (total === 0) {
      return 0;
    }

    return Math.round((this.quizAttemptStore.numberOfSolvedQuestions() / total) * 100);
  });
}
