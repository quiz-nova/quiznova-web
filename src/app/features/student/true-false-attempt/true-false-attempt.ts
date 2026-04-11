import { Component, input, InputSignal } from '@angular/core';
import { Question, QuestionAttemptComponent } from '../../../shared/models/quiz/question.model';

@Component({
  selector: 'app-true-false-attempt',
  imports: [],
  template: `
    <article class="question-card" aria-label="True or false question">
      <p class="badge">True / False</p>
      <h2>Lists in Python are immutable.</h2>

      <div class="options-grid">
        <button type="button" class="option">True</button>
        <button type="button" class="option">False</button>
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
      min-height: 5.5rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      background: var(--clr-white);
      font-weight: 700;
      color: var(--clr-gray-700);
    }

    @media (width <= 40rem) {
      .options-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class TrueFalseAttempt implements QuestionAttemptComponent {
  readonly question = input.required<Question>();
}
