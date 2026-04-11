import { Component, input } from '@angular/core';
import { Question, QuestionAttemptComponent } from '../../../shared/models/quiz/question.model';

@Component({
  selector: 'app-essay-attempt',
  imports: [],
  template: `
    <article class="question-card" aria-label="Essay question">
      <p class="badge">Essay</p>
      <h2>Explain the difference between a process and a thread.</h2>
      <textarea placeholder="Write your answer here..."></textarea>
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

    textarea {
      width: 100%;
      min-height: 8rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      padding: 0.75rem;
      font: inherit;
      resize: vertical;
    }
  `,
})
export class EssayAttempt implements QuestionAttemptComponent {
  readonly question = input.required<Question>();
}
