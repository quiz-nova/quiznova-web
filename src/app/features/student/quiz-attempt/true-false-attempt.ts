import {Component, DestroyRef, inject, input, OnInit} from '@angular/core';
import {QuestionAttemptComponent} from '../../../shared/models/quiz/question-component.contracts';
import {Question, QuestionType} from '../../../shared/models/quiz/question.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {distinctUntilChanged, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {QuizAttemptStore, TrueFalseAttemptModel} from './quiz-attempt.store';

export type TrueFalseAttemptForm = FormGroup<{
  selectedOption: FormControl<boolean | null>;
}>;

@Component({
  selector: 'app-true-false-attempt',
  imports: [],
  template: `
    <article class="question-card" aria-label="True or false question">
      <p class="badge">True / False</p>
      <h2>Lists in Python are immutable.</h2>

      <div class="options-grid">
        <button
          type="button"
          class="option"
          [class.selected]="trueFalseAttemptForm.controls.selectedOption.value"
          (click)=" trueFalseAttemptForm.controls.selectedOption.setValue(true)">True
        </button>
        <button
          [class.selected]="trueFalseAttemptForm.controls.selectedOption.value"
          type="button" class="option"
          (click)=" trueFalseAttemptForm.controls.selectedOption.setValue(false)">False
        </button>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .question-card {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    .badge {
      margin: 0;
      width: fit-content;
      border-radius: 999px;
      padding: 0.25rem 0.6rem;
      background: var(--clr-gray-200);
      font-size: 0.75rem;
      font-weight: 700;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .options-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .option {
      min-height: 5.5rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      background: var(--clr-white);
      font-weight: 700;
      color: var(--clr-gray-600);
    }

    @media (width <= 40rem) {
      .options-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class TrueFalseAttempt implements QuestionAttemptComponent, OnInit {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly question = input.required<Question>();

  private readonly fb = inject(FormBuilder);

  protected get selectedOptionControl() {
    return this.trueFalseAttemptForm.controls.selectedOption;
  }
  protected readonly trueFalseAttemptForm: TrueFalseAttemptForm = this.fb.group({
    selectedOption: this.fb.control<boolean | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.selectedOptionControl.valueChanges
      .pipe(
        startWith(this.selectedOptionControl.value),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((selectedValue) => {
        if (selectedValue === null) {
          return;
        }

        const answer: TrueFalseAttemptModel = {
          questionId: this.question().id,
          selectedValue,
          type: QuestionType.TrueFalse,
        };

        this.quizAttemptStore.submitAnswer(answer);
      });
  }
}
