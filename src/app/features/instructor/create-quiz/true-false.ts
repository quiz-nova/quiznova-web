import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Question, type QuestionComponent } from '../../../shared/models/quiz/question.model';
import { QuestionTitle } from './question-title';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TrueFalseQuestion } from '../../../shared/models/quiz/true-false.model';
import { CreateQuizStore } from './create-quiz.store';

type TrueFalseQuestionFormGroup = FormGroup<{
  text: FormControl<string>;
  answer: FormControl<string>;
}>;
@Component({
  selector: 'app-true-false',
  imports: [ReactiveFormsModule, QuestionTitle],
  template: `
    <div class="true-false-container">
      <form [formGroup]="trueFalseQuestionForm">
        <app-question-title [formGroup]="trueFalseQuestionForm"></app-question-title>
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
export class TrueFalse implements QuestionComponent, OnInit, OnDestroy {
  readonly question = input.required<Question>();
  private readonly createQuizStore = inject(CreateQuizStore);
  protected readonly TrueFalseQuestion = computed(() => this.question() as TrueFalseQuestion);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly trueFalseQuestionForm: TrueFalseQuestionFormGroup = this.fb.group({
    text: ['', [Validators.required]],
    answer: ['', [Validators.required]],
  });
  ngOnInit() {
    this.createQuizStore.registerForm(this.trueFalseQuestionForm);
  }
  ngOnDestroy() {
    this.createQuizStore.unregisterForm(this.trueFalseQuestionForm);
  }
}
