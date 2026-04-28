import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {FieldError} from '@shared/components/field-error/field-error';

@Component({
  selector: 'app-question-title',
  imports: [ReactiveFormsModule, FieldError],
  template: `
    <div class="question-title">
      <label for="questionText">Question Text</label>
      <textarea
        class="question-title__input"
        id="questionText"
        [formControl]="control()"
        placeholder="Enter question text..."
      ></textarea>

      @if (control().invalid && control().touched) {
        @if (control().hasError('required')) {
          <app-field-error errorText="Question text is required."/>
        }
      }
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
  `,
})
export class QuestionTitle {

  readonly control = input.required<FormControl<string>>();
}
