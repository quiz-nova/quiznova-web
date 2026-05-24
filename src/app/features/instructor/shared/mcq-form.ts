import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  OnDestroy,
  OnInit,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RadioButton } from 'primeng/radiobutton';

import { DeleteButton } from '@shared/components/delete-button/delete-button';
import { FieldError } from '@shared/components/field-error/field-error';
import { Button } from '@shared/components/button/button';
import { QuestionFormContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Choice, Mcq } from '@shared/models/quiz/questions/mcq.model';
import { CustomValidators } from '@shared/validators/custom-validators';

import { QuestionTitle } from './question-title';

type McqFormGroup = FormGroup<{
  questionText: FormControl<string>;
  choices: FormArray<FormControl<string>>;
  correctChoiceId: FormControl<string | null>;
}>;

@Component({
  selector: 'app-mcq-form',
  imports: [ReactiveFormsModule, QuestionTitle, DeleteButton, FieldError, RadioButton, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mcq-question-container">
      <form class="mcq-question-form" [formGroup]="mcqForm">
        <app-question-title
          [control]="questionTextControl"
          (titleBlur)="onTitleBlur($event)"
        ></app-question-title>
        <fieldset class="radio-group" formArrayName="choices">
          <legend class="sr-only">Multiple Choice Options</legend>
          @for (
            choiceControl of choicesArray.controls;
            track getChoiceId($index);
            let index = $index
          ) {
            <div class="radio-item" animate.enter="element-enter" animate.leave="element-leave">
              <div class="radio-item-input">
                <p-radiobutton
                  [inputId]="'choice-' + getChoiceId(index)"
                  [formControl]="correctChoiceControl"
                  [value]="getChoiceId(index)"
                  [attr.aria-invalid]="
                    correctChoiceControl.invalid && correctChoiceControl.touched ? 'true' : null
                  "
                  (onClick)="onBlur()"
                  name="correctChoiceGroup"
                  aria-label="Mark this choice as the correct answer"
                  aria-describedby="please-select-the-correct-answer-error"
                ></p-radiobutton>
                <input
                  class="choice-input"
                  [id]="'choice-' + getChoiceId(index) + 'text'"
                  [formControlName]="index"
                  [attr.aria-invalid]="
                    choiceControl.invalid && choiceControl.touched ? 'true' : null
                  "
                  [attr.aria-label]="'Text for choice ' + (index + 1)"
                  (blur)="onBlur()"
                  type="text"
                  placeholder="Enter choice text..."
                  aria-describedby="choice-text-is-required-error choice-text-minlength-error choice-text-maxlength-error"
                />
              </div>

              @if (choicesArray.length > 2) {
                <app-delete-button
                  (deleteButtonClicked)="onDeleteChoice(index)"
                  ariaLabel="Delete choice"
                />
              }
            </div>

            @if (choiceControl.invalid && choiceControl.touched) {
              @if (choiceControl.hasError('required')) {
                <app-field-error id="choice-text-is-required-error"
                  >Choice text is required.</app-field-error
                >
              }
              @if (choiceControl.hasError('minlength')) {
                <app-field-error id="choice-text-minlength-error"
                  >Choice text must be at least 3 characters.</app-field-error
                >
              }
              @if (choiceControl.hasError('maxlength')) {
                <app-field-error id="choice-text-maxlength-error"
                  >Choice text cannot exceed 100 characters.</app-field-error
                >
              }
            }
          }
        </fieldset>

        @if (correctChoiceControl.invalid && correctChoiceControl.touched) {
          @if (correctChoiceControl.hasError('required')) {
            <app-field-error id="please-select-the-correct-answer-error"
              >Please select the correct answer.</app-field-error
            >
          }
        }
      </form>
      @if (choicesArray.length < 5) {
        <button appButton variant="gray" (click)="onAddChoice()" type="button">+Add Choice</button>
      }
    </div>
  `,
  styles: `
    .mcq-question-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mcq-question-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .radio-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .radio-item-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;

      input.choice-input {
        padding: 0.5rem;
        max-width: 100%;
        border: 1px solid var(--clr-gray-500);
        border-radius: var(--radius-md);
        background-color: var(--clr-white);
        flex: 1;

        &:focus {
          outline: none;
          border: 3px solid var(--clr-green-500);
        }
      }

      span {
        padding: 0.25rem;
      }
    }
  `,
})
export class McqForm implements QuestionFormContract, OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly initialData = input.required<Question>();

  readonly formReady = output<FormGroup>();
  readonly formDestroyed = output<FormGroup>();
  readonly valueChange = output<Question>();
  readonly blurEvent = output<Question>();
  readonly questionTextBlur = output<{ questionId: string; text: string }>();

  protected readonly mcq = () => this.initialData() as Mcq;
  private choiceIds: string[] = [];

  protected readonly mcqForm: McqFormGroup = this.fb.group({
    questionText: [
      '',
      [Validators.required, CustomValidators.trimMinLength(3), CustomValidators.trimMaxLength(500)],
    ],
    choices: this.fb.array<FormControl<string>>([]),
    correctChoiceId: [null as string | null, [Validators.required]],
  });

  constructor() {
    effect(() => {
      this.populateForm(this.mcq());
    });
  }

  protected get questionTextControl() {
    return this.mcqForm.controls.questionText;
  }

  protected get correctChoiceControl() {
    return this.mcqForm.controls.correctChoiceId;
  }

  get choicesArray(): FormArray<FormControl<string>> {
    return this.mcqForm.controls.choices;
  }

  ngOnInit() {
    this.mcqForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.valueChange.emit(this.getLatestMcqData());
    });

    this.formReady.emit(this.mcqForm);
  }

  ngOnDestroy(): void {
    this.formDestroyed.emit(this.mcqForm);
  }

  private populateForm(mcq: Mcq) {
    // Check if the form is already in sync with the incoming MCQ data.
    // If it is, do not clear and recreate, which completely prevents the infinite keystroke loop!
    const currentQuestionText = this.mcqForm.controls.questionText.value;
    const currentCorrectChoiceId = this.mcqForm.controls.correctChoiceId.value;
    const currentChoices = this.choicesArray.controls.map((c) => c.value);
    const incomingChoices = mcq.choices.map((c) => c.text);

    const choicesMatch = currentChoices.every((val, i) => val === incomingChoices[i]);

    const idsMatch = this.choiceIds.every((id, i) => id === mcq.choices[i].id);

    if (
      currentQuestionText === mcq.questionText &&
      currentCorrectChoiceId === mcq.correctChoiceId &&
      choicesMatch &&
      idsMatch
    ) {
      return;
    }

    this.mcqForm.patchValue(
      {
        questionText: mcq.questionText,
        correctChoiceId: mcq.correctChoiceId,
      },
      { emitEvent: false },
    );

    this.choicesArray.clear({ emitEvent: false });
    this.choiceIds = [];

    mcq.choices.forEach((choice: Choice) => {
      this.choiceIds.push(choice.id);
      this.choicesArray.push(
        this.fb.control(choice.text, [
          Validators.required,
          CustomValidators.trimMinLength(3),
          CustomValidators.trimMaxLength(100),
        ]),
        {
          emitEvent: false,
        }
      );
    });
  }

  protected getChoiceId(index: number): string {
    return this.choiceIds[index];
  }

  protected onAddChoice() {
    const newId = crypto.randomUUID();
    this.choiceIds.push(newId);
    this.choicesArray.push(
      this.fb.control('', [
        Validators.required,
        CustomValidators.trimMinLength(3),
        CustomValidators.trimMaxLength(100),
      ])
    );
    this.onBlur();
  }

  protected onDeleteChoice(index: number) {
    const choiceId = this.choiceIds[index];
    const currentCorrectId = this.correctChoiceControl.value;

    this.choiceIds.splice(index, 1);
    this.choicesArray.removeAt(index);

    if (choiceId === currentCorrectId) {
      this.correctChoiceControl.setValue(null);
    }
    this.onBlur();
  }

  protected onTitleBlur(text: string) {
    this.questionTextBlur.emit({ questionId: this.initialData().id, text });
    this.onBlur();
  }

  protected onBlur() {
    if (this.mcqForm.valid) {
      this.blurEvent.emit(this.getLatestMcqData());
    }
  }

  private getLatestMcqData(): Mcq {
    const formValue = this.mcqForm.getRawValue();
    const originalMcq = this.mcq();

    return {
      ...originalMcq,
      questionText: formValue.questionText,
      correctChoiceId: formValue.correctChoiceId ?? '',
      numberOfChoices: this.choicesArray.length,
      choices: formValue.choices.map((text, index) => ({
        id: this.choiceIds[index],
        questionId: originalMcq.id,
        text: text,
        displayOrder: index + 1,
      })),
    };
  }
}
