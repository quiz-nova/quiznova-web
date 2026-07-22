import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StudentAnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Essay, isEssay } from '@shared/models/quiz/questions/essay.model';
import {
  EssayAnswer,
  isEssayAnswer,
  QuestionAnswer,
} from '@shared/models/quiz-attempt/question-answer.model';

@Component({
  selector: 'app-student-essay-answer-review',
  imports: [],
  template: `
    <article
      class="review-question"
      [class.review-question--graded]="isGraded()"
      [class.review-question--pending]="!isGraded()"
      aria-label="Reviewed essay question"
    >
      <header class="review-question__header">
        <div class="review-question__meta">
          <span class="review-question__index">Q{{ questionNumber() }}</span>
          <span class="review-question__type">Essay</span>
        </div>

        @if (isGraded()) {
          <span
            class="review-question__marks"
            [class.review-question__marks--success]="score() > 0"
          >
            +{{ score() }}/{{ essay().marks }} pt
          </span>
        } @else {
          <span class="review-question__marks review-question__marks--pending">
            Pending Grade
          </span>
        }
      </header>

      <p class="review-question__text">{{ essay().questionText }}</p>

      <div class="review-question__answers">
        <!-- Student's Response -->
        <div class="review-answer review-answer--student">
          <p class="review-answer__label"><i class="fa-solid fa-pen-nib"></i> Your response</p>
          <blockquote class="review-answer__value">
            {{ essayAnswer().studentResponse || 'No response provided.' }}
          </blockquote>
        </div>

        <!-- Reference Answer -->
        @if (essay().answerReference) {
          <div class="review-answer review-answer--reference">
            <p class="review-answer__label">
              <i class="fa-solid fa-lightbulb"></i> Reference answer
            </p>
            <p class="review-answer__value">{{ essay().answerReference }}</p>
          </div>
        }

        <!-- Instructor Feedback -->
        @if (essayAnswer().feedback) {
          <div class="review-answer review-answer--feedback">
            <p class="review-answer__label">
              <i class="fa-solid fa-comment-dots"></i> Teacher's feedback
            </p>
            <blockquote class="review-answer__value review-answer__value--feedback">
              {{ essayAnswer().feedback }}
            </blockquote>
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
      border-radius: var(--radius-md);
      background: var(--clr-white);
      transition:
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }

    .review-question:hover {
      box-shadow: 0 4px 12px rgb(15 23 42 / 4%);
    }

    .review-question--graded {
      border-color: var(--clr-gray-300);
      border-left: 4px solid var(--clr-green-500); /* impeccable-disable-line side-tab */
    }

    .review-question--pending {
      border-color: var(--clr-amber-200);
      border-left: 4px solid var(--clr-amber-600); /* impeccable-disable-line side-tab */
      background: var(--clr-amber-100);
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
      border-radius: var(--radius-sm);
      padding: 0.18rem 0.48rem;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-300);
      color: var(--clr-gray-600);
      font-weight: 700;
    }

    .review-question__marks {
      font-size: 0.8rem;
      border-radius: var(--radius-sm);
      padding: 0.18rem 0.48rem;
      background: var(--clr-blue-400);
      color: var(--clr-white);
      font-weight: 700;
    }

    .review-question__marks--success {
      background: var(--clr-green-400);
    }

    .review-question__marks--pending {
      background: var(--clr-amber-600);
      color: var(--clr-white);
    }

    .review-question__text {
      margin: 0;
      color: var(--clr-blue-900);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .review-question__answers {
      display: grid;
      gap: 0.6rem;
    }

    .review-answer {
      border-radius: 0.6rem;
      border: 1px solid var(--clr-gray-300);
      background: var(--clr-white);
      padding: 0.6rem;
    }

    .review-answer--student {
      background: var(--clr-gray-50);
      border-color: var(--clr-gray-200);
    }

    .review-answer--reference {
      border-color: var(--clr-green-100);
      background: var(--clr-green-50);
    }

    .review-answer--reference .review-answer__label {
      color: var(--clr-green-400);
    }

    .review-answer--feedback {
      border-color: var(--clr-blue-400);
      background: var(--clr-blue-400);
      color: var(--clr-white);
    }

    .review-answer--feedback .review-answer__label {
      color: var(--clr-green-300);
    }

    .review-answer--feedback .review-answer__value {
      color: var(--clr-white);
    }

    .review-answer__label {
      margin: 0 0 0.3rem 0;
      color: var(--clr-gray-600);
      font-size: 0.72rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .review-answer__value {
      margin: 0;
      color: var(--clr-blue-900);
      font-size: 0.88rem;
      font-weight: 600;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .review-answer__value--feedback {
      font-style: italic;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentEssayAnswerReview implements StudentAnswerReviewContract {
  readonly question = input.required<Question>();
  readonly answer = input.required<QuestionAnswer>();
  readonly questionNumber = input.required<number>();

  protected readonly essay = computed<Essay>(() => {
    const q = this.question();
    if (!isEssay(q)) {
      throw new Error(
        `[StudentEssayAnswerReview] Expected Essay question, but received: ${q.type}`,
      );
    }
    return q;
  });
  protected readonly essayAnswer = computed<EssayAnswer>(() => {
    const a = this.answer();
    if (!isEssayAnswer(a)) {
      throw new Error(
        `[StudentEssayAnswerReview] Expected EssayAnswer, but received: ${a.answerType}`,
      );
    }
    return a;
  });

  protected readonly isGraded = computed(
    () => this.essayAnswer().score !== null && this.essayAnswer().score !== undefined,
  );
  protected readonly score = computed(() => this.essayAnswer().score ?? 0);
}
