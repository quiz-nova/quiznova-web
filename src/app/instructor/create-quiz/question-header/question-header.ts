import { Component, inject, input, OnInit } from '@angular/core';
import { Question, QuestionType } from '../../../shared/models/quiz/question.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateQuizService } from '../../../shared/services/quiz.service';

@Component({
  selector: 'app-question-header',
  imports: [ReactiveFormsModule],
  template: `
    <header class="question-header">
      <div class="question-header__details">
        <h3>Q{{ index() + 1 }}</h3>
        <span class="question-type">{{ tag() }}</span>
      </div>

      <div class="question-header__actions">
        <form [formGroup]="form">
          <label for="marks">Marks</label>
          <input
            type="number"
            id="marks"
            class="question-header__marks focus-green-ring"
            formControlName="marks"
          />
        </form>
        <button type="button" class="delete-button" (click)="onDelete()">
          <span>
            <i class="fa-solid fa-trash-can"></i>
          </span>
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      header {
        padding: 2rem;
      }
      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        height: 3rem;
      }

      .question-header__details {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 100%;
      }
      h3 {
        font-size: var(--fs-600);
      }
      .question-type {
        background-color: var(--clr-green-500);
        border-radius: var(--radius-md);
        color: white;
        padding: 0.4rem;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: var(--clr-green-200);
        }
      }
      .question-header__actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      form {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      input[type='number'] {
        width: 4rem;
        padding: 0.25rem;
        border: 1px solid var(--clr-gray-500);
        border-radius: var(--radius-sm);
      }

      label {
        color: var(--clr-gray-600);
      }
    `,
  ],
})
export class QuestionHeader implements OnInit {
  index = input.required<number>();
  tag = input.required<QuestionType>();
  question = input.required<Question>();
  quizService = inject(CreateQuizService);

  private readonly formBuilder = inject(FormBuilder);
  form = this.formBuilder.nonNullable.group({
    marks: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });
  marksControl = this.form.get('marks')!;
  onDelete(): void {
    this.quizService.removeQuestion(this.question());
  }
  ngOnInit(): void {
    this.marksControl.setValue(this.question().marks);
    this.marksControl.valueChanges.subscribe((newValue) => {
      this.quizService.updateQuestionMarks(this.question().id, newValue);
    });
  }
}
