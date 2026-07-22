import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { isTf, Tf } from '@shared/models/quiz/questions/tf.model';
import {
  QuestionAnswer,
  TfAnswer,
  isTfAnswer,
} from '@shared/models/quiz-attempt/question-answer.model';

@Component({
  selector: 'app-tf-answer-review',
  imports: [],
  template: `
    <div class="auto-answer-section">
      <div class="answer-row">
        <span class="answer-label">Student chose:</span>
        <span class="answer-value">{{ tfAnswer().studentChoice ? 'True' : 'False' }}</span>
      </div>
      <div class="answer-row">
        <span class="answer-label">Correct answer:</span>
        <span class="answer-value correct">{{
          tfQuestion().correctChoice ? 'True' : 'False'
        }}</span>
      </div>

      <div
        class="result-badge"
        [class.is-correct]="tfAnswer().isCorrect"
        [class.is-wrong]="!tfAnswer().isCorrect"
      >
        <i [class]="tfAnswer().isCorrect ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
        {{ tfAnswer().isCorrect ? '+' + question().marks + ' pts' : '0 pts' }}
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .auto-answer-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .answer-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .answer-label {
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      font-weight: 600;
      min-width: 8rem;

      @media (width < 480px) {
        min-width: 5rem;
      }
    }

    .answer-value {
      font-size: var(--fs-300);
      color: var(--clr-gray-800);
    }

    .answer-value.correct {
      background: var(--clr-emerald-50);
      border-color: var(--clr-emerald-200);
      color: var(--clr-green-500);
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--clr-emerald-200);
    }

    .result-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: var(--fs-300);
      font-weight: 700;
      margin-top: 0.5rem;
      width: fit-content;
    }

    .result-badge.is-correct {
      background: var(--clr-emerald-50);
      color: var(--clr-green-500);
    }

    .result-badge.is-wrong {
      background: var(--clr-red-50);
      color: var(--clr-red-600);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TfAnswerReview implements AnswerReviewContract {
  readonly question = input.required<Question>();
  readonly answer = input<QuestionAnswer | null>(null);

  protected readonly tfAnswer = computed<TfAnswer>(() => {
    const a = this.answer();
    if (a === null) {
      throw new Error('[TfAnswerReview] Answer input is required but was not provided.');
    }
    if (!isTfAnswer(a)) {
      throw new Error(`[TfAnswerReview] Expected TfAnswer, but received: ${a.answerType}`);
    }
    return a;
  });
  protected readonly tfQuestion = computed<Tf>(() => {
    const q = this.question();
    if (!isTf(q)) {
      throw new Error(`[TfAnswerReview] Expected True/False question, but received: ${q.type}`);
    }
    return q;
  });
}
