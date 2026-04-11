import { Component, inject, input } from '@angular/core';
import { QuestionType } from '../../../shared/models/quiz/question.model';
import { NgComponentOutlet } from '../../../../../node_modules/@angular/common/types/_common_module-chunk';
import { QuizService } from '../../../shared/services/quiz.service';

@Component({
  selector: 'app-question-attempt-header',
  imports: [NgComponentOutlet],
  template: `
    <header class="question-attempt-header">
      <ng-container
        [ngComponentOutlet]="quizService.getSuitableQuestionTag(questionType())"
      ></ng-container>

      <span class="flag" role="status" aria-label="Flag question">
        <i class="fa-regular fa-circle-exclamation" aria-hidden="true"></i>
        <span>Flag</span>
      </span>
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
      color: var(--clr-gray-500);
      font-size: var(--fs-600);
      font-weight: 500;
      line-height: 1;
    }
  `,
})
export class QuestionAttemptHeader {
  protected readonly quizService = inject(QuizService);
  readonly questionType = input.required<QuestionType>();
}
