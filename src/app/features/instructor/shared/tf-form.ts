import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  OnDestroy,
  OnInit,
  effect
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

import { FieldError } from '@shared/components/field-error/field-error';
import { QuestionFormContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Tf } from '@shared/models/quiz/questions/tf.model';

import { QuestionTitle } from './question-title';

type TfFormGroup = FormGroup<{
  text: FormControl<string>;
  answer: FormControl<boolean | null>;
}>;

@Component({
  selector: 'app-tf-form',
  imports: [ReactiveFormsModule, QuestionTitle, RadioButton, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tf-container">
      <form [formGroup]="tfForm">
        <app-question-title 
          [control]="questionTextControl"
          (titleBlur)="onTitleBlur($event)"
        ></app-question-title>
        <p>Correct Answer:</p>
        <fieldset class="tf-options">
          <legend class="sr-only">Correct Answer</legend>
          <label class="answer-option" for="answerTrue">
            <p-radiobutton
              [formControl]="answerControl"
              [value]="true"
              inputId="answerTrue"
              name="answer"
              (onClick)="onBlur()"
              [attr.aria-invalid]="answerControl.invalid && answerControl.touched ? 'true' : null"
              aria-describedby="please-select-the-correct-answer-error"
            ></p-radiobutton>
            <span>True</span>
          </label>
          <label class="answer-option" for="answerFalse">
            <p-radiobutton
              [formControl]="answerControl"
              [value]="false"
              inputId="answerFalse"
              name="answer"
              (onClick)="onBlur()"
              [attr.aria-invalid]="answerControl.invalid && answerControl.touched ? 'true' : null"
              aria-describedby="please-select-the-correct-answer-error"
            ></p-radiobutton>
            <span>False</span>
          </label>
        </fieldset>

        @if (answerControl.invalid && answerControl.touched) {
          @if (answerControl.hasError('required')) {
            <app-field-error id="please-select-the-correct-answer-error">Please select the correct answer.</app-field-error>
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
export class TfForm implements QuestionFormContract, OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly initialData = input.required<Question>();

  readonly formReady = output<FormGroup>();
  readonly formDestroyed = output<FormGroup>();
  readonly valueChange = output<Question>();
  readonly blurEvent = output<Question>();
  readonly questionTextBlur = output<{ questionId: string; text: string }>();

  protected readonly tf = () => this.initialData() as Tf;

  protected readonly tfForm: TfFormGroup = this.fb.group({
    text: ['', [Validators.required]],
    answer: [null as boolean | null, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const data = this.tf();
      this.tfForm.patchValue({
        text: data.questionText,
        answer: data.correctChoice
      }, { emitEvent: false });
    });
  }

  protected get questionTextControl() {
    return this.tfForm.controls.text;
  }

  protected get answerControl() {
    return this.tfForm.controls.answer;
  }

  ngOnInit() {
    this.tfForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.valueChange.emit(this.getLatestTfData());
      });

    this.formReady.emit(this.tfForm);
  }

  ngOnDestroy() {
    this.formDestroyed.emit(this.tfForm);
  }

  protected onTitleBlur(text: string) {
    this.questionTextBlur.emit({ questionId: this.initialData().id, text });
    this.onBlur();
  }

  protected onBlur() {
    if (this.tfForm.valid) {
      this.blurEvent.emit(this.getLatestTfData());
    }
  }

  private getLatestTfData(): Tf {
    const formValue = this.tfForm.getRawValue();
    const originalTf = this.tf();

    return {
      ...originalTf,
      questionText: formValue.text,
      correctChoice: formValue.answer ?? true
    };
  }
}
