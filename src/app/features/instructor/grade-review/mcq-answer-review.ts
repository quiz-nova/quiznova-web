import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Mcq } from '@shared/models/quiz/questions/mcq.model';
import { QuestionAnswer, McqAnswer, AutoGradedAnswer } from '@shared/models/quiz-attempt/question-answer.model';

@Component({
  selector: 'app-mcq-answer-review',
  imports: [],
  template: `
    <div class="auto-answer-section">
      <div class="answer-row">
        <span class="answer-label">Student chose:</span>
        <span class="answer-value choice">
          {{ studentChoiceText() }}
        </span>
      </div>

      <div class="answer-row">
        <span class="answer-label">Correct answer:</span>
        <span class="answer-value choice correct">
          {{ correctChoiceText() }}
        </span>
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

    .answer-value.choice {
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
      background: var(--clr-gray-50);
      border: 1px solid var(--clr-gray-200);
    }

    .answer-value.correct {
      background: var(--clr-emerald-50);
      border-color: var(--clr-emerald-200);
      color: var(--clr-green-500);
      font-weight: 600;
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
export class McqAnswerReview implements AnswerReviewContract {
  readonly question = input.required<Question>();
  readonly answer = input<QuestionAnswer | null>(null);
  protected readonly mcq = computed(() => this.question() as Mcq);
  protected readonly mcqAnswer = computed(() => this.answer() as McqAnswer);
  protected readonly autoAnswer = computed(() => this.answer() as AutoGradedAnswer);
  protected readonly isCorrect = computed(() => this.autoAnswer()?.isCorrect ?? false);


  protected readonly studentChoiceText = computed(() => {
    const ans = this.mcqAnswer();
    return this.getChoiceText(this.mcq(), ans.selectedChoiceId);
  });

  protected readonly correctChoiceText = computed(() => {
    return this.getChoiceText(this.mcq(), this.mcq().correctChoiceId);
  });

  private getChoiceText(question: Mcq, choiceId: string): string {
    return question.choices.find((c) => c.id === choiceId)?.text ?? choiceId;
  }
}
