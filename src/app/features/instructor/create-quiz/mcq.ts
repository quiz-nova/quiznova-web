import {Component, computed, inject, input, OnDestroy, OnInit} from '@angular/core';
import {type QuestionComponent} from '../../../shared/models/quiz/question-component.contracts';
import {Question} from '../../../shared/models/quiz/question.model';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Choice, MCQ} from '../../../shared/models/quiz/mcq.model';
import {QuestionTitle} from './question-title';
import {DeleteButton} from '../../../shared/components/delete-button/delete-button';
import {CreateQuizStore} from './create-quiz.store';

type McqQuestionFormGroup = FormGroup<{
  questionText: FormControl<string>;
  choices: FormArray<FormControl<string>>;
  correctChoiceId: FormControl<string | null>;
}>;

@Component({
  selector: 'app-mcq',
  imports: [ReactiveFormsModule, QuestionTitle, DeleteButton],
  template: `
    <div class="mcq-question-container">
      <form [formGroup]="mcqQuestionForm" class="mcq-question-form">
        <app-question-title [control]="questionTextControl"></app-question-title>
        <div formArrayName="choices" class="radio-group">
          @for (choiceData of mcq().choices; track choiceData.id; let index = $index) {
            <div class="radio-item" animate.enter="element-enter" animate.leave="element-leave">
              <div class="radio-item-input">
                <input
                  type="radio"
                  name="correctChoiceGroup"
                  [formControl]="correctChoiceControl"
                  [value]="choiceData.id"
                  [checked]="correctChoiceControl.value === choiceData.id"
                  (change)="correctChoiceControl.setValue(choiceData.id)"
                />
                <input
                  type="text"
                  [formControlName]="index"
                  class="choice-input"
                  placeholder="Enter choice text..."
                />
              </div>

              @if (choicesArray.length > 2) {
                <app-delete-button ariaLabel="Delete choice" (deleted)="onDeleteChoice(index)" />
              }
            </div>
          }
        </div>
      </form>
      @if (choicesArray.length < 5) {
        <button type="button" class="btn btn-gray" (click)="onAddChoice()">+Add Choice</button>
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
export class Mcq implements QuestionComponent, OnInit, OnDestroy {
  readonly question = input.required<Question>();
  protected readonly mcq = computed(() => this.question() as MCQ);
  private readonly createQuizStore = inject(CreateQuizStore);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly mcqQuestionForm: McqQuestionFormGroup = this.fb.group({
    questionText: ['', [Validators.required]],
    choices: this.fb.array<FormControl<string>>([]),
    correctChoiceId: [null as string | null],
  });

  protected get questionTextControl() {
    return this.mcqQuestionForm.controls.questionText;
  }

  protected get correctChoiceControl() {
    return this.mcqQuestionForm.controls.correctChoiceId;
  }

  get choicesArray(): FormArray<FormControl<string>> {
    return this.mcqQuestionForm.controls.choices;
  }

  ngOnInit() {
    this.questionTextControl.setValue(this.mcq().questionText);

    this.createQuizStore.registerForm(this.mcqQuestionForm);
    this.mcq().choices.forEach((choice: Choice) => {
      this.choicesArray.push(this.fb.control(choice.text, Validators.required));
    });
  }

  ngOnDestroy(): void {
    this.createQuizStore.unregisterForm(this.mcqQuestionForm);
  }

  protected onAddChoice() {
    this.choicesArray.push(this.fb.control('', Validators.required));
    this.createQuizStore.addChoiceToMcq(this.question().id);
  }

  protected onDeleteChoice(index: number) {
    const choiceToDelete = this.mcq().choices[index];
    if (!choiceToDelete) return;
    const choiceId = choiceToDelete.id;
    const currentCorrectId = this.mcqQuestionForm.controls.correctChoiceId.value;
    this.choicesArray.removeAt(index);
    if (choiceId === currentCorrectId) {
      this.mcqQuestionForm.controls.correctChoiceId.setValue(null);
    }
    this.createQuizStore.deleteChoiceFromMcq(this.question().id, choiceId);
  }
}
