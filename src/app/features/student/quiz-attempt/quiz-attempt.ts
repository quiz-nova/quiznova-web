import { Component, computed, inject, input, signal } from '@angular/core';
import { AttemptButton } from './attempt-button';
import { NavigationButtons } from './navigation-buttons';
import { QuestionsNavigator } from './questions-navigator';
import { QuizAttemptHeader } from './quiz-attempt-header';
import { rxResource } from '@angular/core/rxjs-interop';
import { QuizService } from '../../../shared/services/quiz.service';
import { QuestionAttemptHeader } from './question-attempt-header';
import { NgComponentOutlet } from '../../../../../node_modules/@angular/common/types/_common_module-chunk';
import { QuestionsProgrssBar } from './questions-progrss-bar';

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
      <app-quiz-attempt-header
        class="attempt-header"
        [quiz]="quizResource.hasValue() ? quizResource.value() : null"
        [currentQuestionIndex]="currentChoiceIndex()"
        [numberOfSolvedQuestions]="numberOfSolvedQuestions()"
      />

      <div class="attempt-main">
        <div class="question-column" aria-label="Question area">
          @for (question of questions(); track $index) {
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
export class QuizAttempt {
  protected readonly quizService = inject(QuizService);
  protected readonly questions = computed(() =>
    this.quizResource.hasValue() ? this.quizResource.value().questions : [],
  );
  protected readonly currentChoiceIndex = signal(0);
  protected readonly numberOfSolvedQuestions = signal(0);
  readonly quizId = input.required<string>();
  readonly quizResource = rxResource({
    stream: () => this.quizService.getQuizById(this.quizId()),
  });
}
