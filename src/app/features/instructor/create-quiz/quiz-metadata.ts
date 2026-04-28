import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '@Features/auth/auth.service';
import { SelectModule } from 'primeng/select';
import { of, startWith, switchMap } from 'rxjs';

import { FieldError } from '@shared/components/field-error/field-error';
import { CoursesService } from '@shared/services/courses.service';

import { CreateQuizStore } from './create-quiz.store';

type QuizHeaderFormGroup = FormGroup<{
  title: FormControl<string>;
  courseId: FormControl<string>;
  startsAtUtc: FormControl<Date>;
  endsAtUtc: FormControl<Date>;
}>;

@Component({
  selector: 'app-quiz-metadata',
  imports: [ReactiveFormsModule, SelectModule, FieldError],
  template: `
    <form class="metadata-form" [formGroup]="quizHeaderForm">
      <div class="field-group">
        <label class="dropdown-label" for="quiz-title">Quiz Title</label>
        <input
          class="focus-green-ring"
          id="quiz-title"
          [formControl]="titleControl"
          type="text"
          placeholder="e.g. Week 8 Assessment"
        />

        @if (titleControl.invalid && titleControl.touched) {
          @if (titleControl.hasError('required')) {
            <app-field-error errorText="Quiz title is required." />
          }
        }
      </div>

      <div class="field-group">
        <label class="dropdown-label" for="quiz-course">Course</label>
        <p-select
          class="focus-green-ring dropdown-field"
          [formControl]="courseIdControl"
          [options]="instructorCourses()"
          inputId="quiz-course"
          optionLabel="courseName"
          optionValue="courseId"
          placeholder="Select course"
          appendTo="body"
        />

        @if (courseIdControl.invalid && courseIdControl.touched) {
          @if (courseIdControl.hasError('required')) {
            <app-field-error errorText="Course is required." />
          }
        }
      </div>

      <div class="field-group">
        <label class="dropdown-label" for="quiz-description"> Description (optional) </label>
        <textarea
          class="focus-green-ring"
          id="quiz-description"
          [formControl]="quizHeaderForm.controls.title"
          rows="3"
          placeholder="Quiz description..."
        ></textarea>
      </div>

      <div class="field-group">
        <label class="dropdown-label" for="quiz-time-limit"> Time Limit (minutes) </label>
        <input
          class="focus-green-ring"
          id="quiz-time-limit"
          type="number"
          placeholder="30"
          value="30"
        />
      </div>
    </form>
  `,
  styles: `
    .metadata-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: 1.25rem;
      background: var(--clr-white);
      box-shadow: 0 12px 32px rgb(15 23 42 / 8%);
      min-width: 0;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      min-width: 0;
    }

    .field-error {
      min-height: 1rem;
      color: var(--clr-red-500);
      font-size: var(--fs-300);
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
      min-height: 6.5rem;
    }

    input,
    textarea {
      min-height: 4.75rem;
      color: var(--clr-gray-500);
    }
  `,
})
export class QuizMetadata implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly coursesService = inject(CoursesService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly createQuizStore = inject(CreateQuizStore);

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

  protected get titleControl() {
    return this.quizHeaderForm.controls.title;
  }

  protected get courseIdControl() {
    return this.quizHeaderForm.controls.courseId;
  }

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
  }

  ngOnDestroy(): void {
    this.createQuizStore.unregisterForm(this.quizHeaderForm);
  }
}
