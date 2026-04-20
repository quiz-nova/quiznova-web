import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewQuizDetails } from './models/review-quiz.model';

@Component({
  selector: 'app-review-quiz',
  imports: [RouterLink],
  template: `
    <section class="review-page" aria-labelledby="review-title">
      <header class="review-header">
        <h1 id="review-title">Quiz Review</h1>
        <p>Attempt details scaffold for {{ attemptId() }}.</p>
      </header>

      <article class="review-card" aria-label="Review summary">
        <h2>{{ details().quizTitle }}</h2>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>{{ details().statusLabel }}</dd>
          </div>
          <div>
            <dt>Score</dt>
            <dd>{{ details().scoreLabel }}</dd>
          </div>
          <div>
            <dt>Submitted</dt>
            <dd>{{ details().submittedAtLabel }}</dd>
          </div>
        </dl>

        <ul>
          @for (note of details().notes; track note) {
            <li>{{ note }}</li>
          }
        </ul>
      </article>

      <a class="btn btn-gray" [routerLink]="['/student/quizzes']">Back to Quizzes</a>
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      background-color: var(--clr-gray-50);
    }

    .review-page {
      display: grid;
      gap: 1rem;
      padding: 1.5rem;
    }

    .review-header h1 {
      margin: 0;
      color: var(--clr-blue-900);
    }

    .review-header p {
      margin-top: 0.25rem;
      color: var(--clr-gray-600);
    }

    .review-card {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
    }

    h2 {
      margin: 0;
      color: var(--clr-blue-900);
      font-size: var(--fs-600);
    }

    dl {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: 0.8rem;
    }

    dt {
      color: var(--clr-gray-600);
      font-size: var(--fs-300);
      font-weight: 700;
    }

    dd {
      margin: 0.2rem 0 0;
      color: var(--clr-blue-900);
      font-size: var(--fs-500);
      font-weight: 700;
    }

    ul {
      padding-inline-start: 1.2rem;
      color: var(--clr-gray-800);
      display: grid;
      gap: 0.35rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewQuiz {
  readonly attemptId = input.required<string>();

  protected readonly details = computed<ReviewQuizDetails>(() => ({
    attemptId: this.attemptId(),
    quizTitle: 'Quiz details will be available soon',
    statusLabel: 'Processed',
    scoreLabel: 'Pending full breakdown',
    submittedAtLabel: 'Captured in attempt history',
    notes: [
      'This is a lightweight review scaffold based on attempt ID.',
      'Per-question breakdown will be added in the next iteration.',
    ],
  }));
}
