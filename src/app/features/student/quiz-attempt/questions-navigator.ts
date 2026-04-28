import { Component, inject } from '@angular/core';

import { QuizAttemptStore } from './quiz-attempt.store';

@Component({
  selector: 'app-questions-navigator',
  imports: [],
  template: `
    <section class="navigator-card" aria-label="Question navigator">
      <h2>Question Navigator</h2>

      <div class="navigator-grid">
        @for (question of quizAttemptStore.quizQuestions(); track $index) {
          <button
            [class.is-current]="$index === quizAttemptStore.currentQuestionIndex()"
            [class.is-flagged]="question.isFlagged"
            [class.is-solved]="question.isSolved"
            (click)="onClick($index)"
            type="button"
          >
            {{ $index + 1 }}
          </button>
        }
      </div>

      <ul class="legend" aria-label="Question status legend">
        <li><span class="dot answered"></span>Answered</li>
        <li><span class="dot unanswered"></span>Unanswered</li>
        <li><span class="dot flagged"></span>Flagged</li>
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .navigator-card {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    h2 {
      margin: 0;
      font-size: 1rem;
    }

    .navigator-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(2rem, 1fr));
      gap: 0.5rem;
    }

    button {
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      min-height: 2rem;
      background: var(--clr-gray-100);
      font-weight: 600;
      color: var(--clr-gray-500);
    }

    /* Solved state */
    button.is-solved {
      background: var(--clr-green-500);
      color: var(--clr-white);
      border-color: var(--clr-green-500);
    }

    /* Flagged state (overrides solved) */
    button.is-flagged {
      background: var(--clr-yellow-500);
      color: var(--clr-red-500);
      border-color: var(--clr-yellow-500);
    }

    /* Current state (overrides all other states) */
    button.is-current {
      background: var(--clr-white);
      color: var(--clr-green-500);
      border: 2px solid var(--clr-green-500);
    }

    .legend {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--clr-gray-600);
    }

    .legend li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 999px;
      display: inline-block;
    }

    .answered {
      background: var(--clr-green-500);
    }

    .unanswered {
      background: var(--clr-gray-300);
    }

    .flagged {
      background: var(--clr-yellow-500);
    }
  `,
})
export class QuestionsNavigator {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);

  onClick(index: number) {
    this.quizAttemptStore.setCurrentQuestionIndex(index);
  }
}
