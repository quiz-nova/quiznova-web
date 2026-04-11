import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Question, type QuestionComponent } from '../../../shared/models/quiz/question.model';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MultipleChoiceQuestion } from '../../../shared/models/quiz/multiple-choice.model';
import { QuestionTitle } from './question-title';
import { DeleteButton } from '../../../shared/components/delete-button/delete-button';
import { CreateQuizStore } from './create-quiz.store';

type McqQuestionFormGroup = FormGroup<{
  questionText: FormControl<string>;
  choices: FormArray<FormControl<string>>;
  correctChoiceId: FormControl<string>;
}>;
@Component({
  selector: 'app-mcq',
  imports: [ReactiveFormsModule, QuestionTitle, DeleteButton],
  template: `
    <div class="mcq-question-container">
      <form [formGroup]="mcqQuestionForm" class="mcq-question-form">
        <app-question-title [formGroup]="mcqQuestionForm"></app-question-title>
        <div formArrayName="choices" class="radio-group">
          @for (choiceControl of choicesArray.controls; track $index) {
            @let choiceData = mcq().choices[$index];
            <div class="radio-item" animate.enter="element-enter" animate.leave="element-leave">
              <div class="radio-item-input">
                <input
                  type="radio"
                  [value]="choiceData.id"
                  [checked]="mcqQuestionForm.get('correctChoiceId')?.value === choiceData.id"
                  (change)="mcqQuestionForm.get('correctChoiceId')?.setValue(choiceData.id)"
                />
                <input
                  type="text"
                  [formControlName]="$index"
                  class="choice-input"
                  placeholder="Enter choice text..."
                />
              </div>

              @if (choicesArray.length > 2) {
                <app-delete-button ariaLabel="Delete choice" (deleted)="onDeleteChoice($index)" />
              }
            </div>
          }
        </div>
      </form>
      <button type="button" class="btn btn-gray" (click)="onAddChoice()">+Add Choice</button>
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
  private readonly createQuizStore = inject(CreateQuizStore);
  readonly question = input.required<Question>();
  protected readonly mcq = computed(() => this.question() as MultipleChoiceQuestion);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly mcqQuestionForm: McqQuestionFormGroup = this.fb.group({
    questionText: ['', [Validators.required]],
    choices: this.fb.array<FormControl<string>>([]),
    correctChoiceId: [''],
  });

  get choicesArray(): FormArray {
    return this.mcqQuestionForm.get('choices') as FormArray;
  }

  ngOnInit() {
    this.createQuizStore.registerForm(this.mcqQuestionForm);
    this.mcq().choices.forEach((choice) => {
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
    this.choicesArray.removeAt(index);
    const choiceId = this.mcq().choices[index].id;
    this.createQuizStore.deleteChoiceFromMcq(this.question().id, choiceId);
  }
}
