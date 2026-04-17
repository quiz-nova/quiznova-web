import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-faild-quiz-tag',
  imports: [],
  template: `
    <span class="quiz-tag">{{ label() }}</span>
  `,
  styles: `
    .quiz-tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 1.75rem;
      padding: 0.2rem 0.75rem;
      border: 1px solid color-mix(in srgb, var(--clr-red-500) 35%, var(--clr-white));
      border-radius: 999px;
      background-color: color-mix(in srgb, var(--clr-red-100) 45%, var(--clr-white));
      color: var(--clr-red-500);
      font-size: var(--fs-300);
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaildQuizTag {
  readonly label = input<string>('Failed');
}
