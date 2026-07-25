import { DatePipe, UpperCasePipe, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  viewChildren,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';

import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { AnswerReviewContract } from '@shared/models/quiz/question-component.contracts';
import { QuestionComponentMapperService } from '@shared/services/question-component-mapper.service';
import { QuizAttemptService } from '@shared/services/quiz-attempt.service';

import { NoAnswer } from './no-answer';

@Component({
  selector: 'app-grade-review',
  imports: [
    ProgressSpinner,
    DatePipe,
    UpperCasePipe,
    NgComponentOutlet,
    NoAnswer,
    OperationFailed,
    Button,
  ],
  template: `
    <section class="page">
      <!-- ── Back nav ── -->
      <nav class="back-nav" aria-label="Breadcrumb">
        <p-button
          [outlined]="true"
          (onClick)="goBack()"
          aria-label="Back to Inbox"
          icon="fa-solid fa-arrow-left"
          label="Back to Inbox"
          severity="secondary"
          type="button"
        />
      </nav>

      @if (attemptResource.isLoading()) {
        <div class="status-container">
          <p-progress-spinner ariaLabel="Loading attempt" />
        </div>
      } @else if (attemptResource.error()) {
        <app-operation-failed>
          <p>Failed to load this attempt.</p>
        </app-operation-failed>
      } @else if (attempt()) {
        <!-- ── Header card ── -->
        <header class="attempt-header">
          <div class="header-main">
            <div
              class="header-badge"
              [class.pending]="attempt()!.status === 'Pending'"
              [class.completed]="attempt()!.status === 'Completed'"
            >
              <i class="fa-solid fa-circle-dot"></i>
              {{ attempt()!.status }}
            </div>
            <h1 class="quiz-title">{{ attempt()!.quizTitle }}</h1>
            <p class="submitted-on">
              <i class="fa-regular fa-calendar"></i>
              Submitted
              <time [attr.datetime]="attempt()!.submittedAt">{{
                attempt()!.submittedAt | date: 'short'
              }}</time>
            </p>
          </div>
          <div class="score-pill" aria-label="Current score">
            <span class="score-num">{{ attempt()!.score }}</span>
            <span class="score-lable">pts</span>
          </div>
        </header>

        <!-- ── Question list ── -->
        <ol class="question-list" aria-label="Quiz questions">
          @for (question of orderedQuestions(); track question.id; let i = $index) {
            @let answer = answerByQuestionId()[question.id];

            <li class="question-card">
              <!-- Question header -->
              <div class="question-header">
                <span class="q-number">Q{{ i + 1 }}</span>
                <span class="q-marks-badge"
                  >{{ question.marks }} {{ question.marks === 1 ? 'mark' : 'marks' }}</span
                >
                <span class="q-type-badge" [class]="'type-' + question.type">{{
                  question.type | uppercase
                }}</span>
              </div>
              <p class="question-text">{{ question.questionText }}</p>

              @if (!answer) {
                <app-no-answer />
              } @else {
                <ng-container
                  [ngComponentOutlet]="
                    mapperService.getSuitableAnswerReviewComponent(question.type)
                  "
                  [ngComponentOutletInputs]="{ question, answer }"
                ></ng-container>
              }
            </li>
          }
        </ol>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--clr-gray-50);
    }

    .page {
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
      max-width: 900px;
      margin-inline: auto;
    }

    .attempt-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 18px rgb(15 23 42 / 6%);
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: var(--fs-300);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .header-badge.pending {
      background: var(--clr-amber-100);
      color: var(--clr-amber-800);
    }

    .header-badge.completed {
      background: var(--clr-green-100);
      color: var(--clr-green-600);
    }

    .quiz-title {
      font-size: var(--fs-600);
      font-weight: 700;
      color: var(--clr-gray-800);
    }

    .submitted-on {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      margin-top: 0.35rem;
    }

    .score-pill {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-md);
      background: var(--gradient-main);
      color: var(--clr-white);
      flex-shrink: 0;
    }

    .score-num {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .score-lable {
      font-size: var(--fs-300);
      opacity: 0.85;
    }

    .question-list {
      display: grid;
      gap: 1.25rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .question-card {
      padding: 1.5rem;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      box-shadow: 0 2px 12px rgb(15 23 42 / 4%);
    }

    .question-header {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 0.875rem;
    }

    .q-number {
      font-size: var(--fs-300);
      font-weight: 700;
      color: var(--clr-gray-600);
      background: var(--clr-gray-100);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .q-marks-badge {
      font-size: var(--fs-300);
      font-weight: 600;
      color: var(--clr-green-600);
      background: var(--clr-green-100);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .q-type-badge {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .question-text {
      font-size: var(--fs-500);
      font-weight: 500;
      color: var(--clr-gray-800);
      line-height: 1.55;
      margin-bottom: 1rem;
    }

    .status-container {
      display: grid;
      place-items: center;
      min-height: 14rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeReview {
  private readonly outlets = viewChildren(NgComponentOutlet);

  constructor() {
    effect((onCleanup) => {
      const activeOutlets = this.outlets();
      const activeSubscriptions: { unsubscribe(): void }[] = [];

      activeOutlets.forEach((outlet) => {
        const instance = outlet.componentInstance as AnswerReviewContract | null;
        if (instance && instance.graded) {
          const subscription = instance.graded.subscribe(() => {
            this.reloadAttempt();
          });
          activeSubscriptions.push(subscription);
        }
      });

      onCleanup(() => {
        activeSubscriptions.forEach((sub) => sub.unsubscribe());
      });
    });
  }

  private readonly quizAttemptService = inject(QuizAttemptService);
  protected readonly mapperService = inject(QuestionComponentMapperService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly attemptId = this.route.snapshot.paramMap.get('attemptId') ?? '';

  protected readonly attemptResource = rxResource({
    stream: () => this.quizAttemptService.getQuizAttemptForGrading(this.attemptId),
  });

  protected readonly attempt = computed(() => this.attemptResource.value() ?? null);

  protected readonly orderedQuestions = computed(() =>
    [...(this.attempt()?.questions ?? [])].sort((a, b) => a.displayOrder - b.displayOrder),
  );

  protected readonly answerByQuestionId = computed(() => {
    const answers = this.attempt()?.answers ?? [];
    return Object.fromEntries(answers.map((a) => [a.questionId, a]));
  });

  public reloadAttempt(): void {
    this.attemptResource.reload();
  }

  protected goBack(): void {
    this.router.navigate(['/instructor/grade']);
  }
}
