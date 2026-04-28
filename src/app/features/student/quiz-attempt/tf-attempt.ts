import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { distinctUntilChanged, startWith } from 'rxjs';

import { QuestionAttemptContract } from '@shared/models/quiz/question-component.contracts';
import { Question, QuestionType } from '@shared/models/quiz/question.model';

import { SubmitTfAnswer } from './models/SubmitQuizAttempt.model';
import { QuizAttemptStore } from './quiz-attempt.store';

export type TfAttemptForm = FormGroup<{
  selectedOption: FormControl<boolean | null>;
}>;

@Component({
  selector: 'app-tf-attempt',
  imports: [],
  template: `
    <article class="question-card" aria-label="True or false question">
      <p class="badge">True / False</p>
      <h2>{{ question().questionText }}</h2>

      <div class="options-grid">
        <button
          class="option"
          [class.selected]="selectedOptionControl.value === true"
          (click)="selectedOptionControl.setValue(true)"
          type="button"
        >
          True
        </button>
        <button
          class="option"
          [class.selected]="selectedOptionControl.value === false"
          (click)="selectedOptionControl.setValue(false)"
          type="button"
        >
          False
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
      transition: all 0.2s ease-in-out;

      &:hover {
        border-color: var(--clr-green-500);
        transform: scale(1.01);
      }

      &.selected {
        border-color: var(--clr-green-600);
        background-color: var(--clr-green-50);
        color: var(--clr-green-700);
        box-shadow: 0 0 0 1px var(--clr-green-600);
      }
    }

    @media (width <= 40rem) {
      .options-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class TfAttempt implements QuestionAttemptContract, OnInit {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly question = input.required<Question>();

  private readonly fb = inject(FormBuilder);

  protected get selectedOptionControl() {
    return this.tfAttemptForm.controls.selectedOption;
  }
  protected readonly tfAttemptForm: TfAttemptForm = this.fb.group({
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

        const answer: SubmitTfAnswer = {
          id: crypto.randomUUID(),
          questionId: this.question().id,
          studentChoice: selectedValue,
          type: QuestionType.Tf,
        };

        this.quizAttemptStore.submitAnswer(answer);
      });
  }
}
