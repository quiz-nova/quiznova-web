import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { QuestionType } from '../../../shared/models/quiz/question.model';
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
          inputId="questionType"
          class="dropdown-field dropdown-field--wide"
          [formControl]="questionTypeControl"
          [options]="questionTypeOptions"
          optionLabel="label"
          optionValue="value"
          appendTo="body"
        />
      </div>
      <button type="button" class="btn btn-green" (click)="addQuestion()">+Add Question</button>
    </div>
  `,
  styles: [
    `
      .add-question {
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;

        .question-type-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class AddQuestion {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly questionTypeOptions: { label: string; value: QuestionType }[] = [
    { label: 'Multiple Choice', value: QuestionType.MultipleChoice },
    { label: 'True/False', value: QuestionType.TrueFalse },
    { label: 'Essay', value: QuestionType.Essay },
  ];
  private readonly createQuizStore = inject(CreateQuizStore);
  protected readonly addQuestionForm: AddQuestionFormGroup = this.fb.group({
    questionType: this.fb.control<QuestionType>(QuestionType.MultipleChoice),
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
