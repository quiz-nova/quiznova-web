import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-title',
  imports: [ReactiveFormsModule],
  template: `
    <div class="question-title">
      <label for="questionText">Question Text</label>
      <textarea
        id="questionText"
        [formControl]="control()"
        class="question-title__input"
        placeholder="Enter question text..."
      ></textarea>

      <div class="question-title__error">
        @if (control().invalid && control().touched) {
          @if (control().hasError('required')) {
            <span>Question text is required.</span>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .question-title {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .question-title__input {
      width: 100%;
      font-size: var(--fs-500);
      padding: 0.5rem;
      border: 1px solid var(--clr-gray-500);
      border-radius: var(--radius-md);
      resize: vertical;
      &:focus {
        outline: none;
        border: 3px solid var(--clr-green-500);
      }
    }

    .question-title__error {
      min-height: 1rem;
      color: var(--clr-red-500);
      font-size: var(--fs-300);
    }
  `,
})
export class QuestionTitle {
  readonly control = input.required<FormControl<string>>();
}
