import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Question, type QuestionComponent } from '../../../shared/models/quiz/question.model';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateQuizService } from '../create-quiz.service';
import { MultipleChoiceQuestion } from '../../../shared/models/quiz/multiple-choice.model';
import { QuestionTitle } from '../question-title/question-title';

@Component({
  selector: 'app-multiple-choice',
  imports: [ReactiveFormsModule, QuestionTitle],
  template: `
    <div class="mcq-question-container">
      <form [formGroup]="form" class="mcq-question-form">
        <!-- Choices FormArray -->
        <div formArrayName="choices" class="radio-group">
          <app-question-title [formGroup]="form"></app-question-title>
          @for (choiceControl of choicesArray.controls; track $index) {
            @let choiceData = multipleChoiceQuestion().choices[$index];

            <div class="radio-item" animate.enter="element-enter" animate.leave="element-leave">
              <div class="radio-item-input">
                <input type="radio" id="choice-radio-{{ $index }}" [value]="choiceData.id" />
                <input
                  type="text"
                  [formControlName]="$index"
                  [id]="'choice-text-' + $index"
                  class="choice-input"
                  placeholder="Enter choice text..."
                />
              </div>

              <button
                type="button"
                class="delete-choice-button delete-button"
                (click)="onDeleteChoice($index)"
                [class.disabled]="choicesArray.length <= 2"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          }
        </div>
      </form>
      <button type="button" class="btn btn-gray" (click)="onAddChoice()">+Add Choice</button>
    </div>
  `,
  styles: `
    .mcq-question-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .mcq-question-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .disabled {
      display: none;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .radio-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .radio-item-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;

      input.choice-input {
        padding: 0.5rem;
        max-width: 100%;
        border: 1px solid var(--clr-gray-500);
        border-radius: var(--radius-md);
        background-color: var(--clr-white);
        flex: 1;

        &:focus {
          outline: none;
          border: 3px solid var(--clr-green-500);
        }
      }

      span {
        padding: 0.25rem;
      }
    }

    .editable-label {
      display: block;
      max-width: 100%;
      max-height: 8rem;
      max-block-size: 4rem;
      white-space: pre-wrap;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `,
})
export class MultipleChoice implements QuestionComponent, OnInit {
  quizService = inject(CreateQuizService);
  question = input.required<Question>();
  multipleChoiceQuestion = computed(() => this.question() as MultipleChoiceQuestion);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    questionText: ['', [Validators.required]],
    choices: this.fb.array<FormControl<string>>([]),
    correctChoiceId: [''],
  });

  get choicesArray(): FormArray {
    return this.form.get('choices') as FormArray;
  }

  ngOnInit() {
    this.multipleChoiceQuestion().choices.forEach((choice) => {
      this.choicesArray.push(this.fb.nonNullable.control(choice.text, Validators.required));
    });
  }
  onAddChoice() {
    this.choicesArray.push(this.fb.nonNullable.control('', Validators.required));
    this.quizService.addChoiceToMultipleChoiceQuestion(this.question().id);
  }
  onDeleteChoice(index: number) {
    this.choicesArray.removeAt(index);
    const choiceId = this.multipleChoiceQuestion().choices[index].id;
    this.quizService.deleteChoiceFromMultipleChoiceQuestion(this.question().id, choiceId);
  }
}
