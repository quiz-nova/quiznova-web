import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Tf } from '@shared/models/quiz/questions/tf.model';
import { QuestionAnswer, TfAnswer, AutoGradedAnswer } from '@shared/models/quiz-attempt/question-answer.model';

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
        <span class="answer-value correct">{{ tfQuestion().correctChoice ? 'True' : 'False' }}</span>
      </div>

      <div class="result-badge" [class.is-correct]="isCorrect()" [class.is-wrong]="!isCorrect()">
        <i [class]="isCorrect() ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
        {{ isCorrect() ? '+' + question().marks + ' pts' : '0 pts' }}
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
    }

    .answer-value {
      font-size: var(--fs-300);
      color: var(--clr-gray-800);
    }

    .answer-value.correct {
      background: var(--clr-review-success-50);
      border-color: var(--clr-review-success-200);
      color: var(--clr-review-success-500);
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--clr-review-success-200);
    }

    .result-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      font-size: var(--fs-300);
      font-weight: 700;
      margin-top: 0.5rem;
      width: fit-content;
    }

    .result-badge.is-correct {
      background: var(--clr-review-success-50);
      color: var(--clr-review-success-500);
    }

    .result-badge.is-wrong {
      background: var(--clr-review-danger-50);
      color: var(--clr-review-danger-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TfAnswerReview implements AnswerReviewContract {
  readonly question = input.required<Question>();
  readonly answer = input<QuestionAnswer | null>(null);

  protected readonly tfAnswer = computed(() => this.answer() as TfAnswer);
  protected readonly tfQuestion = computed(() => this.question() as Tf);
  protected readonly autoAnswer = computed(() => this.answer() as AutoGradedAnswer);
  protected readonly isCorrect = computed(() => this.autoAnswer()?.isCorrect ?? false);
}
