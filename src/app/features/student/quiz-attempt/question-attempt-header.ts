import { NgComponentOutlet } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { QuestionType } from '@shared/models/quiz/question.model';
import { QuizService } from '@shared/services/quiz.service';

import { QuizAttemptStore } from './quiz-attempt.store';

@Component({
  selector: 'app-question-attempt-header',
  imports: [NgComponentOutlet],
  template: `
    <header class="question-attempt-header">
      <ng-container
        [ngComponentOutlet]="quizService.getSuitableQuestionTag(questionType())"
      ></ng-container>

      <button
        class="flag btn"
        [class.flagged]="quizAttemptStore.isCurrentQuestionFlagged()"
        (click)="onClickFlag()"
        type="button"
        aria-label="Flag question"
      >
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        @if (quizAttemptStore.isCurrentQuestionFlagged()) {
          <span>Unflag</span>
        } @else {
          <span>Flag</span>
        }
      </button>
    </header>
  `,
  styles: `
    .question-attempt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .flag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: var(--radius-lg);
      background-color: var(--clr-gray-100);
      color: var(--clr-gray-600);
      font-size: var(--fs-600);
      font-weight: 500;
      line-height: 1;
    }

    .flagged {
      border-color: var(--clr-yellow-500);
      background-color: var(--clr-yellow-500);
      color: var(--clr-red-500);
    }
  `,
})
export class QuestionAttemptHeader {
  protected readonly quizService = inject(QuizService);
  protected quizAttemptStore = inject(QuizAttemptStore);
  readonly questionType = input.required<QuestionType>();
  onClickFlag(): void {
    this.quizAttemptStore.changeFlagStatusForTheCurrentQuestion();
  }
}
