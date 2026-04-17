import {Component, computed, DestroyRef, inject, input, OnInit} from '@angular/core';
import {QuestionAttemptComponent} from '../../../shared/models/quiz/question-component.contracts';
import {Question, QuestionType} from '../../../shared/models/quiz/question.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {MCQ} from '../../../shared/models/quiz/mcq.model';
import {distinctUntilChanged, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {McqAttemptModel, QuizAttemptStore} from './quiz-attempt.store';

export type McqAttemptForm = FormGroup<{
  selectedChoiceId: FormControl<string | null>;
}>

@Component({
  selector: 'app-mcq-attempt',
  imports: [],
  template: `
    <article class="question-card" aria-label="Multiple choice question">
      <p class="badge">Multiple Choice</p>
      <h2>Which data structure follows LIFO?</h2>

      <div class="choices-grid">
        @for (choice of mcqQuestion().choices; track choice.id) {
          <button
            type="button"
            class="option"
            [class.selected]="selectedChoiceIdControl.value === choice.id"
            (click)="selectedChoiceIdControl.setValue(choice.id)">
            {{ choice.text }}
          </button>
        }
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

    .choices-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .option {
      min-height: 3rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      background: var(--clr-white);
      font-weight: 600;
      color: var(--clr-gray-600);
      text-align: left;
      padding: 0 0.9rem;

      transition: all 0.2s ease-in-out;

      &:hover {
        border-color: var(--clr-green-500);
        transform: scale(1.01);
      }
    }

    @media (width <= 40rem) {
      .choices-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class McqAttempt implements QuestionAttemptComponent, OnInit {
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  private readonly destroyRef = inject(DestroyRef);


  readonly question = input.required<Question>();
  protected readonly mcqQuestion = computed(() => {
    return this.question() as MCQ;
  });
  private readonly fb = inject(FormBuilder);

  protected get selectedChoiceIdControl() {
    return this.mcqAttemptForm.controls.selectedChoiceId;
  }

  protected readonly mcqAttemptForm: McqAttemptForm = this.fb.group({
    selectedChoiceId: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {

    this.selectedChoiceIdControl.valueChanges
      .pipe(
        startWith(this.selectedChoiceIdControl.value),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(choiceId => {

        if (!choiceId) return;

        const answer: McqAttemptModel = {
          questionId: this.question().id,
          selectedChoiceId: choiceId,
          type: QuestionType.MultipleChoice,
        };

        this.quizAttemptStore.submitAnswer(answer);

      });

  }
}

``
