import { Component, inject, signal, Signal } from '@angular/core';

import { CreateQuizStore } from '@Features/instructor/create-quiz/create-quiz.store';
import { AddQuestion } from '@Features/instructor/shared/add-question';
import { McqForm } from '@Features/instructor/shared/mcq-form';
import { NoQuestions } from '@Features/instructor/shared/no-questions';
import { QuestionHeader } from '@Features/instructor/shared/question-header';
import { QuestionsOutline } from '@Features/instructor/shared/questions-outline';
import { QuizHeader } from '@Features/instructor/shared/quiz-header';
import { QuizMetadataForm } from '@Features/instructor/shared/quiz-metadata-form';
import { TfForm } from '@Features/instructor/shared/tf-form';

import { McqTag } from '@shared/components/questions-tags/mcq-tag';
import { TfTag } from '@shared/components/questions-tags/tf-tag';
import { ObserveVisibilityDirective } from '@shared/directives/observe-visibility.directive';
import { CreateQuiz as CreateQuizModel } from '@shared/models/quiz/create-quiz.model';
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
    McqForm,
    TfForm,
    McqTag,
    TfTag,
  ],
  template: `
    <section class="create-quiz">
      <div class="outline">
        @if (numberOfQuestions() > 0) {
          <app-questions-outline
            [questions]="quiz().questions"
            [activeQuestionId]="createQuizStore.activeQuestionId()"
            [remainingMarks]="createQuizStore.effectiveRemainingMarks()"
            (questionSelect)="createQuizStore.setCurrentQuestionId($event)"
          ></app-questions-outline>
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
        <app-quiz-metadata-form
          (formReady)="createQuizStore.registerForm($event)"
          (formDestroyed)="createQuizStore.unregisterForm($event)"
          (valueChange)="createQuizStore.setHeaderMetadata($event)"
          (courseIdChanged)="onCourseIdChanged($event)"
        ></app-quiz-metadata-form>
        <app-quiz-header
          [numberOfQuestions]="numberOfQuestions()"
          [totalMarks]="createQuizStore.totalMarks()"
          [remainingMarks]="createQuizStore.effectiveRemainingMarks()"
        ></app-quiz-header>
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
                    @switch (question.type) {
                      @case ('mcq') {
                        <app-mcq-tag></app-mcq-tag>
                      }
                      @case ('tf') {
                        <app-tf-tag></app-tf-tag>
                      }
                    }
                  </app-question-header>

                  @switch (question.type) {
                    @case ('mcq') {
                      <app-mcq-form
                        [initialData]="question"
                        (formReady)="createQuizStore.registerForm($event)"
                        (formDestroyed)="createQuizStore.unregisterForm($event)"
                        (blurEvent)="createQuizStore.updateQuestion($event)"
                      ></app-mcq-form>
                    }
                    @case ('tf') {
                      <app-tf-form
                        [initialData]="question"
                        (formReady)="createQuizStore.registerForm($event)"
                        (formDestroyed)="createQuizStore.unregisterForm($event)"
                        (blurEvent)="createQuizStore.updateQuestion($event)"
                      ></app-tf-form>
                    }
                  }
                </div>
              }
            </div>

            <div
              class="add-question-main"
              (visible)="onAddQuestionButtonVisible($event)"
              appObserveVisibility
            >
              <app-add-question
                [quizId]="quiz().id"
                [disabled]="!createQuizStore.canAddMoreQuestions()"
                [remainingMarks]="createQuizStore.effectiveRemainingMarks() ?? 0"
                [nextDisplayOrder]="numberOfQuestions()"
                (questionAdded)="createQuizStore.addQuestion($event)"
              ></app-add-question>
            </div>
            @if (!isAddQuestionButtonVisible()) {
              <div class="add-question-sticky-container">
                <app-add-question
                  class="pill-style"
                  [quizId]="quiz().id"
                  [disabled]="!createQuizStore.canAddMoreQuestions()"
                  [remainingMarks]="createQuizStore.effectiveRemainingMarks() ?? 0"
                  [nextDisplayOrder]="numberOfQuestions()"
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
})
export class CreateQuiz {
  protected readonly quizService = inject(QuizService);
  protected readonly createQuizStore = inject(CreateQuizStore);
  protected readonly quiz: Signal<CreateQuizModel> = this.createQuizStore
    .quiz as Signal<CreateQuizModel>;
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

  protected getInvalidFormsCount(): number {
    return this.createQuizStore.registeredForms().filter((form) => form.invalid).length;
  }
}
