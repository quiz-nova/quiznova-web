import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RadioButton } from 'primeng/radiobutton';
import { startWith } from 'rxjs';

import { FieldError } from '@shared/components/field-error/field-error';
import { type CreateQuestionContract } from '@shared/models/quiz/question-component.contracts';
import { Tf } from '@shared/models/quiz/tf.model';

import { CreateQuizStore } from './create-quiz.store';
import { QuestionTitle } from './question-title';

type TfFormGroup = FormGroup<{
  text: FormControl<string>;
  answer: FormControl<boolean | null>;
}>;

@Component({
  selector: 'app-create-tf',
  imports: [ReactiveFormsModule, QuestionTitle, RadioButton, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tf-container">
      <form [formGroup]="tfForm">
        <app-question-title [control]="questionTextControl"></app-question-title>
        <p>Correct Answer:</p>
        <div class="tf-options">
          <label class="answer-option" for="answerTrue">
            <p-radiobutton
              [formControl]="answerControl"
              [value]="true"
              inputId="answerTrue"
              name="answer"
            ></p-radiobutton>
            <span>True</span>
          </label>
          <label class="answer-option" for="answerFalse">
            <p-radiobutton
              [formControl]="answerControl"
              [value]="false"
              inputId="answerFalse"
              name="answer"
            ></p-radiobutton>
            <span>False</span>
          </label>
        </div>

        @if (answerControl.invalid && answerControl.touched) {
          @if (answerControl.hasError('required')) {
            <app-field-error errorText="Please select the correct answer." />
          }
        }
      </form>
    </div>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .tf-options {
        display: flex;
        gap: 1rem;
      }

      .answer-option {
        font-size: var(--fs-400);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }

    `,
  ],
})
export class CreateTf implements CreateQuestionContract, OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly createQuizStore = inject(CreateQuizStore);
  readonly index = input.required<number>();
  protected readonly question = computed(() => this.createQuizStore.getQuestionByIndex(this.index()));
  protected readonly tf = computed(() => this.question() as Tf);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly tfForm: TfFormGroup = this.fb.group({
    text: ['', [Validators.required]],
    answer: [null as boolean | null, [Validators.required]],
  });

  protected get questionTextControl() {
    return this.tfForm.controls.text;
  }

  protected get answerControl() {
    return this.tfForm.controls.answer;
  }

  ngOnInit() {
    this.tfForm.patchValue({
      text: this.tf().questionText,
      answer: this.tf().correctChoice,
    });

    this.questionTextControl.valueChanges
      .pipe(startWith(this.questionTextControl.getRawValue()), takeUntilDestroyed(this.destroyRef))
      .subscribe((questionText) => {
        this.createQuizStore.updateQuestionText(this.question().id, questionText);
      });

    this.createQuizStore.registerForm(this.tfForm);
  }

  ngOnDestroy() {
    this.createQuizStore.unregisterForm(this.tfForm);
  }
}
