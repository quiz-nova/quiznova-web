import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MCQ } from '@shared/models/quiz/mcq.model';

@Component({
  selector: 'app-mcq-not-answered',
  imports: [],
  template: `
    <article class="review-question" aria-label="Unanswered multiple choice question">
      <header class="review-question__header">
        <div class="review-question__meta">
          <span class="review-question__index">Q{{ questionNumber() }}</span>
          <span class="review-question__type">Multiple Choice</span>
        </div>
        <span class="review-question__marks">0/{{ question().marks }} pt</span>
      </header>

      <p class="review-question__text">{{ question().questionText }}</p>
      <p class="review-question__note">Not answered</p>

      <div class="review-question__choices">
        @for (choice of choices(); track choice.id; let i = $index) {
          <div
            class="review-choice"
            [class.review-choice--correct]="choice.id === question().correctChoiceId"
          >
            <span class="review-choice__prefix">{{ letter(i) }}.</span>
            <span class="review-choice__text">{{ choice.text }}</span>
            @if (choice.id === question().correctChoiceId) {
              <span class="review-choice__pill">correct</span>
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
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
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
      background: var(--clr-gray-800);
      color: var(--clr-white);
      font-weight: 700;
    }

    .review-question__text {
      margin: 0;
      color: var(--clr-blue-900);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .review-question__note {
      margin: 0;
      color: var(--clr-review-danger-500);
      font-size: 0.82rem;
      font-weight: 700;
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
      border: 1px solid var(--clr-review-success-200);
      color: var(--clr-review-success-500);
      font-weight: 700;
      background: var(--clr-white);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class McqNotAnswered {
  readonly question = input.required<MCQ>();
  readonly questionNumber = input.required<number>();

  protected readonly choices = computed(() => {
    return [...this.question().choices].sort((a, b) => a.displayOrder - b.displayOrder);
  });

  protected letter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
