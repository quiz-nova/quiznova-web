import { NgComponentOutlet } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';

import { QuizService } from '@shared/services/quiz.service';

import { AttemptButton } from './attempt-button';
import { NavigationButtons } from './navigation-buttons';
import { QuestionAttemptHeader } from './question-attempt-header';
import { QuestionsNavigator } from './questions-navigator';
import { QuestionsProgrssBar } from './questions-progrss-bar';
import { QuizAttemptHeader } from './quiz-attempt-header';
import { QuizAttemptStore } from './quiz-attempt.store';

@Component({
  selector: 'app-quiz-attempt',
  imports: [
    QuizAttemptHeader,
    QuestionsNavigator,
    AttemptButton,
    NavigationButtons,
    QuestionAttemptHeader,
    NgComponentOutlet,
    QuestionsProgrssBar,
  ],
  template: `
    <section class="attempt-layout" aria-label="Quiz attempt layout">
      <app-quiz-attempt-header />

      <div class="attempt-main">
        <div class="question-column" aria-label="Question area">
          @for (question of quizAttemptStore.quizQuestions(); track $index) {
            <app-question-attempt-header
              [questionType]="question.type"
            ></app-question-attempt-header>

            <ng-container
              [ngComponentOutlet]="quizService.getSuitableQuestionAttemptComponent(question.type)"
            ></ng-container>
          }
          <app-navigation-buttons />
        </div>

        <aside class="sidebar-column" aria-label="Quiz tools">
          <app-questions-navigator />
          <app-questions-progrss-bar />
          <app-attempt-button />
        </aside>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      width: 100%;
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

    @media (width <= 64rem) {
      .attempt-main {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class QuizAttempt implements OnInit {
  protected readonly quizService = inject(QuizService);
  protected readonly quizId = input.required<string>();
  protected readonly quizAttemptStore = inject(QuizAttemptStore);

  ngOnInit() {
    this.quizAttemptStore.load({ quizId: this.quizId() });
  }
}
