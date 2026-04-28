import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';

import {TfNotAnswerd} from '@Features/student/review-quiz/tf-not-answerd';
import { ProgressSpinner } from 'primeng/progressspinner';

import { McqAnswerReview } from './mcq-answer-review';
import { McqNotAnswerd } from './mcq-not-answerd';
import { ResultBanner } from './result-banner';
import { ReviewQuizHeader } from './review-quiz-header';
import { ReviewQuizStatusCard } from './review-quiz-status-card';
import {
  isMcqAnswer,
  isMcqQuestion,
  isTfAnswer,
  isTf,
  ReviewQuizStore,
} from './review-quiz.store';
import { TfAnswerReview } from './tf-answer-review';

@Component({
  selector: 'app-review-quiz',
  imports: [
    ProgressSpinner,
    ReviewQuizHeader,
    ResultBanner,
    ReviewQuizStatusCard,
    McqAnswerReview,
    TfAnswerReview,
    McqNotAnswerd,
    TfNotAnswerd,
  ],
  template: `
    <section class="review-page" aria-label="Quiz attempt review">
      @if (reviewQuizStore.isPending()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="Loading attempt review" />
        </div>
      } @else if (reviewQuizStore.error(); as errorMessage) {
        <div class="error" role="alert">{{ errorMessage }}</div>
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
              @if (isMcqQuestion(item.question)) {
                @if (isMcqAnswer(item.answer)) {
                  <app-mcq-answer-review
                    [question]="item.question"
                    [answer]="item.answer"
                    [questionNumber]="i + 1"
                  />
                } @else {
                  <app-mcq-not-answerd [question]="item.question" [questionNumber]="i + 1" />
                }
              } @else if (isTf(item.question)) {
                @if (isTfAnswer(item.answer)) {
                  <app-tf-answer-review
                    [question]="item.question"
                    [answer]="item.answer"
                    [questionNumber]="i + 1"
                  />
                } @else {
                  <app-tf-question-not-answerd
                    [question]="item.question"
                    [questionNumber]="i + 1"
                  />
                }
              }
            }
          </div>
        </section>
      } @else {
        <div class="error" role="alert">Attempt review is unavailable.</div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
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
  protected readonly isMcqQuestion = isMcqQuestion;
  protected readonly isTf = isTf;
  protected readonly isMcqAnswer = isMcqAnswer;
  protected readonly isTfAnswer = isTfAnswer;

  readonly attemptId = input.required<string>();

  ngOnInit(): void {
    this.reviewQuizStore.load({ attemptId: this.attemptId() });
  }
}
