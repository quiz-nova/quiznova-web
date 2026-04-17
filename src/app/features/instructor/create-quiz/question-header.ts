import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { Question } from '../../../shared/models/quiz/question.model';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DeleteButton } from '../../../shared/components/delete-button/delete-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateQuizStore } from './create-quiz.store';

type QuestionHeaderFormGroup = FormGroup<{
  marks: FormControl<number>;
}>;

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
          <div class="question-header__marks-field">
            <input
              type="number"
              id="marks"
              class="question-header__marks focus-green-ring"
              formControlName="marks"
              min="1"
              max="5"
              step="1"
            />
          </div>
        </form>
        <app-delete-button ariaLabel="Delete question" (deleted)="onDelete()" />
        <div class="question-header__error">
          @if (marksControl.invalid && marksControl.touched) {
            @if (marksControl.hasError('required')) {
              <span>Marks is required.</span>
            } @else if (marksControl.hasError('min') || marksControl.hasError('max')) {
              <span>Marks must be between 1 and 5.</span>
            }
          }
        </div>
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
        gap: 0.9rem;
        gap: 1rem;
      }
      h3 {
        font-size: var(--fs-700);
        font-size: var(--fs-600);
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      form {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .question-header__marks-field {
        gap: 0.5rem;
        flex-direction: column;
        gap: 0.25rem;
      }

      input[type='number'] {
        width: 4.5rem;
        padding: 0.45rem 0.55rem;
        width: 4rem;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        font-size: var(--fs-400);
      }

      label {
      }

      .question-header__error {
        min-height: 1rem;
        color: var(--clr-red-500);
        font-size: var(--fs-300);
      }
    `,
  ],
})
export class QuestionHeader implements OnInit {
  readonly index = input.required<number>();
  readonly question = input.required<Question>();
  private readonly createQuizStore = inject(CreateQuizStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly form: QuestionHeaderFormGroup = this.fb.group({
    marks: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  protected get marksControl() {
    return this.form.controls.marks;
  }

  onDelete(): void {
    this.createQuizStore.removeQuestion(this.question().id);
  }

  ngOnInit(): void {
    this.marksControl.setValue(this.question().marks);
    this.marksControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        if (this.marksControl.invalid) {
          return;
        }

        this.createQuizStore.updateQuestionMarks(this.question().id, newValue);
      });
  }
}
