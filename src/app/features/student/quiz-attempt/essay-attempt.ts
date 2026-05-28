import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { distinctUntilChanged, startWith } from 'rxjs';

import { QuestionAttemptContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { Essay } from '@shared/models/quiz/questions/essay.model';

import { SubmitEssayAnswer } from './models/SubmitQuizAttempt.model';
import { QuizAttemptStore } from './quiz-attempt.store';

export type EssayAttemptForm = FormGroup<{
  studentResponse: FormControl<string | null>;
}>;

@Component({
  selector: 'app-essay-attempt',
  imports: [ReactiveFormsModule],
  template: `
    <article class="question-card" aria-label="Essay question">
      <p class="badge">Text Response</p>
      <h2>{{ question().questionText }}</h2>

      <form class="essay-form" [formGroup]="essayAttemptForm">
        <textarea
          class="response-input"
          [class.invalid]="studentResponseControl.invalid && studentResponseControl.touched"
          formControlName="studentResponse"
          placeholder="Type your answer here..."
          rows="6"
        ></textarea>
        @if (studentResponseControl.invalid && studentResponseControl.touched) {
          <span class="error-message">Response must be between 3 and 1000 characters.</span>
        }
      </form>
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
      background: var(--clr-blue-400);
      color: var(--clr-blue-900);
      font-size: 0.75rem;
      font-weight: 700;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .essay-form {
      display: flex;
      flex-direction: column;
    }

    .response-input {
      width: 100%;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.5rem;
      background: var(--clr-gray-50);
      resize: vertical;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--clr-blue-400);
        background: var(--clr-white);
      }

      &.invalid {
        border-color: var(--clr-red-500);
      }
    }

    .error-message {
      color: var(--clr-red-500);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EssayAttempt implements QuestionAttemptContract, OnInit {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly question = input.required<Question>();
  protected readonly essay = computed(() => {
    return this.question() as Essay;
  });
  private readonly fb = inject(FormBuilder);

  protected get studentResponseControl() {
    return this.essayAttemptForm.controls.studentResponse;
  }

  protected readonly essayAttemptForm: EssayAttemptForm = this.fb.group({
    studentResponse: this.fb.control<string | null>(null, {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(1000)],
    }),
  });

  ngOnInit(): void {
    this.studentResponseControl.valueChanges
      .pipe(
        startWith(this.studentResponseControl.value),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        if (response === null || response.length < 3) return;

        const answer: SubmitEssayAnswer = {
          questionId: this.question().id,
          studentResponse: response,
          type: 'essay',
        };

        this.quizAttemptStore.submitAnswer(answer);
      });
  }
}
