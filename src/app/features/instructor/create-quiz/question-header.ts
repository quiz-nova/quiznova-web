import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { Question } from '../../../shared/models/quiz/question.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeleteButton } from '../../../shared/components/delete-button/delete-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateQuizStore } from './create-quiz.store';

@Component({
  selector: 'app-question-header',
  imports: [ReactiveFormsModule, DeleteButton],
  template: `
    <header class="question-header">
      <div class="question-header__details">
        <h3>Q{{ index() + 1 }}</h3>
        <ng-content></ng-content>
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
        <app-delete-button ariaLabel="Delete question" (deleted)="onDelete()" />
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
  readonly index = input.required<number>();
  readonly question = input.required<Question>();
  private readonly createQuizStore = inject(CreateQuizStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    marks: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });
  private readonly marksControl = this.form.get('marks')!;

  onDelete(): void {
    this.createQuizStore.removeQuestion(this.question().id);
  }

  ngOnInit(): void {
    this.marksControl.setValue(this.question().marks);
    this.marksControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        this.createQuizStore.updateQuestionMarks(this.question().id, newValue);
      });
  }
}
