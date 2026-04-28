import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MCQ } from '@shared/models/quiz/mcq.model';
import { McqAnswer } from '@shared/models/quiz-attempt/question-answer.model';

@Component({
  selector: 'app-mcq-answer-review',
  imports: [],
  template: `
    <article
      class="review-question"
      [class.review-question--correct]="answer().isCorrect === true"
      [class.review-question--incorrect]="answer().isCorrect === false"
      aria-label="Reviewed multiple choice question"
    >
      <header class="review-question__header">
        <div class="review-question__meta">
          <span class="review-question__index">Q{{ questionNumber() }}</span>
          <span class="review-question__type">Multiple Choice</span>
        </div>

        <span class="review-question__marks">
          {{ answer().isCorrect ? '+' + question().marks : '0' }}/{{ question().marks }} pt
        </span>
      </header>

      <p class="review-question__text">{{ question().questionText }}</p>

      <div class="review-question__choices">
        @for (choice of choices(); track choice.id; let i = $index) {
          <div
            class="review-choice"
            [class.review-choice--correct]="choice.id === question().correctChoiceId"
            [class.review-choice--selected]="choice.id === answer().selectedChoiceId"
            [class.review-choice--selected-wrong]="
              choice.id === answer().selectedChoiceId && answer().isCorrect === false
            "
          >
            <span class="review-choice__prefix">{{ letter(i) }}.</span>
            <span class="review-choice__text">{{ choice.text }}</span>

            @if (choice.id === answer().selectedChoiceId) {
              <span class="review-choice__pill">your pick</span>
            } @else if (choice.id === question().correctChoiceId) {
              <span class="review-choice__pill review-choice__pill--correct">correct</span>
            }
          </div>
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .review-question {
      display: grid;
      gap: 0.6rem;
      padding: 0.9rem;
      border: 1px solid var(--clr-review-danger-200);
      border-radius: 0.75rem;
      background: var(--clr-review-danger-50);
    }

    .review-question--correct {
      border-color: var(--clr-review-success-200);
      background: var(--clr-review-success-50);
    }

    .review-question__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .review-question__meta {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .review-question__index {
      font-weight: 700;
      color: var(--clr-blue-900);
      font-size: 0.82rem;
    }

    .review-question__type {
      font-size: 0.72rem;
      border-radius: 999px;
      padding: 0.18rem 0.48rem;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-300);
      color: var(--clr-gray-600);
      font-weight: 700;
    }

    .review-question__marks {
      font-size: 0.8rem;
      border-radius: 999px;
      padding: 0.18rem 0.48rem;
      background: var(--clr-review-danger-500);
      color: var(--clr-white);
      font-weight: 700;
    }

    .review-question--correct .review-question__marks {
      background: var(--clr-review-success-500);
    }

    .review-question__text {
      margin: 0;
      color: var(--clr-blue-900);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .review-question__choices {
      display: grid;
      gap: 0.45rem;
    }

    .review-choice {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 0.45rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.6rem;
      background: var(--clr-white);
      padding: 0.4rem 0.55rem;
    }

    .review-choice--selected-wrong {
      border-color: var(--clr-review-danger-200);
      background: var(--clr-review-danger-50);
    }

    .review-choice--correct {
      border-color: var(--clr-review-success-200);
      background: var(--clr-review-success-50);
    }

    .review-choice__prefix {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--clr-gray-600);
    }

    .review-choice__text {
      font-size: 0.88rem;
      color: var(--clr-blue-900);
      font-weight: 600;
    }

    .review-choice__pill {
      font-size: 0.7rem;
      border-radius: 999px;
      padding: 0.1rem 0.45rem;
      border: 1px solid var(--clr-review-danger-200);
      color: var(--clr-review-danger-500);
      font-weight: 700;
      background: var(--clr-white);
    }

    .review-choice__pill--correct {
      border-color: var(--clr-review-success-200);
      color: var(--clr-review-success-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class McqAnswerReview {
  readonly question = input.required<MCQ>();
  readonly answer = input.required<McqAnswer>();
  readonly questionNumber = input.required<number>();

  protected readonly choices = computed(() => {
    return [...this.question().choices].sort((a, b) => a.displayOrder - b.displayOrder);
  });

  protected letter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
