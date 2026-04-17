import {Component, inject, Signal} from '@angular/core';
import {NgComponentOutlet} from '@angular/common';
import {AddQuestion} from './add-question';
import {QuizService} from '../../../shared/services/quiz.service';
import {QuestionHeader} from './question-header';
import {QuizHeader} from './quiz-header';
import {NoQuestions} from './no-questions';
import {CreateQuizStore} from './create-quiz.store';
import {Quiz} from '../../../shared/models/quiz/quiz.model';
import {QuizMetadata} from './quiz-metadata';

@Component({
  selector: 'app-create-quiz',
  imports: [AddQuestion, NgComponentOutlet, QuestionHeader, QuizHeader, NoQuestions, QuizMetadata],
  template: `
    <section class="create-quiz container">
      <header class="header">
        <div class="content">
          <h1 class="title">Create Quiz</h1>
          <p class="subtitle">Build your quiz by adding questions below</p>
        </div>
        <button type="button" class="btn btn-green" (click)="onPublishQuiz()">Publish Quiz</button>
      </header>
      <app-quiz-metadata></app-quiz-metadata>
      <app-quiz-header></app-quiz-header>
      @if (numberOfQuestions() > 0) {
        <div class="questions-list">
          @for (question of quiz().questions; track question.id) {
            <div
              #questionElement
              [id]="question.id"
              class="question"
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
                [ngComponentOutletInputs]="{ question: question }"
              ></ng-container>
            </div>
          }
        </div>
      }
      <app-add-question></app-add-question>
      @if (numberOfQuestions() === 0) {
        <app-no-questions></app-no-questions>
      }
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex: 5;
    }

    .create-quiz {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      background-color: var(--clr-gray-50);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;

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
    }

    .metadata-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.9fr);
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: 1.25rem;
      background: var(--clr-white);
      box-shadow: 0 12px 32px rgb(15 23 42 / 8%);

      @media (width < 768px) {
        grid-template-columns: 1fr;
      }
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
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

    .question {
      padding: 1rem;
      border-top: 1px solid var(--clr-gray-500);
      border-bottom: 1px solid var(--clr-gray-500);
      border-right: 1px solid var(--clr-gray-500);
      border-left: 6px solid var(--clr-green-500);
      border-radius: var(--radius-md);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
      0 10px 10px -5px rgb(0 0 0 / 4%);
    }
  `,
})
export class CreateQuiz {
  protected readonly quizService = inject(QuizService);
  protected readonly createQuizStore = inject(CreateQuizStore);
  protected readonly quiz: Signal<Quiz> = this.createQuizStore.quiz as Signal<Quiz>;
  protected readonly numberOfQuestions: Signal<number> = this.createQuizStore
    .numberOfQuestions as Signal<number>;

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
}
