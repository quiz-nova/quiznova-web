import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { QuizAttemptStore } from './quiz-attempt.store';

@Component({
  selector: 'app-quiz-attempt-header',
  imports: [],
  template: `
    <header class="attempt-header">
      <div>
        <h1>{{ quizAttemptStore.quizTitle() }}</h1>
        <p>
          Question {{ this.quizAttemptStore.currentQuestionIndex() }} of
          {{ quizAttemptStore.numberOfQuestions() }}
        </p>
      </div>

      <div class="attempt-meta" aria-label="Quiz status">
        <span class="chip"
          >{{ this.quizAttemptStore.numberOfSolvedQuestions() }}/{{
            quizAttemptStore.numberOfQuestions()
          }}</span
        >
        <span class="chip">{{ remainingTime() }}</span>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .attempt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    h1 {
      margin: 0;
      font-size: 1.25rem;
    }

    p {
      margin: 0.25rem 0 0;
      color: var(--clr-gray-600);
      font-size: 0.875rem;
    }

    .attempt-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: end;
    }

    .chip {
      padding: 0.35rem 0.65rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--clr-gray-600);
    }

    @media (width <= 40rem) {
      .attempt-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAttemptHeader {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);

  // user-friendly remaining time in format mm:ss
  protected readonly remainingTime = computed(() => {
    const seconds = this.quizAttemptStore.remaningSeconds();
    const minutes = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsPart.toString().padStart(2, '0')}`;
  });
}
