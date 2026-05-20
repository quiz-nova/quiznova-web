import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  input,
  output,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '@Features/auth/auth.service';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { of, startWith, switchMap } from 'rxjs';

import { ConfirmActionModal } from '@shared/components/confirm-action-modal/confirm-action-modal';
import { FieldError } from '@shared/components/field-error/field-error';
import { CoursesService } from '@shared/services/courses.service';
import { CustomValidators } from '@shared/validators/custom-validators';

export interface QuizMetadataValue {
  title: string;
  courseId: string;
  startsAtUtc: Date;
  endsAtUtc: Date;
}

type QuizHeaderFormGroup = FormGroup<{
  title: FormControl<string>;
  courseId: FormControl<string>;
  startsAtUtc: FormControl<Date>;
  endsAtUtc: FormControl<Date>;
}>;

@Component({
  selector: 'app-quiz-metadata-form',
  imports: [ReactiveFormsModule, SelectModule, DatePicker, InputText, FieldError, ConfirmActionModal],
  template: `
    <form class="metadata-form" [formGroup]="quizHeaderForm">
      <div class="field-group">
        <label class="dropdown-label" for="quiz-title">Quiz Title</label>
        <input
          class="focus-green-ring"
          id="quiz-title"
          pInputText
          [formControl]="titleControl"
          [attr.aria-invalid]="titleControl.invalid && titleControl.touched ? 'true' : null"
          (blur)="emitValue()"
          type="text"
          placeholder="e.g. Week 8 Assessment"
          aria-describedby="quiz-title-is-required-error"
        />

        @if (titleControl.invalid && titleControl.touched) {
          @if (titleControl.hasError('required')) {
            <app-field-error id="quiz-title-is-required-error"
              >Quiz title is required.</app-field-error
            >
          }
        }
      </div>

      <div class="field-group">
        <label class="dropdown-label" for="quiz-course">Course</label>
        <p-select
          class="focus-green-ring dropdown-field"
          [formControl]="courseIdControl"
          [options]="instructorCourses()"
          [attr.aria-invalid]="courseIdControl.invalid && courseIdControl.touched ? 'true' : null"
          (onChange)="onCourseChange($event.value)"
          inputId="quiz-course"
          optionLabel="courseName"
          optionValue="courseId"
          placeholder="Select course"
          appendTo="body"
          aria-describedby="course-is-required-error"
        />

        @if (courseIdControl.invalid && courseIdControl.touched) {
          @if (courseIdControl.hasError('required')) {
            <app-field-error id="course-is-required-error">Course is required.</app-field-error>
          }
        }
      </div>

      <div class="field-group">
        <label class="dropdown-label" for="quiz-starts-at">Starts At</label>
        <p-datepicker
          class="focus-green-ring dropdown-field"
          id="quiz-starts-at"
          [formControl]="startsAtControl"
          [showTime]="true"
          [showIcon]="true"
          [fluid]="true"
          [attr.aria-invalid]="startsAtControl.invalid && startsAtControl.touched ? 'true' : null"
          (onBlur)="emitValue()"
          inputId="quiz-starts-at"
          hourFormat="12"
          iconDisplay="input"
          appendTo="body"
          aria-describedby="starts-at-is-required-error"
        />

        @if (startsAtControl.invalid && startsAtControl.touched) {
          @if (startsAtControl.hasError('required')) {
            <app-field-error id="starts-at-is-required-error"
              >Start time is required.</app-field-error
            >
          }
        }
      </div>

      <div class="field-group">
        <label class="dropdown-label" for="quiz-ends-at">Ends At</label>
        <p-datepicker
          class="focus-green-ring dropdown-field"
          id="quiz-ends-at"
          [formControl]="endsAtControl"
          [showTime]="true"
          [showIcon]="true"
          [fluid]="true"
          [attr.aria-invalid]="endsAtControl.invalid && endsAtControl.touched ? 'true' : null"
          (onBlur)="emitValue()"
          inputId="quiz-ends-at"
          hourFormat="12"
          iconDisplay="input"
          appendTo="body"
          aria-describedby="ends-at-is-required-error"
        />

        @if (endsAtControl.invalid && endsAtControl.touched) {
          @if (endsAtControl.hasError('required')) {
            <app-field-error id="ends-at-is-required-error">End time is required.</app-field-error>
          }
        }
      </div>
    </form>

    @if (showConfirmModal()) {
      <app-confirm-action-modal
        title="Change Course"
        warningMessage="This action is irreversible. All questions you have added will be permanently removed."
        confirmationPhrase="change course"
        confirmButtonText="I understand, change course"
        (confirmed)="confirmCourseChange()"
        (cancelled)="cancelCourseChange()"
      />
    }
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


  `,
})
export class QuizMetadataForm implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly coursesService = inject(CoursesService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly initialData = input<QuizMetadataValue>();

  readonly formReady = output<FormGroup>();
  readonly formDestroyed = output<FormGroup>();
  readonly valueChange = output<QuizMetadataValue>();
  readonly blurEvent = output<QuizMetadataValue>();
  readonly courseIdChanged = output<string>();

  protected readonly instructorCourses = toSignal(
    toObservable(this.authService.currentUser).pipe(
      switchMap((user) => (user ? this.coursesService.getInstructorCourses(user.userId) : of([]))),
    ),
    { initialValue: [] },
  );

  protected readonly quizHeaderForm: QuizHeaderFormGroup = this.fb.group({
    title: ['', [Validators.required, CustomValidators.trimMinLength(3)]],
    courseId: ['', Validators.required],
    startsAtUtc: [this.getDefaultStartsAt(), Validators.required],
    endsAtUtc: [this.getDefaultEndsAt(), Validators.required],
  });

  protected readonly showConfirmModal = signal(false);
  private pendingCourseId = '';
  private previousCourseId = '';

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.previousCourseId = data.courseId;
        this.quizHeaderForm.patchValue(
          {
            title: data.title,
            courseId: data.courseId,
            startsAtUtc: new Date(data.startsAtUtc),
            endsAtUtc: new Date(data.endsAtUtc),
          },
          { emitEvent: false },
        );
      }
    });
  }

  protected get titleControl() {
    return this.quizHeaderForm.controls.title;
  }

  protected get courseIdControl() {
    return this.quizHeaderForm.controls.courseId;
  }

  protected get startsAtControl() {
    return this.quizHeaderForm.controls.startsAtUtc;
  }

  protected get endsAtControl() {
    return this.quizHeaderForm.controls.endsAtUtc;
  }

  ngOnInit(): void {
    this.formReady.emit(this.quizHeaderForm);

    this.quizHeaderForm.valueChanges
      .pipe(startWith(this.quizHeaderForm.getRawValue()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.emitValueChange();
      });
  }

  ngOnDestroy(): void {
    this.formDestroyed.emit(this.quizHeaderForm);
  }

  protected onCourseChange(newCourseId: string): void {
    if (!this.previousCourseId || this.previousCourseId === newCourseId) {
      this.previousCourseId = newCourseId;
      this.courseIdChanged.emit(newCourseId);
      return;
    }

    // Show confirmation modal
    this.pendingCourseId = newCourseId;
    this.showConfirmModal.set(true);

    // Revert the dropdown visually until confirmed
    this.courseIdControl.setValue(this.previousCourseId, { emitEvent: false });
  }

  protected confirmCourseChange(): void {
    this.showConfirmModal.set(false);
    this.previousCourseId = this.pendingCourseId;
    this.courseIdControl.setValue(this.pendingCourseId, { emitEvent: false });
    this.courseIdChanged.emit(this.pendingCourseId);
    this.pendingCourseId = '';
  }

  protected cancelCourseChange(): void {
    this.showConfirmModal.set(false);
    this.pendingCourseId = '';
  }

  protected emitValue() {
    this.blurEvent.emit(this.getMetadataValue());
  }

  private emitValueChange() {
    this.valueChange.emit(this.getMetadataValue());
  }

  private getMetadataValue(): QuizMetadataValue {
    const rawValue = this.quizHeaderForm.getRawValue();
    return {
      title: rawValue.title,
      courseId: rawValue.courseId,
      startsAtUtc: rawValue.startsAtUtc ? new Date(rawValue.startsAtUtc) : new Date(),
      endsAtUtc: rawValue.endsAtUtc ? new Date(rawValue.endsAtUtc) : new Date(),
    };
  }

  private getDefaultStartsAt(): Date {
    return new Date();
  }

  private getDefaultEndsAt(): Date {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now;
  }
}
