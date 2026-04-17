import {Component, inject, input, OnDestroy, OnInit} from '@angular/core';
import {type QuestionComponent} from '../../../shared/models/quiz/question-component.contracts';
import {Question} from '../../../shared/models/quiz/question.model';
import {QuestionTitle} from './question-title';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {CreateQuizStore} from './create-quiz.store';

type EssayQuestionFormGroup = FormGroup<{
  text: FormControl<string>;
}>;

@Component({
  selector: 'app-essay',
  imports: [QuestionTitle, ReactiveFormsModule],
  template: `
    <div class="essay-container">
      <form [formGroup]="essayQuestionForm" class="essay-question-form">
        <app-question-title [control]="textControl"></app-question-title>
      </form>
    </div>
  `,
  styles: ``,
})
export class Essay implements QuestionComponent, OnInit, OnDestroy {
  readonly question = input.required<Question>();
  private readonly createQuizStore = inject(CreateQuizStore);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly essayQuestionForm: EssayQuestionFormGroup = this.fb.group({
    text: ['', [Validators.required]],
  });

  protected get textControl() {
    return this.essayQuestionForm.controls.text;
  }

  ngOnInit() {
    this.textControl.setValue(this.question().questionText);

    this.createQuizStore.registerForm(this.essayQuestionForm);
  }

  ngOnDestroy() {
    this.createQuizStore.unregisterForm(this.essayQuestionForm);
  }
}
