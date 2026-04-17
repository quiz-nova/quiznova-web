import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {type QuestionComponent} from '../../../shared/models/quiz/question-component.contracts';
import {Question} from '../../../shared/models/quiz/question.model';
import {QuestionTitle} from './question-title';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TrueFalseQuestion} from '../../../shared/models/quiz/true-false.model';
import {CreateQuizStore} from './create-quiz.store';
import {RadioButton} from 'primeng/radiobutton';

type TrueFalseQuestionFormGroup = FormGroup<{
  text: FormControl<string>;
  answer: FormControl<boolean | null>;
}>;

@Component({
  selector: 'app-true-false',
  imports: [ReactiveFormsModule, QuestionTitle, RadioButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="true-false-container">
      <form [formGroup]="trueFalseQuestionForm">
        <app-question-title [control]="textControl"></app-question-title>
        <p>Correct Answer:</p>
        <div class="true-false-options">
          <label class="answer-option" for="answerTrue">
            <p-radiobutton
              inputId="answerTrue"
              name="answer"
              [formControl]="answerControl"
              [value]="true"></p-radiobutton>
            <span>True</span>
          </label>
          <label class="answer-option" for="answerFalse">
            <p-radiobutton
              inputId="answerFalse"
              name="answer"
              [formControl]="answerControl"
              [value]="false"></p-radiobutton>
            <span>False</span>
          </label>
        </div>

        <div class="question-error">
          @if (answerControl.invalid && answerControl.touched) {
            @if (answerControl.hasError('required')) {
              <span>Please select the correct answer.</span>
            }
          }
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .true-false-options {
        display: flex;
        gap: 1rem;
      }

      .answer-option {
        font-size: var(--fs-400);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }

      .question-error {
        min-height: 1rem;
        color: var(--clr-red-500);
        font-size: var(--fs-300);
      }
    `,
  ],
})
export class TrueFalse implements QuestionComponent, OnInit, OnDestroy {
  readonly question = input.required<Question>();
  private readonly createQuizStore = inject(CreateQuizStore);
  protected readonly TrueFalseQuestion = computed(() => this.question() as TrueFalseQuestion);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly trueFalseQuestionForm: TrueFalseQuestionFormGroup = this.fb.group({
    text: ['', [Validators.required]],
    answer: [null as boolean | null, [Validators.required]],
  });

  protected get textControl() {
    return this.trueFalseQuestionForm.controls.text;
  }

  protected get answerControl() {
    return this.trueFalseQuestionForm.controls.answer;
  }

  ngOnInit() {
    this.trueFalseQuestionForm.patchValue({
      text: this.TrueFalseQuestion().questionText,
      answer: this.TrueFalseQuestion().correctChoice,
    });

    this.createQuizStore.registerForm(this.trueFalseQuestionForm);
  }

  ngOnDestroy() {
    this.createQuizStore.unregisterForm(this.trueFalseQuestionForm);
  }
}
