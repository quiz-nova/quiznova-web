import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {Question, QuestionType} from '../../../shared/models/quiz/question.model';
import {CreateQuizStore} from './create-quiz.store';

@Component({
  selector: 'app-questions-outline',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="questions-outline" aria-label="Questions outline">
      <header class="questions-outline__header">
        <h2>Questions</h2>
        <span class="questions-outline__counter">{{ numberOfQuestions() }}</span>
      </header>

      <ol class="questions-outline__list">
        @for (question of questions(); track question.id; let index = $index) {
          <li>
            <button
              type="button"
              class="questions-outline__item"
              [class.questions-outline__item--active]="question.id === activeQuestionId()"
              [attr.aria-current]="question.id === activeQuestionId() ? 'step' : null"
              (click)="onQuestionSelect(question.id)"
            >
              <span class="questions-outline__number">{{ index + 1 }}</span>
              <span class="questions-outline__details">
                <span class="questions-outline__title">{{ getQuestionTitle(question) }}</span>
                <span class="questions-outline__meta">
                  <i [class]="getQuestionTypeIcon(question.type)" aria-hidden="true"></i>
                  <span>{{ getQuestionTypeLabel(question.type) }}</span>
                </span>
              </span>
            </button>
          </li>
        }
      </ol>
    </aside>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }

    .questions-outline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: calc(100dvh - 2rem);
      padding: 1rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: 1rem;
      background-color: var(--clr-white);
      box-shadow: 0 12px 32px rgb(15 23 42 / 8%);
      font-size: var(--fs-300);
    }

    .questions-outline__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      color: var(--clr-blue-900);
    }

    h2 {
      font-size: var(--fs-400);
    }

    .questions-outline__counter {
      display: inline-grid;
      place-items: center;
      min-width: 2.25rem;
      min-height: 2.25rem;
      padding: 0.25rem 0.25rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: 999px;
      background-color: var(--clr-gray-50);
      color: var(--clr-blue-900);
      font-size: var(--fs-400);
      font-weight: 600;
      line-height: 1;
    }

    .questions-outline__list {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin: 0;
      padding: 0;
      list-style: none;
      min-height: 0;
      /*overflow-y: auto;*/
    }

    .questions-outline__item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.25rem 0.25rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.9rem;
      background-color: var(--clr-gray-50);
      text-align: left;
      transition:
        border-color 0.25s ease,
        background-color 0.25s ease,
        transform 0.25s ease;

      &:hover {
        border-color: var(--clr-green-500);
      }

      &:focus-visible {
        outline: none;
        border-color: var(--clr-green-500);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-green-500) 20%, transparent);
      }
    }

    .questions-outline__item--active {
      border-color: var(--clr-green-500);
      background-color: var(--clr-green-100);
      transform: translateX(2px);
    }

    .questions-outline__number {
      display: inline-grid;
      place-items: center;
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      background-color: var(--clr-gray-200);
      color: var(--clr-gray-600);
      font-size: var(--fs-500);
      font-weight: 700;
      line-height: 1;
      transition:
        background-color 0.25s ease,
        color 0.25s ease,
        transform 0.25s ease;
    }

    .questions-outline__item--active .questions-outline__number {
      background-color: var(--clr-green-500);
      color: var(--clr-white);
      transform: scale(1.03);
    }

    .questions-outline__details {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      min-width: 0;
    }

    .questions-outline__title {
      color: var(--clr-blue-900);
      font-size: var(--fs-400);
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .questions-outline__meta {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--clr-gray-600);
      font-size: var(--fs-300);
    }

    @media (width < 1024px) {
      .questions-outline {
        max-height: none;
      }
    }
  `,
})
export class QuestionsOutline {
  private readonly createQuizStore = inject(CreateQuizStore);
  protected readonly questions = this.createQuizStore.questions;
  protected readonly numberOfQuestions = this.createQuizStore.numberOfQuestions;
  protected readonly activeQuestionId = computed(
    () => this.createQuizStore.activeQuestionId() ?? this.questions()[0]?.id ?? null,
  );

  protected onQuestionSelect(questionId: string): void {
    this.createQuizStore.setCurrentQuestionId(questionId);
    document.getElementById(questionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  protected getQuestionTitle(question: Question): string {
    const text = question.questionText.trim();
    return text.length > 0 ? text : 'Untitled question';
  }

  protected getQuestionTypeLabel(questionType: QuestionType): string {
    return questionType === QuestionType.Mcq ? 'Mcq' : 'True/False';
  }

  protected getQuestionTypeIcon(questionType: QuestionType): string {
    return questionType === QuestionType.Mcq
      ? 'fa-solid fa-list-check'
      : 'fa-solid fa-circle-dot';
  }
}
