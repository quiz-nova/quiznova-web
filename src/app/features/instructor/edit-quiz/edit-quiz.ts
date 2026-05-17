import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
import { Question } from '@shared/models/quiz/question.model';

import { EditQuizStore } from './edit-quiz.store';

@Component({
  selector: 'app-edit-quiz',
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
  providers: [EditQuizStore],
  template: `
    <section class="create-quiz">
      <div class="outline">
        @if (store.numberOfQuestions() > 0) {
          <app-questions-outline
            [questions]="store.questions()"
            [activeQuestionId]="store.activeQuestionId()"
            [remainingMarks]="store.effectiveRemainingMarks()"
            (questionSelect)="store.setCurrentQuestionId($event)"
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
            <h1 class="title">Edit Quiz</h1>
            <p class="subtitle">Changes are saved automatically as you edit</p>
          </div>
          @if (store.isPending()) {
            <span class="loading-indicator">Saving...</span>
          }
        </header>

        @if (store.quizId() && store.metadata()) {
          <app-quiz-metadata-form
            [initialData]="store.metadata()"
            (blurEvent)="store.updateMetadata($event)"
            (courseIdChanged)="onCourseIdChanged($event)"
          ></app-quiz-metadata-form>

          <app-quiz-header
            [numberOfQuestions]="store.numberOfQuestions()"
            [totalMarks]="store.totalMarks()"
            [remainingMarks]="store.effectiveRemainingMarks()"
          ></app-quiz-header>

          <div class="questions-workspace">
            <div class="questions-content">
              <div class="questions-list">
                @for (question of store.questions(); track question.id; let index = $index) {
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
                      (deleteQuestion)="store.removeQuestion($event)"
                      (blurEvent)="updateQuestionMarks(question, $event.marks)"
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
                          (questionTextBlur)="store.updateQuestionText($event.questionId, $event.text)"
                          (blurEvent)="store.updateQuestion($event)"
                        ></app-mcq-form>
                      }
                      @case ('tf') {
                        <app-tf-form
                          [initialData]="question"
                          (questionTextBlur)="store.updateQuestionText($event.questionId, $event.text)"
                          (blurEvent)="store.updateQuestion($event)"
                        ></app-tf-form>
                      }
                    }
                  </div>
                }
              </div>

              <div class="add-question-main">
                <app-add-question
                  [disabled]="!store.canAddMoreQuestions()"
                  [remainingMarks]="store.effectiveRemainingMarks() ?? 0"
                  [nextDisplayOrder]="store.numberOfQuestions()"
                  (questionAdded)="store.addQuestion($event)"
                ></app-add-question>
              </div>

              @if (store.numberOfQuestions() === 0) {
                <app-no-questions></app-no-questions>
              }
            </div>
          </div>
        } @else if (store.isPending()) {
          <p>Loading quiz...</p>
        } @else if (store.error() !== null) {
          <p class="error-text">{{ store.error() }}</p>
        }
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
          color: var(--clr-green-600);
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

    .loading-indicator {
      color: var(--clr-gray-500);
      font-size: var(--fs-300);
      font-style: italic;
    }

    .error-text {
      color: var(--clr-red-500);
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

    @media (width >= 1024px) {
    }

    .question {
      padding: 1rem;
      border: 1px solid var(--clr-gray-500);
      border-left: 6px solid var(--clr-green-500);
      border-radius: var(--radius-md);
    }
  `,
})
export class EditQuiz implements OnInit {
  protected readonly store = inject(EditQuizStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    // Assuming the route is configured like: 'edit/:id'
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.loadQuiz({ quizId: id });
      }
    });
  }

  protected onCourseIdChanged(courseId: string) {
    this.store.updateCourseId(courseId);
  }

  protected onQuestionVisibilityChanged(isVisible: boolean, questionId: string) {
    if (!isVisible) {
      return;
    }
    this.store.setCurrentQuestionId(questionId);
  }

  protected updateQuestionMarks(question: Question, marks: number) {
    this.store.updateQuestion({ ...question, marks });
  }

  protected getMaxMarksForQuestion(currentMarks: number): number {
    const effectiveRemaining = this.store.effectiveRemainingMarks();
    if (effectiveRemaining === null) {
      return 5;
    }
    return Math.min(5, currentMarks + effectiveRemaining);
  }
}
