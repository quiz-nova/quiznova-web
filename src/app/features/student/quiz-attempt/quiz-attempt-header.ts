import { Component, input } from '@angular/core';
import { Quiz } from '../../../shared/models/quiz/quiz.model';

@Component({
  selector: 'app-quiz-attempt-header',
  imports: [],
  template: `
    <header class="attempt-header">
      <div>
        <h1>{{ quiz()?.title }}</h1>
        <p>Question {{ currentQuestionIndex() }} of {{ quiz()?.questions?.length }}</p>
      </div>

      <div class="attempt-meta" aria-label="Quiz status">
        <span class="chip">{{ numberOfSolvedQuestions() }}/{{ quiz()?.questions?.length }}</span>
        <span class="chip">43:37</span>
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
      color: var(--clr-gray-700);
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
      color: var(--clr-gray-700);
    }

    @media (width <= 40rem) {
      .attempt-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
})
export class QuizAttemptHeader {
  readonly quiz = input.required<Quiz | null>();
  readonly currentQuestionIndex = input.required<number>();
  readonly numberOfSolvedQuestions = input.required<number>();
}
