import { Component, computed, inject, input } from '@angular/core';
import { Question, type QuestionComponent } from '../../../shared/models/quiz/question.model';
import { QuestionTitle } from '../question-title/question-title';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrueFalseQuestion } from '../../../shared/models/quiz/true-false.model';

@Component({
  selector: 'app-true-false',
  imports: [ReactiveFormsModule, QuestionTitle],
  template: `
    <div class="true-false-container">
      <form [formGroup]="form">
        <app-question-title [formGroup]="form"></app-question-title>
        <p>Correct Answer:</p>
        <div class="true-false-options">
          <label>
            <input type="radio" formControlName="answer" value="true" />
            True
          </label>
          <label>
            <input type="radio" formControlName="answer" value="false" />
            False
          </label>
        </div>
      </form>
    </div>
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .true-false-options {
      display: flex;
      gap: 1rem;
    }
    label {
      font-size: var(--fs-400);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `,
})
export class TrueFalse implements QuestionComponent {
  question = input.required<Question>();
  TrueFalseQuestion = computed(() => this.question() as TrueFalseQuestion);
  private fb = inject(FormBuilder);
  protected form = this.fb.nonNullable.group({
    text: ['', [Validators.required]],
    answer: ['', [Validators.required]],
  });
}
