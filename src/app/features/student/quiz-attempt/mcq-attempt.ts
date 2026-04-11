import { Component, input } from '@angular/core';
import { Question, QuestionAttemptComponent } from '../../../shared/models/quiz/question.model';

@Component({
  selector: 'app-mcq-attempt',
  imports: [],
  template: `
    <article class="question-card" aria-label="Multiple choice question">
      <p class="badge">Multiple Choice</p>
      <h2>Which data structure follows LIFO?</h2>

      <div class="options-grid">
        <button type="button" class="option">Queue</button>
        <button type="button" class="option">Stack</button>
        <button type="button" class="option">Array</button>
        <button type="button" class="option">Linked List</button>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .question-card {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    .badge {
      margin: 0;
      width: fit-content;
      border-radius: 999px;
      padding: 0.25rem 0.6rem;
      background: var(--clr-gray-200);
      font-size: 0.75rem;
      font-weight: 700;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .options-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .option {
      min-height: 3rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      background: var(--clr-white);
      font-weight: 600;
      color: var(--clr-gray-700);
      text-align: left;
      padding: 0 0.9rem;
    }

    @media (width <= 40rem) {
      .options-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class McqAttempt implements QuestionAttemptComponent {
  readonly question = input.required<Question>();
}
