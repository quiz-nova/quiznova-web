import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { Question, QuestionType } from '../../../shared/models/quiz/question.model';
import { MultipleChoiceQuestion } from '../../../shared/models/quiz/multiple-choice.model';
import { TrueFalseQuestion } from '../../../shared/models/quiz/true-false.model';
import { EssayQuestion } from '../../../shared/models/quiz/essay.model';
import { CreateQuizStore } from './create-quiz.store';

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
      <button
        type="button"
        class="btn btn-green"
        (click)="addQuestion()"
      >
        +Add Question
      </button>
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
  protected readonly questionTypeControl = new FormControl<QuestionType>(
    QuestionType.MultipleChoice,
    {
      nonNullable: true,
    },
  );
  protected readonly questionTypeOptions: { label: string; value: QuestionType }[] = [
    { label: 'Multiple Choice', value: QuestionType.MultipleChoice },
    { label: 'True/False', value: QuestionType.TrueFalse },
    { label: 'Essay', value: QuestionType.Essay },
  ];
  private readonly createQuizStore = inject(CreateQuizStore);

  private getNewQuestion(questionType: QuestionType): Question {
    const questionId = crypto.randomUUID();

    switch (questionType) {
      case QuestionType.MultipleChoice:
        return {
          id: questionId,
          quizId: this.createQuizStore.quizId(),
          questionText: '',
          marks: 5,
          type: QuestionType.MultipleChoice,
          numberOfChoices: 2,
          correctChoiceId: '',
          choices: [
            {
              id: crypto.randomUUID(),
              questionId,
              text: '',
              displayOrder: 1,
            },
            {
              id: crypto.randomUUID(),
              questionId,
              text: '',
              displayOrder: 2,
            },
          ],
        } as MultipleChoiceQuestion;

      case QuestionType.TrueFalse:
        return {
          id: questionId,
          quizId: this.createQuizStore.quizId(),
          questionText: '',
          marks: 5,
          type: QuestionType.TrueFalse,
          correctChoice: true,
        } as TrueFalseQuestion;
      case QuestionType.Essay:
        return {
          id: questionId,
          quizId: this.createQuizStore.quizId(),
          questionText: '',
          marks: 5,
          type: QuestionType.Essay,
        } as EssayQuestion;
      default:
        throw new Error(`Unsupported question type: ${questionType}`);
    }
  }
  addQuestion(): void {
    this.createQuizStore.addQuestion(this.getNewQuestion(this.questionTypeControl.value));
  }
}
