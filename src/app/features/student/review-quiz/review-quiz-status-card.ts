import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ReviewQuizStore } from './review-quiz.store';

@Component({
  selector: 'app-review-quiz-status-card',
  imports: [],
  template: `
    <section class="status-grid" aria-label="Attempt stats">
      <article class="status-card">
        <p class="status-card__label">Marks Earned</p>
        <p class="status-card__value">{{ marksEarned() }}</p>
      </article>

      <article class="status-card status-card--success">
        <p class="status-card__label">Correct</p>
        <p class="status-card__value">{{ correctAnswers }}</p>
      </article>

      <article class="status-card status-card--danger">
        <p class="status-card__label">Incorrect</p>
        <p class="status-card__value">{{ incorrectAnswers() }}</p>
      </article>

      <article class="status-card status-card--info">
        <p class="status-card__label">Time</p>
        <p class="status-card__value">{{ elapsedTime() }}</p>
      </article>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .status-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .status-card {
      border-radius: 0.75rem;
      border: 1px solid var(--clr-gray-300);
      background: var(--clr-white);
      padding: 0.7rem 0.8rem;
      display: grid;
      gap: 0.25rem;
    }

    .status-card__label {
      margin: 0;
      color: var(--clr-gray-600);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-card__value {
      margin: 0;
      color: var(--clr-blue-900);
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.1;
    }

    .status-card--success .status-card__value {
      color: var(--clr-review-success-500);
    }

    .status-card--danger .status-card__value {
      color: var(--clr-review-danger-500);
    }

    .status-card--info .status-card__value {
      color: var(--clr-review-info-500);
    }

    @media (width <= 64rem) {
      .status-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (width <= 40rem) {
      .status-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewQuizStatusCard {
  private readonly reviewQuizStore = inject(ReviewQuizStore);

  protected readonly marksEarned = computed(() => {
    return `${this.reviewQuizStore.quizAttempt()?.score}/${this.reviewQuizStore.quizAttempt()?.totalQuestions}`;
  });

  protected readonly correctAnswers = this.reviewQuizStore.quizAttempt()?.correctAnswers;

  protected readonly incorrectAnswers = this.reviewQuizStore.incorrectAnswers;

  protected readonly elapsedTime = this.reviewQuizStore.elapsedMinutesLabel;
}
