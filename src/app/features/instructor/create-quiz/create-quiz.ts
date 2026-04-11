import { Component, DestroyRef, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { of, startWith, switchMap } from 'rxjs';
import { AddQuestion } from './add-question';
import { QuizService } from '../../../shared/services/quiz.service';
import { QuestionHeader } from './question-header';
import { QuizHeader } from './quiz-header';
import { NoQuestions } from './no-questions';
import { AuthService } from '../../auth/auth.service';
import { CoursesService } from '../../../shared/services/courses.service';
import { CreateQuizStore } from './create-quiz.store';
import { Quiz } from '../../../shared/models/quiz/quiz.model';

type QuizHeaderFormGroup = FormGroup<{
  title: FormControl<string>;
  courseId: FormControl<string>;
  startsAtUtc: FormControl<Date>;
  endsAtUtc: FormControl<Date>;
}>;

@Component({
  selector: 'app-create-quiz',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    AddQuestion,
    NgComponentOutlet,
    QuestionHeader,
    QuestionHeader,
    QuizHeader,
    NoQuestions,
    NgComponentOutlet,
  ],
  template: `
    <section class="create-quiz container">
      <header class="header">
        <div class="content">
          <h1 class="title">Create Quiz</h1>
          <p class="subtitle">Build your quiz by adding questions below</p>
        </div>
        <button type="button" class="btn btn-green" (click)="onPublishQuiz()">Publish Quiz</button>
      </header>
      <form class="metadata-form" [formGroup]="quizHeaderForm">
        <div class="field-group">
          <label class="dropdown-label" for="quiz-title">Quiz Title</label>
          <input
            id="quiz-title"
            class="focus-green-ring"
            type="text"
            placeholder="e.g. Week 8 Assessment"
            [formControl]="quizHeaderForm.controls.title"
          />
        </div>

        <div class="field-group">
          <label class="dropdown-label" for="quiz-course">Course</label>
          <p-select
            inputId="quiz-course"
            class="focus-green-ring dropdown-field"
            [formControl]="quizHeaderForm.controls.courseId"
            [options]="instructorCourses()"
            optionLabel="name"
            optionValue="courseId"
            placeholder="Select course"
            appendTo="body"
          />
        </div>

        <div class="field-group">
          <label class="dropdown-label" for="quiz-description"> Description (optional) </label>
          <textarea
            id="quiz-description"
            class="focus-green-ring"
            rows="3"
            placeholder="Quiz description..."
            [formControl]="quizHeaderForm.controls.title"
          ></textarea>
        </div>

        <div class="field-group">
          <label class="dropdown-label" for="quiz-time-limit"> Time Limit (minutes) </label>
          <input
            id="quiz-time-limit"
            class="focus-green-ring"
            type="number"
            placeholder="30"
            value="30"
          />
        </div>
      </form>
      <app-quiz-header></app-quiz-header>
      @if (numberOfQuestions() > 0) {
        <div class="questions-list">
          @for (question of quiz().questions; track question.id) {
            <div
              #questionElement
              [id]="question.id"
              class="question"
              animate.enter="element-enter"
              animate.leave="element-leave"
            >
              <app-question-header [index]="$index" [question]="question">
                <ng-container
                  [ngComponentOutlet]="quizService.getSuitableQuestionTag(question.type)"
                >
                </ng-container>
              </app-question-header>
              <ng-container
                [ngComponentOutlet]="quizService.getSuitableQuestionComponent(question.type)"
                [ngComponentOutletInputs]="{ question: question }"
              ></ng-container>
            </div>
          }
        </div>
      }
      <app-add-question></app-add-question>
      @if (numberOfQuestions() === 0) {
        <app-no-questions></app-no-questions>
      }
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex: 5;
    }
    .create-quiz {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      background-color: var(--clr-gray-50);
      border-left: 1px solid var(--clr-gray-500);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;

      .content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .title {
          font-size: var(--fs-600);
        }

        .subtitle {
          color: var(--clr-gray-600);
          font-size: var(--fs-400);
          font-weight: 700;
        }
      }
    }

    .metadata-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.9fr);
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: 1.25rem;
      background: var(--clr-white);
      box-shadow: 0 12px 32px rgb(15 23 42 / 8%);

      @media (width < 768px) {
        grid-template-columns: 1fr;
      }
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    input,
    textarea {
      width: 100%;
      padding: 1rem 1.1rem;
      border: 1px solid var(--clr-gray-500);
      border-radius: 1rem;
      background: var(--clr-gray-50);
      color: var(--clr-blue-900);
    }

    textarea {
      resize: vertical;
      min-height: 4.75rem;
    }

    input,
    textarea {
      &::placeholder {
        color: var(--clr-gray-500);
      }
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .question {
      padding: 1rem;
      border-top: 1px solid var(--clr-gray-500);
      border-bottom: 1px solid var(--clr-gray-500);
      border-right: 1px solid var(--clr-gray-500);
      border-left: 6px solid var(--clr-green-500);
      border-radius: var(--radius-md);
      box-shadow:
        0 20px 25px -5px rgb(0 0 0 / 10%),
        0 10px 10px -5px rgb(0 0 0 / 4%);
    }
  `,
})
export class CreateQuiz implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly coursesService = inject(CoursesService);
  protected readonly quizService = inject(QuizService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly createQuizStore = inject(CreateQuizStore);
  protected readonly quiz: Signal<Quiz> = this.createQuizStore.quiz as Signal<Quiz>;
  protected readonly numberOfQuestions: Signal<number> =
    this.createQuizStore.numberOfQuestions as Signal<number>;

  protected readonly instructorCourses = toSignal(
    toObservable(this.authService.currentUser).pipe(
      switchMap((user) => (user ? this.coursesService.getInstructorCourses(user.userId) : of([]))),
    ),
    { initialValue: [] },
  );

  protected readonly quizHeaderForm: QuizHeaderFormGroup = this.fb.group({
    title: ['', Validators.required],
    courseId: ['', Validators.required],
    startsAtUtc: [new Date(), Validators.required],
    endsAtUtc: [new Date(), Validators.required],
  });

  ngOnInit(): void {
    this.createQuizStore.registerForm(this.quizHeaderForm);

    this.quizHeaderForm.valueChanges
      .pipe(startWith(this.quizHeaderForm.getRawValue()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const value = this.quizHeaderForm.getRawValue();
        this.createQuizStore.setHeaderMetadata({
          title: value.title,
          courseId: value.courseId,
          startsAtUtc: value.startsAtUtc,
          endsAtUtc: value.endsAtUtc,
        });
      });

    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.createQuizStore.setInstructorId(currentUser.userId);
    }
  }

  ngOnDestroy(): void {
    this.createQuizStore.unregisterForm(this.quizHeaderForm);
  }

  protected onPublishQuiz() {
    if (this.createQuizStore.validateAll()) {
      this.quizService.createQuiz(this.createQuizStore.quiz()).subscribe({
        next: (response) => {
          console.log('Quiz published successfully', response);
          globalThis.alert('Quiz published successfully.');
        },
        error: (error) => {
          console.error('Error publishing quiz', error);
        },
      });
    }
  }
}
