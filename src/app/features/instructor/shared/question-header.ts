import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DeleteButton } from '@shared/components/delete-button/delete-button';
import { FieldError } from '@shared/components/field-error/field-error';
import { Question } from '@shared/models/quiz/question.model';


type QuestionHeaderFormGroup = FormGroup<{
  marks: FormControl<number>;
}>;

@Component({
  selector: 'app-question-header',
  imports: [ReactiveFormsModule, DeleteButton, FieldError],
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
              class="question-header__marks focus-green-ring"
              id="marks"
              type="number"
              formControlName="marks"
              min="1"
              [max]="maxMarks()"
              step="1"
              (blur)="onBlur()"
              [attr.aria-invalid]="marksControl.invalid && marksControl.touched ? 'true' : null"
              aria-describedby="marks-is-required-error marks-must-be-between-1-and-max-error"
            />
          </div>
        </form>
        <app-delete-button (deleteButtonClicked)="deleteQuestion.emit(question().id)" ariaLabel="Delete question" />
        @if (marksControl.invalid && marksControl.touched) {
          @if (marksControl.hasError('required')) {
            <app-field-error id="marks-is-required-error">Marks is required.</app-field-error>
          } @else if (marksControl.hasError('min') || marksControl.hasError('max')) {
            <app-field-error id="marks-must-be-between-1-and-max-error">Marks must be between 1 and {{ maxMarks() }}.</app-field-error>
          }
        }
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
      question-header__actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
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
        border: none;
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionHeader implements OnInit {
  readonly index = input.required<number>();
  readonly question = input.required<Question>();
  readonly maxMarks = input<number>(5);
  
  readonly deleteQuestion = output<string>();
  readonly marksChange = output<{questionId: string, marks: number}>();
  readonly blurEvent = output<{questionId: string, marks: number}>();

  private readonly destroyRef = inject(DestroyRef);

  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly form: QuestionHeaderFormGroup = this.fb.group({
    marks: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  constructor() {
    effect(() => {
      const max = this.maxMarks();
      this.marksControl.setValidators([Validators.required, Validators.min(1), Validators.max(max)]);
      this.marksControl.updateValueAndValidity();
    });
  }

  protected get marksControl() {
    return this.form.controls.marks;
  }

  ngOnInit(): void {
    this.marksControl.setValue(this.question().marks);
    this.marksControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        if (this.marksControl.invalid) {
          return;
        }

        this.marksChange.emit({ questionId: this.question().id, marks: newValue });
      });
  }

  protected onBlur() {
    if (this.form.valid) {
      this.blurEvent.emit({ questionId: this.question().id, marks: this.marksControl.value });
    }
  }
}
