import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProgressSpinner } from 'primeng/progressspinner';

import { Button } from '@shared/components/button/button';
import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { QuestionComponentMapperService } from '@shared/services/question-component-mapper.service';

import { QuestionAttemptHeader } from './question-attempt-header';
import { QuestionsNavigator } from './questions-navigator';
import { QuestionsProgressBar } from './questions-progress-bar';
import { QuizAttemptHeader } from './quiz-attempt-header';
import { QuizAttemptStore } from './quiz-attempt.store';
import { QuizFinishedMessage } from './quiz-finished-message';

@Component({
  selector: 'app-quiz-attempt',
  host: {
    '(window:beforeunload)': 'unloadNotification($event)',
  },
  imports: [
    QuizAttemptHeader,
    QuestionsNavigator,
    NavigationButtons,
    QuestionAttemptHeader,
    NgComponentOutlet,
    QuestionsProgressBar,
    ProgressSpinner,
    OperationFailed,
    Button,
    QuizFinishedMessage,
  ],
  providers: [QuizAttemptStore],
  template: `
    <section class="attempt-layout" aria-label="Quiz attempt layout">
      @if (quizAttemptStore.isPending()('load')) {
        <div class="spinner-container">
          <p-progress-spinner ariaLabel="Loading quiz attempt" />
        </div>
      } @else if (quizAttemptStore.error()('load'); as errorMessage) {
        <app-operation-failed>
          <p>{{ errorMessage }}</p>
        </app-operation-failed>
      } @else if (quizAttemptStore.isFulfilled()('submit')) {
        <app-quiz-finished-message (seeResults)="goToResults()" />
      } @else {
        <app-quiz-attempt-header />

        @if (quizAttemptStore.error()('submit'); as submitErrorMessage) {
          <app-operation-failed>
            <p>{{ submitErrorMessage }}</p>
          </app-operation-failed>
        }

        <div class="attempt-main">
          <div class="question-column" aria-label="Question area">
            @let question =
              quizAttemptStore.quizQuestions()[quizAttemptStore.currentQuestionIndex()];

            <app-question-attempt-header
              [questionType]="question.type"
            ></app-question-attempt-header>

            <ng-container
              [ngComponentOutlet]="
                questionMapperService.getSuitableQuestionAttemptComponent(question.type)
              "
              [ngComponentOutletInputs]="{
                question: question,
              }"
            ></ng-container>

            <app-navigation-buttons
              [canGoPrevious]="quizAttemptStore.canGoPrevious()"
              [canGoNext]="quizAttemptStore.canGoNext()"
              (previousButtonClicked)="quizAttemptStore.GoToPreviousQuestion()"
              (nextButtonClicked)="quizAttemptStore.GoToNextQuestion()"
              ariaLabel="Question navigation"
            />
          </div>

          <aside class="sidebar-column" aria-label="Quiz tools">
            <app-questions-navigator />
            <app-questions-progress-bar />
            <button
              [loading]="quizAttemptStore.isPending()('submit')"
              (click)="quizAttemptStore.SubmitQuiz()"
              appButton
              variant="red"
              style="width: 100%"
              type="button"
            >
              Submit Quiz
            </button>
          </aside>
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
    }

    .attempt-layout {
      display: grid;
      gap: 1rem;
      width: min(100%, 70rem);
      margin: 0 auto;
    }

    .attempt-main {
      display: grid;
      gap: 1rem;
      grid-template-columns: 2fr 1fr;
      align-items: start;
    }

    .question-column,
    .sidebar-column {
      display: grid;
      gap: 1rem;
    }

    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 20rem;
    }

    @media (width <= 64rem) {
      .attempt-main {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAttempt implements OnInit {
  protected readonly questionMapperService = inject(QuestionComponentMapperService);
  protected readonly quizId = input.required<string>();
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  private readonly router = inject(Router);

  ngOnInit() {
    this.quizAttemptStore.load({ quizId: this.quizId() });
  }

  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.isQuizInProgress()) {
      $event.preventDefault();
    }
  }

  canDeactivate(): boolean {
    if (this.isQuizInProgress()) {
      return confirm(
        'Are you sure you want to leave? Your progress will be lost and the quiz will not be submitted.',
      );
    }
    return true;
  }

  protected goToResults(): void {
    this.router.navigate(['/student/results']);
  }

  private isQuizInProgress(): boolean {
    const store = this.quizAttemptStore;
    const isLoaded = !store.isPending()('load') && !store.error()('load');
    const isSubmitted = store.isFulfilled()('submit');
    return isLoaded && !isSubmitted;
  }
}
