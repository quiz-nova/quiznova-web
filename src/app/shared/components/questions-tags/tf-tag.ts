import { Component, signal } from '@angular/core';

import { QuestionTagContract } from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';

@Component({
  selector: 'app-tf-tag',
  imports: [],
  template: ` <p class="question-tag">{{ tag() }}</p> `,
  styles: `
    .question-tag {
      width: fit-content;
      margin: 0;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--clr-gray-300);
      background-color: var(--clr-gray-200);
      color: var(--clr-blue-900);
      font-size: 0.9rem;
      font-weight: 700;
      line-height: 1;
    }
  `,
})
export class TfTag implements QuestionTagContract {
  readonly tag = signal(QuestionType.Tf).asReadonly();
}
