import { Component, inject, input } from '@angular/core';
import { Question, type QuestionComponent } from '../../../shared/models/quiz/question.model';
import { QuestionTitle } from '../question-title/question-title';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-essay',
  imports: [QuestionTitle],
  template: `
    <div class="essay-container">
      <form>
        <app-question-title></app-question-title>
      </form>
    </div>
  `,
  styles: ``,
})
export class Essay implements QuestionComponent {
  question = input.required<Question>();

  fb = inject(FormBuilder);
  protected form = this.fb.nonNullable.group({
    text: ['', [Validators.required]],
  });
}
