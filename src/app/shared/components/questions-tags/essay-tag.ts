import { Component, signal } from '@angular/core';
import { QuestionTagComponent } from '../../models/quiz/question-component.contracts';
import { QuestionType } from '../../models/quiz/question.model';

@Component({
  selector: 'app-essay-tag',
  imports: [],
  template: ` <p class="question-tag">Essay</p> `,
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
export class EssayTag implements QuestionTagComponent {
  readonly tag = signal(QuestionType.Essay).asReadonly();
}
