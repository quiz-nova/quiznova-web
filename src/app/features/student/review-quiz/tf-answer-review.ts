import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StudentAnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Tf } from '@shared/models/quiz/questions/tf.model';
import { QuestionAnswer, TfAnswer } from '@shared/models/quiz-attempt/question-answer.model';

@Component({
  selector: 'app-tf-answer-review',
  imports: [],
  template: `
    <article
      class="review-question"
      [class.review-question--correct]="tfAnswer().isCorrect"
      [class.review-question--incorrect]="!tfAnswer().isCorrect"
      aria-label="Reviewed tf question"
    >
      <header class="review-question__header">
        <div class="review-question__meta">
          <span class="review-question__index">Q{{ questionNumber() }}</span>
          <span class="review-question__type">True / False</span>
        </div>

        <span class="review-question__marks">
          {{ tfAnswer().isCorrect ? '+' + tf().marks : '0' }}/{{ tf().marks }} pt
        </span>
      </header>

      <p class="review-question__text">{{ tf().questionText }}</p>

      <div class="review-question__answers">
        <div class="review-answer review-answer--student">
          <p class="review-answer__label">Your answer</p>
          <p class="review-answer__value">{{ studentAnswerLabel() }}</p>
        </div>

        <div class="review-answer review-answer--correct">
          <p class="review-answer__label">Correct answer</p>
          <p class="review-answer__value">{{ correctAnswerLabel() }}</p>
        </div>
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
      border: 1px solid var(--clr-red-200);
      border-radius: 0.75rem;
      background: var(--clr-red-50);
    }

    .review-question--correct {
      border-color: var(--clr-emerald-200);
      background: var(--clr-emerald-50);
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
      background: var(--clr-red-600);
      color: var(--clr-white);
      font-weight: 700;
    }

    .review-question--correct .review-question__marks {
      background: var(--clr-green-500);
    }

    .review-question__text {
      margin: 0;
      color: var(--clr-blue-900);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .review-question__answers {
      display: grid;
      gap: 0.55rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .review-answer {
      border-radius: 0.6rem;
      border: 1px solid var(--clr-red-200);
      background: var(--clr-white);
      padding: 0.5rem 0.6rem;
    }

    .review-answer--correct {
      border-color: var(--clr-emerald-200);
      background: var(--clr-emerald-50);
    }

    .review-answer__label {
      margin: 0;
      color: var(--clr-gray-600);
      font-size: 0.72rem;
      font-weight: 600;
    }

    .review-answer__value {
      margin: 0.2rem 0 0;
      color: var(--clr-blue-900);
      font-size: 0.9rem;
      font-weight: 700;
    }

    @media (width <= 40rem) {
      .review-question__answers {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TfAnswerReview implements StudentAnswerReviewContract {
  readonly question = input.required<Question>();
  readonly answer = input.required<QuestionAnswer>();
  readonly questionNumber = input.required<number>();

  protected readonly tf = computed(() => this.question() as Tf);
  protected readonly tfAnswer = computed(() => this.answer() as TfAnswer);

  protected readonly studentAnswerLabel = computed(() =>
    this.tfAnswer().studentChoice ? 'True' : 'False',
  );
  protected readonly correctAnswerLabel = computed(() =>
    this.tf().correctChoice ? 'True' : 'False',
  );
}
