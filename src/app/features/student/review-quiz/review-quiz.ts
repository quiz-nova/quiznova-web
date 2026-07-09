import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';

import { ProgressSpinner } from 'primeng/progressspinner';

import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { QuestionComponentMapperService } from '@shared/services/question-component-mapper.service';

import { ResultBanner } from './result-banner';
import { ReviewQuizHeader } from './review-quiz-header';
import { ReviewQuizStatusCard } from './review-quiz-status-card';
import { ReviewQuizStore } from './review-quiz.store';

@Component({
  selector: 'app-review-quiz',
  imports: [
    ProgressSpinner,
    ReviewQuizHeader,
    ResultBanner,
    ReviewQuizStatusCard,
    NgComponentOutlet,
    OperationFailed,
  ],
  template: `
    <section class="review-page" aria-label="Quiz attempt review">
      @if (reviewQuizStore.isPending()('load')) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="Loading attempt review" />
        </div>
      } @else if (reviewQuizStore.error()('load'); as errorMessage) {
        <app-operation-failed>
          <p>{{ errorMessage }}</p>
        </app-operation-failed>
      } @else if (reviewQuizStore.quizAttempt()) {
        <app-review-quiz-header />

        <app-result-banner />
        <app-review-quiz-status-card />

        <section class="review-questions" aria-label="Question-by-question review">
          <h2 class="review-questions__title">Question-by-Question Review</h2>

          <div class="review-questions__list">
            @for (
              item of reviewQuizStore.questionReviewItems();
              track item.question.id;
              let i = $index
            ) {
              @if (item.answer) {
                <ng-container
                  [ngComponentOutlet]="
                    mapperService.getSuitableStudentAnswerReviewComponent(item.question.type)
                  "
                  [ngComponentOutletInputs]="{
                    question: item.question,
                    answer: item.answer,
                    questionNumber: i + 1,
                  }"
                ></ng-container>
              } @else {
                <ng-container
                  [ngComponentOutlet]="
                    mapperService.getSuitableQuestionNotAnsweredComponent(item.question.type)
                  "
                  [ngComponentOutletInputs]="{ question: item.question, questionNumber: i + 1 }"
                ></ng-container>
              }
            }
          </div>
        </section>
      } @else {
        <app-operation-failed>
          <p>Attempt review is unavailable.</p>
        </app-operation-failed>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--clr-gray-50);
    }

    .review-page {
      width: min(100%, 76rem);
      margin: 0 auto;
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }

    .review-questions {
      display: grid;
      gap: 0.75rem;
    }

    .review-questions__title {
      margin: 0;
      font-size: 1.1rem;
      color: var(--clr-blue-900);
    }

    .review-questions__list {
      display: grid;
      gap: 0.75rem;
    }

    @media (width <= 40rem) {
      .review-page {
        padding: 0.75rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewQuiz implements OnInit {
  protected readonly reviewQuizStore = inject(ReviewQuizStore);
  protected readonly mapperService = inject(QuestionComponentMapperService);

  readonly attemptId = input.required<string>();

  ngOnInit(): void {
    this.reviewQuizStore.load({ attemptId: this.attemptId() });
  }
}
