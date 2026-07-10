import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { FieldError } from '@shared/components/field-error/field-error';
import { AnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { Question } from '@shared/models/quiz/question.model';
import { QuestionAnswer, EssayAnswer } from '@shared/models/quiz-attempt/question-answer.model';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';
import { CustomValidators } from '@shared/validators/custom-validators';

@Component({
  selector: 'app-essay-answer-grading',
  imports: [ReactiveFormsModule, FieldError],
  template: `
    <div class="essay-section">
      <!-- Student response box -->
      <div class="student-response">
        <p class="response-label">
          <i class="fa-solid fa-pen-nib"></i>
          Student's Response
        </p>
        <blockquote class="response-text">
          {{ essayAnswer().studentResponse || 'No response provided.' }}
        </blockquote>
      </div>

      <!-- Grading form -->
      <form
        class="grade-form"
        [formGroup]="form"
        [id]="'grade-form-' + essayAnswer().answerId"
        (ngSubmit)="submitGrade()"
      >
        <!-- Score -->
        <div class="field-group">
          <label class="field-label" [for]="'score-' + essayAnswer().answerId">
            Score
            <span class="max-marks">/ {{ question().marks }}</span>
          </label>
          <input
            class="score-input"
            [id]="'score-' + essayAnswer().answerId"
            [formControl]="scoreControl"
            [min]="0"
            [max]="question().marks"
            [attr.aria-describedby]="'score-error-' + essayAnswer().answerId"
            type="number"
            placeholder="0"
          />
          <app-field-error [id]="'score-error-' + essayAnswer().answerId">
            @if (scoreControl.touched && scoreControl.errors?.['required']) {
              Score is required.
            } @else if (scoreControl.touched && scoreControl.errors?.['min']) {
              Score cannot be negative.
            } @else if (scoreControl.touched && scoreControl.errors?.['max']) {
              Score cannot exceed {{ question().marks }}.
            }
          </app-field-error>
        </div>

        <!-- Feedback -->
        <div class="field-group">
          <label class="field-label" [for]="'feedback-' + essayAnswer().answerId">
            Feedback
            <span class="optional-tag">optional</span>
          </label>
          <textarea
            class="feedback-textarea"
            [id]="'feedback-' + essayAnswer().answerId"
            [formControl]="feedbackControl"
            [attr.aria-describedby]="'feedback-error-' + essayAnswer().answerId"
            rows="3"
            placeholder="Leave a note for the student (3–200 characters)..."
          ></textarea>
          <div class="feedback-footer">
            <app-field-error [id]="'feedback-error-' + essayAnswer().answerId">
              @if (feedbackControl.touched && feedbackControl.errors?.['minlength']) {
                Feedback must be at least 3 characters.
              } @else if (feedbackControl.touched && feedbackControl.errors?.['maxlength']) {
                Feedback must not exceed 200 characters.
              }
            </app-field-error>
            <span class="char-count" [class.over-limit]="feedbackLength > 200">
              {{ feedbackLength }}/200
            </span>
          </div>
        </div>

        <!-- Actions row -->
        <div class="form-actions">
          @if (saved) {
            <div class="saved-badge">
              <i class="fa-solid fa-circle-check"></i>
              Graded
            </div>
          }
          @if (error) {
            <span class="save-error">{{ error }}</span>
          }
          <button
            class="save-btn"
            [disabled]="saving || form.invalid"
            [attr.aria-busy]="saving"
            [id]="'save-btn-' + essayAnswer().answerId"
            type="submit"
          >
            @if (saving) {
              <i class="fa-solid fa-spinner fa-spin"></i>
              Saving...
            } @else {
              <i class="fa-solid fa-floppy-disk"></i>
              Save Grade
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .essay-section {
      display: grid;
      gap: 1.25rem;
    }

    .student-response {
      background: var(--clr-gray-50);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .response-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.625rem 1rem;
      background: var(--clr-gray-100);
      border-bottom: 1px solid var(--clr-gray-200);
      font-size: var(--fs-300);
      font-weight: 700;
      color: var(--clr-gray-600);
    }

    .response-text {
      padding: 1rem;
      font-size: var(--fs-400);
      color: var(--clr-gray-800);
      line-height: 1.65;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }

    .grade-form {
      display: grid;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--clr-green-50);
      border: 1px solid var(--clr-green-100);
      border-radius: var(--radius-md);
    }

    .field-group {
      display: grid;
      gap: 0.375rem;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--fs-300);
      font-weight: 700;
      color: var(--clr-gray-800);
    }

    .max-marks {
      font-weight: 400;
      color: var(--clr-gray-600);
    }

    .optional-tag {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--clr-gray-500);
      background: var(--clr-gray-100);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-sm);
    }

    .score-input,
    .feedback-textarea {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 2px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      font-size: var(--fs-400);
      color: var(--clr-gray-800);
      background: var(--clr-white);
      transition: border-color 0.15s;
      resize: vertical;
      box-sizing: border-box;
    }

    .score-input {
      max-width: 10rem;
    }

    .score-input:focus,
    .feedback-textarea:focus {
      outline: none;
      border-color: var(--clr-green-400);
    }

    .feedback-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .char-count {
      font-size: var(--fs-300);
      color: var(--clr-gray-500);
      white-space: nowrap;
      margin-left: auto;
    }

    .char-count.over-limit {
      color: var(--clr-red-500);
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .save-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.5rem;
      border-radius: var(--radius-md);
      background: var(--clr-green-400);
      color: var(--clr-white);
      font-size: var(--fs-400);
      font-weight: 600;
      cursor: pointer;
      transition:
        background 0.15s,
        transform 0.1s;
      border: none;
      margin-left: auto;
    }

    .save-btn:hover:not(:disabled) {
      background: var(--clr-green-600);
    }

    .save-btn:active:not(:disabled) {
      transform: scale(0.97);
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .saved-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-sm);
      background: var(--clr-emerald-50);
      color: var(--clr-green-500);
      font-size: var(--fs-300);
      font-weight: 700;
    }

    .save-error {
      font-size: var(--fs-300);
      color: var(--clr-red-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EssayAnswerGrading implements AnswerReviewContract, OnInit {
  readonly question = input.required<Question>();
  readonly answer = input<QuestionAnswer | null>(null);
  readonly graded = output<void>();

  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly essayAnswer = computed(() => this.answer() as EssayAnswer);

  protected form!: FormGroup<{
    score: FormControl<number | null>;
    feedback: FormControl<string | null>;
  }>;

  protected saving = false;
  protected saved = false;
  protected error: string | null = null;

  ngOnInit(): void {
    const manualAnswer = this.essayAnswer();
    const maxMarks = this.question().marks;

    this.form = new FormGroup({
      score: new FormControl<number | null>(manualAnswer?.score ?? null, [
        Validators.required,
        Validators.min(0),
        Validators.max(maxMarks),
      ]),
      feedback: new FormControl<string | null>(manualAnswer?.feedback ?? null, [
        CustomValidators.trimMinLength(3),
        CustomValidators.trimMaxLength(200),
      ]),
    });

    if (manualAnswer?.score !== null && manualAnswer?.score !== undefined) {
      this.saved = true;
    }
  }

  protected get scoreControl() {
    return this.form.controls.score;
  }

  protected get feedbackControl() {
    return this.form.controls.feedback;
  }

  protected get feedbackLength(): number {
    return (this.form.controls.feedback.value ?? '').length;
  }

  protected submitGrade(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const manualAnswer = this.essayAnswer();
    if (!manualAnswer) return;

    const score = this.form.controls.score.value!;
    const feedback = this.form.controls.feedback.value ?? undefined;

    this.saving = true;
    this.saved = false;
    this.error = null;

    this.quizAttemptService.gradeAnswer(manualAnswer.answerId, score, feedback).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        this.graded.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Grade Saved',
          detail: 'Essay response graded successfully.',
        });
        this.router.navigate(['/instructor/grade']);
      },
      error: () => {
        this.saving = false;
        this.error = 'Failed to save grade. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Grading Failed',
          detail: 'Failed to save grade. Please try again.',
        });
      },
    });
  }
}
