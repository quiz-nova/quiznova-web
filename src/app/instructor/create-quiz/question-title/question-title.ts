import { Component } from '@angular/core';

@Component({
  selector: 'app-question-title',
  imports: [],
  template: `
    <div class="question-title">
      <label for="questionText">Question Text</label>
      <textarea
        id="questionText"
        formControlName="text"
        class="question-title__input"
        placeholder="Enter question text..."
      ></textarea>
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
export class QuestionTitle {}
