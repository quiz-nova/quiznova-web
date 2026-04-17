import { Component, signal } from '@angular/core';
import { QuestionTagComponent } from '../../models/quiz/question-component.contracts';
import { QuestionType } from '../../models/quiz/question.model';

@Component({
  selector: 'app-mcq-tag',
  imports: [],
  template: ` <p class="mcq-tag">{{ tag() }}</p> `,
  styles: `
    .mcq-tag {
      width: fit-content;
      margin: 0;
      padding: 0.35rem 0.85rem;
      background-color: var(--clr-green-500);
      border-radius: var(--radius-lg);
      color: var(--clr-white);
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--clr-green-200);
      }
    }
  `,
})
export class McqTag implements QuestionTagComponent {
  readonly tag = signal(QuestionType.MultipleChoice).asReadonly();
}
