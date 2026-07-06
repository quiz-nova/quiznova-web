import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  Signal,
  viewChildren,
} from '@angular/core';

import { AddQuestion } from '@Features/instructor/create-quiz/add-question';
import { CreateQuiz as CreateQuizModel } from '@Features/instructor/create-quiz/create-quiz.model';
import { CreateQuizStore } from '@Features/instructor/create-quiz/create-quiz.store';
import { NoQuestions } from '@Features/instructor/create-quiz/no-questions';
import { QuestionHeader } from '@Features/instructor/create-quiz/question-header';
import { QuestionsOutline } from '@Features/instructor/create-quiz/questions-outline';
import { QuestionsOutlinePlaceholder } from '@Features/instructor/create-quiz/questions-outline-placeholder';
import { QuizHeader } from '@Features/instructor/create-quiz/quiz-header';
import { QuizMetadataForm } from '@Features/instructor/create-quiz/quiz-metadata-form';
import { QuizPublishPanel } from '@Features/instructor/create-quiz/quiz-publish-panel';

import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { ObserveVisibilityDirective } from '@shared/directives/observe-visibility.directive';
import { QuestionFormContract } from '@shared/models/quiz/question-component.contracts';
import { QuestionComponentMapperService } from '@shared/services/question-component-mapper.service';
import { QuizService } from '@shared/services/quiz.service';

@Component({
  selector: 'app-create-quiz',
  imports: [
    AddQuestion,
    QuestionHeader,
    QuizHeader,
    NoQuestions,
    QuizMetadataForm,
    ObserveVisibilityDirective,
    QuestionsOutline,
    QuestionsOutlinePlaceholder,
    QuizPublishPanel,
    NgComponentOutlet,
    RoleDashboardHeader,
  ],
  template: `
    <section class="create-quiz">
      <div class="outline">
        @if (numberOfQuestions() > 0) {
          <app-questions-outline
            (questionSelect)="createQuizStore.setCurrentQuestionId($event)"
          ></app-questions-outline>
        } @else {
          <app-questions-outline-placeholder />
        }
      </div>
      <main class="main">
        <header class="header">
          <app-role-dashboard-header
            title="Create Quiz"
            description="Build your quiz by adding questions below"
          />
          <app-quiz-publish-panel (publish)="onPublishQuiz()" />
        </header>
        <app-quiz-metadata-form
          (formReady)="createQuizStore.registerForm($event)"
          (formDestroyed)="createQuizStore.unregisterForm($event)"
          (valueChange)="createQuizStore.setHeaderMetadata($event)"
          (courseIdChanged)="onCourseIdChanged($event)"
        ></app-quiz-metadata-form>
        <app-quiz-header />
        <div class="questions-workspace">
          <div class="questions-content">
            <div class="questions-list">
              @for (question of quiz().questions; track question.id; let index = $index) {
                <div
                  class="question"
                  [id]="question.id"
                  [threshold]="0.45"
                  (visible)="onQuestionVisibilityChanged($event, question.id)"
                  appObserveVisibility
                  animate.enter="element-enter"
                  animate.leave="element-leave"
                >
                  <app-question-header
                    [index]="index"
                    [question]="question"
                    [maxMarks]="getMaxMarksForQuestion(question.marks)"
                    (deleteQuestion)="createQuizStore.removeQuestion($event)"
                    (marksChange)="
                      createQuizStore.updateQuestionMarks($event.questionId, $event.marks)
                    "
                  >
                    <ng-container
                      [ngComponentOutlet]="mapperService.getSuitableQuestionTag(question.type)"
                    ></ng-container>
                  </app-question-header>

                  <ng-container
                    [ngComponentOutlet]="
                      mapperService.getSuitableQuestionFormComponent(question.type)
                    "
                    [ngComponentOutletInputs]="{ initialData: question }"
                  ></ng-container>
                </div>
              }
            </div>

            <div
              class="add-question-main"
              (visible)="onAddQuestionButtonVisible($event)"
              appObserveVisibility
            >
              <app-add-question
                (questionAdded)="createQuizStore.addQuestion($event)"
              ></app-add-question>
            </div>
            @if (!isAddQuestionButtonVisible()) {
              <div class="add-question-sticky-container">
                <app-add-question
                  class="pill-style"
                  (questionAdded)="createQuizStore.addQuestion($event)"
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
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;
      width: 100%;
      background-color: var(--clr-gray-50);
      padding: clamp(1rem, 3vw, 2rem);

      @media (width >= 1024px) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
      }
    }

    .main {
      display: grid;
      gap: 1.5rem;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem;
      min-width: 0;

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
      border-radius: var(--radius-lg);
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

    .question {
      padding: 1rem;
      border: 1px solid var(--clr-gray-500);
      border-left: 6px solid var(--clr-green-400);
      border-radius: var(--radius-md);
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

    .add-question-sticky-container {
      position: fixed;
      right: clamp(1rem, 2vw, 2rem);
      bottom: 1.25rem;
      z-index: 1100;
      pointer-events: none;
    }

    @media (width < 960px) {
      .add-question-sticky-container {
        right: 1rem;
        left: 1rem;
        display: flex;
        justify-content: center;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateQuizStore],
})
export class CreateQuiz {
  protected readonly quizService = inject(QuizService);
  protected readonly mapperService = inject(QuestionComponentMapperService);
  protected readonly createQuizStore = inject(CreateQuizStore);
  protected readonly quiz: Signal<CreateQuizModel> = this.createQuizStore
    .quiz as Signal<CreateQuizModel>;
  protected readonly numberOfQuestions: Signal<number> = this.createQuizStore
    .numberOfQuestions as Signal<number>;
  protected readonly isAddQuestionButtonVisible = signal(true);

  private readonly formOutlets = viewChildren(NgComponentOutlet);

  constructor() {
    effect((onCleanup) => {
      const activeOutlets = this.formOutlets();
      const activeSubscriptions: { unsubscribe(): void }[] = [];

      activeOutlets.forEach((outlet) => {
        const instance = outlet.componentInstance as QuestionFormContract | null;
        if (instance) {
          if (instance.formReady) {
            activeSubscriptions.push(
              instance.formReady.subscribe((form) => this.createQuizStore.registerForm(form)),
            );
          }
          if (instance.formDestroyed) {
            activeSubscriptions.push(
              instance.formDestroyed.subscribe((form) => this.createQuizStore.unregisterForm(form)),
            );
          }
          if (instance.valueChange) {
            activeSubscriptions.push(
              instance.valueChange.subscribe((q) => this.createQuizStore.updateQuestion(q)),
            );
          }
          if (instance.blurEvent) {
            activeSubscriptions.push(
              instance.blurEvent.subscribe((q) => this.createQuizStore.updateQuestion(q)),
            );
          }
          if (instance.questionTextBlur) {
            activeSubscriptions.push(
              instance.questionTextBlur.subscribe((event) =>
                this.createQuizStore.updateQuestionText(event.questionId, event.text),
              ),
            );
          }
          if (instance.deleteChoice) {
            activeSubscriptions.push(
              instance.deleteChoice.subscribe((event) =>
                this.createQuizStore.deleteChoiceFromMcq(event.questionId, event.choiceId),
              ),
            );
          }
        }
      });

      onCleanup(() => {
        activeSubscriptions.forEach((sub) => sub.unsubscribe());
      });
    });
  }

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

  protected onCourseIdChanged(courseId: string) {
    this.createQuizStore.updateCourseId(courseId);
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

  protected getMaxMarksForQuestion(currentMarks: number): number {
    const effectiveRemaining = this.createQuizStore.effectiveRemainingMarks();
    if (effectiveRemaining === null) {
      return 5;
    }
    return Math.min(5, currentMarks + effectiveRemaining);
  }
}
