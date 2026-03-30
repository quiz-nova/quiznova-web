import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Question, QuestionType } from '../../../shared/models/quiz/question.model';
import { CreateQuizService } from '../../../shared/services/quiz.service';
import { MultipleChoiceQuestion } from '../../../shared/models/quiz/multiple-choice.model';
import { TrueFalseQuestion } from '../../../shared/models/quiz/true-false.model';
import { EssayQuestion } from '../../../shared/models/quiz/essay.model';

@Component({
  selector: 'app-add-question',
  imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="add-question">
      <mat-form-field class="question-type-field" appearance="outline">
        <mat-label>Question Type</mat-label>
        <mat-select [formControl]="questionTypeControl" panelClass="element-type-panel" required>
          <mat-option value="multiple-choice">Multiple Choice</mat-option>
          <mat-option value="true-false">True/False</mat-option>
          <mat-option value="essay">Essay</mat-option>
        </mat-select>
      </mat-form-field>
      <button type="button" class="btn btn-green" (click)="addQuestion()">+Add Question</button>
    </div>
  `,
  styles: [
    `
      .add-question {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;

        .question-type-field {
          min-width: 18rem;

          &.mat-mdc-form-field {
            --mat-sys-primary: var(--clr-green-500);
          }
        }
      }
    `,
  ],
})
export class AddQuestion {
  questionTypeControl = new FormControl<QuestionType>(QuestionType.MultipleChoice, {
    nonNullable: true,
  });
  readonly quizService = inject(CreateQuizService);

  getNewQuestion(questionType: QuestionType): Question {
    const questionId = crypto.randomUUID();

    switch (questionType) {
      case QuestionType.MultipleChoice:
        return {
          id: questionId,
          quizId: this.quizService.quiz().id,
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
            },
            {
              id: crypto.randomUUID(),
              questionId,
              text: '',
            },
          ],
        } as MultipleChoiceQuestion;

      case QuestionType.TrueFalse:
        return {
          id: questionId,
          quizId: this.quizService.quiz().id,
          questionText: '',
          marks: 5,
          type: QuestionType.TrueFalse,
          correctChoice: true,
        } as TrueFalseQuestion;
      case QuestionType.Essay:
        return {
          id: questionId,
          quizId: this.quizService.quiz().id,
          questionText: '',
          marks: 5,
          type: QuestionType.Essay,
        } as EssayQuestion;
      default:
        throw new Error(`Unsupported question type: ${questionType}`);
    }
  }
  addQuestion(): void {
    this.quizService.addQuestion(this.getNewQuestion(this.questionTypeControl.value));
  }
}
