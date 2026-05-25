import { Component, signal } from '@angular/core';

import { QuestionTagContract } from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';

@Component({
  selector: 'app-essay-tag',
  imports: [],
  template: ` <p class="essay-tag">Text Response</p> `,
  styles: `
    .essay-tag {
      width: fit-content;
      margin: 0;
      padding: 0.35rem 0.85rem;
      background-color: var(--clr-blue-500);
      border-radius: var(--radius-lg);
      color: var(--clr-white);
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--clr-blue-400);
      }
    }
  `,
})
export class EssayTag implements QuestionTagContract {
  readonly tag = signal(QuestionType.Essay).asReadonly();
}
