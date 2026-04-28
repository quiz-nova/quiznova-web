import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { QuestionType } from '@shared/models/quiz/question.model';

import { CreateQuizStore } from './create-quiz.store';
import { mapQuestionTypeToQuestion } from './question-type.mapper';

type AddQuestionFormGroup = FormGroup<{
  questionType: FormControl<QuestionType>;
}>;

@Component({
  selector: 'app-add-question',
  imports: [ReactiveFormsModule, SelectModule, ButtonModule],
  template: `
    <div class="add-question">
      <div class="question-type-group">
        <label class="dropdown-label" for="questionType">Question Type</label>
        <p-select
          class="dropdown-field dropdown-field--wide"
          [formControl]="questionTypeControl"
          [options]="questionTypeOptions"
          inputId="questionType"
          optionLabel="label"
          optionValue="value"
          appendTo="body"
        />
      </div>
      <button class="btn btn-green" (click)="addQuestion()" type="button">+Add Question</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        pointer-events: auto;
      }

      .add-question {
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
      }

      .question-type-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      :host(.pill-style) .add-question {
        align-items: center;
        flex-wrap: nowrap;
        margin-top: 0;
        padding: 0.5rem;
        border: 1px solid var(--clr-gray-200);
        border-radius: 999px;
        background-color: var(--clr-white);
        box-shadow: 0 12px 32px rgb(15 23 42 / 16%);
      }

      :host(.pill-style) .question-type-group label {
        display: none;
      }

      :host(.pill-style) .dropdown-field {
        min-width: 12rem;
        border-radius: 100vh;
      }

      :host(.pill-style) .btn {
        min-height: 3rem;
        border-radius: 999px;
        padding-inline: 1.25rem;
      }
    `,
  ],
})
export class AddQuestion {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly questionTypeOptions: { label: string; value: QuestionType }[] = [
    { label: 'Multiple Choice', value: QuestionType.Mcq },
    { label: 'True/False', value: QuestionType.Tf },
  ];
  private readonly createQuizStore = inject(CreateQuizStore);
  protected readonly addQuestionForm: AddQuestionFormGroup = this.fb.group({
    questionType: this.fb.control<QuestionType>(QuestionType.Mcq),
  });

  protected get questionTypeControl() {
    return this.addQuestionForm.controls.questionType;
  }

  addQuestion(): void {
    this.createQuizStore.addQuestion(
      mapQuestionTypeToQuestion(this.questionTypeControl.value, {
        quizId: this.createQuizStore.quizId(),
      }),
    );
  }
}
