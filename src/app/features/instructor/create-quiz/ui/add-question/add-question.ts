import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { Button } from '@shared/components/button/button';
import { Question, QuestionType } from '@shared/models/quiz/question.model';

import { CreateQuizStore } from '../../stores/create-quiz.store';
import { mapQuestionTypeToQuestion } from '../../utils/question-type.mapper';

type AddQuestionFormGroup = FormGroup<{
  questionType: FormControl<QuestionType>;
}>;

@Component({
  selector: 'app-add-question',
  imports: [ReactiveFormsModule, SelectModule, ButtonModule, Button],
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
      <button
        [disabled]="!store.canAddMoreQuestions()"
        (click)="onAddQuestion()"
        appButton
        variant="green"
        type="button"
      >
        +Add Question
      </button>
    </div>
  `,
  styleUrl: './add-question.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddQuestion {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly store = inject(CreateQuizStore);

  readonly questionAdded = output<Question>();

  protected readonly questionTypeOptions: { label: string; value: QuestionType }[] = [
    { label: 'Multiple Choice', value: QuestionType.Mcq },
    { label: 'True/False', value: QuestionType.Tf },
    { label: 'Essay', value: QuestionType.Essay },
  ];

  protected readonly addQuestionForm: AddQuestionFormGroup = this.fb.group({
    questionType: this.fb.control<QuestionType>(QuestionType.Mcq),
  });

  protected get questionTypeControl() {
    return this.addQuestionForm.controls.questionType;
  }

  onAddQuestion(): void {
    const question = mapQuestionTypeToQuestion(this.questionTypeControl.value, {
      remainingMarks: this.store.effectiveRemainingMarks() ?? 0,
      displayOrder: this.store.numberOfQuestions(),
    });
    if (question) {
      this.questionAdded.emit(question);
    }
  }
}
