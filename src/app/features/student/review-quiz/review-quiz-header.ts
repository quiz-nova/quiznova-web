import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ReviewQuizStore } from './review-quiz.store';

@Component({
  selector: 'app-review-quiz-header',
  imports: [],
  template: `
    <header class="review-header">
      <h1 class="review-header__title">Attempt Review</h1>
      <p class="review-header__subtitle">{{ reviewQuizStore.quizAttempt()?.quizTitle }}</p>

      <div class="review-header__meta">
        <span class="review-header__chip">{{ shortAttemptId() }}</span>
        <span class="review-header__chip">{{ reviewQuizStore.quizAttempt()?.submittedAt }}</span>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .review-header {
      display: grid;
      gap: 0.35rem;
      padding: 0.75rem 0.25rem;
    }

    .review-header__title {
      margin: 0;
      font-size: 1.75rem;
      color: var(--clr-blue-900);
      font-family: var(--ff-heading), sans-serif;
    }

    .review-header__subtitle {
      margin: 0;
      color: var(--clr-gray-600);
      font-size: 0.95rem;
      font-weight: 600;
    }

    .review-header__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .review-header__chip {
      border: 1px solid var(--clr-gray-300);
      border-radius: 999px;
      padding: 0.2rem 0.55rem;
      font-size: 0.75rem;
      color: var(--clr-gray-800);
      background: var(--clr-white);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewQuizHeader {
  protected readonly reviewQuizStore = inject(ReviewQuizStore);

  protected readonly shortAttemptId = computed(() => {
    const id = this.reviewQuizStore.quizAttempt()?.quizAttemptId ?? '';
    return id ? `Attempt ${id.slice(0, 8)}` : '';
  });
}
