import { NgComponentOutlet } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';

import { ObserveVisibilityDirective } from '@shared/directives/observe-visibility.directive';
import { Quiz } from '@shared/models/quiz/quiz.model';
import { QuizService } from '@shared/services/quiz.service';

import { AddQuestion } from './add-question';
import { CreateQuizStore } from './create-quiz.store';
import { NoQuestions } from './no-questions';
import { QuestionHeader } from './question-header';
import { QuestionsOutline } from './questions-outline';
import { QuizHeader } from './quiz-header';
import { QuizMetadata } from './quiz-metadata';

@Component({
  selector: 'app-create-quiz',
  imports: [
    AddQuestion,
    NgComponentOutlet,
    QuestionHeader,
    QuizHeader,
    NoQuestions,
    QuizMetadata,
    ObserveVisibilityDirective,
    QuestionsOutline,
  ],
  template: `
    <section class="create-quiz">
      <div class="outline">
        @if (numberOfQuestions() > 0) {
          <app-questions-outline></app-questions-outline>
        } @else {
          <div class="empty-outline-placeholder">
            <p class="placeholder-text">Your quiz outline will appear here as you add questions.</p>
          </div>
        }
      </div>
      <main class="main">
        <header class="header">
          <div class="content">
            <h1 class="title">Create Quiz</h1>
            <p class="subtitle">Build your quiz by adding questions below</p>
          </div>
          <button
            class="btn btn-green"
            [disabled]="!createQuizStore.isEntireQuizValid()"
            (click)="onPublishQuiz()"
            type="button"
          >
            Publish Quiz
          </button>
        </header>
        <app-quiz-metadata></app-quiz-metadata>
        <app-quiz-header></app-quiz-header>
        <div class="questions-workspace">
          <div class="questions-content">
            <div class="questions-list">
              @for (question of quiz().questions; track question.id) {
                <div
                  class="question"
                  [id]="question.id"
                  [threshold]="0.45"
                  (visible)="onQuestionVisibilityChanged($event, question.id)"
                  appObserveVisibility
                  animate.enter="element-enter"
                  animate.leave="element-leave"
                >
                  <app-question-header [index]="$index" [question]="question">
                    <ng-container
                      [ngComponentOutlet]="quizService.getSuitableQuestionTag(question.type)"
                    >
                    </ng-container>
                  </app-question-header>
                  <ng-container
                    [ngComponentOutlet]="quizService.getSuitableQuestionComponent(question.type)"
                    [ngComponentOutletInputs]="{ index: $index }"
                  ></ng-container>
                </div>
              }
            </div>

            <div
              class="add-question-main"
              (visible)="onAddQuestionButtonVisible($event)"
              appObserveVisibility
            >
              <app-add-question></app-add-question>
            </div>
            @if (!isAddQuestionButtonVisible()) {
              <div class="add-question-sticky-container">
                <app-add-question
                  class="pill-style"
                  animate.leave="float-add-question-button-leave"
                  animate.enter="float-add-question-button-enter"
                >
                </app-add-question>
              </div>
            }
            @if (numberOfQuestions() === 0) {
              <app-no-questions></app-no-questions>
            }
          </div>
        </div>
      </main>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .create-quiz {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
      gap: 1.5rem;
      width: 100%;
      background-color: var(--clr-gray-50);
      padding: 2rem;
    }

    .main {
      display: grid;
      gap: 1.5rem;
    }

    .empty-outline-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 1rem;
      color: var(--clr-gray-500);
      border: 1px dashed var(--clr-gray-300);
      border-radius: 1rem;
      background-color: var(--clr-white);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem;
      min-width: 0;

      .content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .title {
          font-family: var(--ff-heading), sans-serif;
          font-size: clamp(2rem, 4vw, var(--fs-700));
          font-weight: 700;
        }

        .subtitle {
          color: var(--clr-gray-600);
          font-size: var(--fs-500);
        }
      }

      @media (width < 640px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 1rem 1.1rem;
      border: 1px solid var(--clr-gray-500);
      border-radius: 1rem;
      background: var(--clr-gray-50);
      color: var(--clr-blue-900);
    }

    textarea {
      resize: vertical;
      min-height: 4.75rem;
    }

    input,
    textarea {
      &::placeholder {
        color: var(--clr-gray-500);
      }
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .questions-workspace {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;
      align-items: start;
    }

    .questions-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-width: 0;
    }
    .btn.btn-green:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (width >= 1024px) {
      app-questions-outline {
        position: sticky;
        top: 1rem;
        align-self: start;
      }
    }

    .question {
      padding: 1rem;
      border: 1px solid var(--clr-gray-500);
      border-left: 6px solid var(--clr-green-500);
      border-radius: var(--radius-md);
      /*box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),*/
      /*0 10px 10px -5px rgb(0 0 0 / 4%);*/
    }

    .float-add-question-button-enter {
      animation: float-add-question-button-enter 0.5s;
    }

    .float-add-question-button-leave {
      pointer-events: none;
      animation: float-add-question-button-leave 0.5s;
    }

    @keyframes float-add-question-button-enter {
      from {
        opacity: 0;
        transform: translateY(0.6rem) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes float-add-question-button-leave {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(0.4rem) scale(0.96);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .float-add-question-button-enter,
      .float-add-question-button-leave {
        animation-duration: 1ms;
      }
    }
  `,
})
export class CreateQuiz {
  protected readonly quizService = inject(QuizService);
  protected readonly createQuizStore = inject(CreateQuizStore);
  protected readonly quiz: Signal<Quiz> = this.createQuizStore.quiz as Signal<Quiz>;
  protected readonly numberOfQuestions: Signal<number> = this.createQuizStore
    .numberOfQuestions as Signal<number>;
  protected readonly isAddQuestionButtonVisible = signal(true);

  protected onPublishQuiz() {
    if (this.createQuizStore.validateAll()) {
      this.quizService.createQuiz(this.createQuizStore.quiz()).subscribe({
        next: (response) => {
          console.log('Quiz published successfully', response);
          globalThis.alert('Quiz published successfully.');
        },
        error: (error) => {
          console.error('Error publishing quiz', error);
        },
      });
    }
  }

  protected onAddQuestionButtonVisible(isVisible: boolean) {
    this.isAddQuestionButtonVisible.set(isVisible);
  }

  protected onQuestionVisibilityChanged(isVisible: boolean, questionId: string) {
    if (!isVisible) {
      return;
    }

    this.createQuizStore.setCurrentQuestionId(questionId);
  }
}
