import {Component, DestroyRef, inject, input, OnInit} from '@angular/core';
import {QuestionAttemptComponent} from '../../../shared/models/quiz/question-component.contracts';
import {Question, QuestionType} from '../../../shared/models/quiz/question.model';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {EssayAttemptModel, QuizAttemptStore} from './quiz-attempt.store';

export type EssayAttemptForm = FormGroup<{
  answer: FormControl<string | null>;
}>;

@Component({
  selector: 'app-essay-attempt',
  imports: [ReactiveFormsModule],
  template: `
    <article class="question-card" aria-label="Essay question">
      <p class="badge">Essay</p>
      <h2>Explain the difference between a process and a thread.</h2>
      <textarea
        [formControl]="essayAttemptForm.controls.answer"
        placeholder="Write your answer here..."></textarea>
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

    textarea {
      width: 100%;
      min-height: 8rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      padding: 0.75rem;
      font: inherit;
      resize: vertical;
    }
  `,
})
export class EssayAttempt implements QuestionAttemptComponent, OnInit {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly question = input.required<Question>();
  private readonly fb = inject(FormBuilder);

  protected readonly essayAttemptForm: EssayAttemptForm = this.fb.group({
    answer: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.essayAttemptForm.controls.answer.valueChanges
      .pipe(
        startWith(this.essayAttemptForm.controls.answer.value),
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((responseText) => {
        if (responseText === null) {
          return;
        }

        const answer: EssayAttemptModel = {
          questionId: this.question().id,
          responseText,
          type: QuestionType.Essay,
        };

        this.quizAttemptStore.submitAnswer(answer);
      });
  }
}
