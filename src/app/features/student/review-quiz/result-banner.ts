import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {ReviewQuizStore} from './review-quiz.store';

@Component({
  selector: 'app-result-banner',
  imports: [],
  template: `
    <section
      class="result-banner"
      [class.result-banner--pass]="isPassed"
      [class.result-banner--fail]="!isPassed"
      aria-label="Attempt result summary"
    >
      <div class="result-banner__icon" aria-hidden="true">
        {{ isPassed ? '✓' : '↘' }}
      </div>

      <div class="result-banner__content">
        <div class="result-banner__head">
          <p class="result-banner__score">{{ scorePercentage() }}%</p>
          <span class="result-banner__badge" [class.result-banner__badge--pass]="isPassed">
            {{ isPassed ? 'PASSED' : 'FAILED' }}
          </span>
        </div>

        <p class="result-banner__message">
          @if (isPassed) {
            Great work — you passed this attempt.
          } @else {
            You needed 60% to pass. Keep practicing — you have got this!
          }
        </p>

        <div class="result-banner__progress" role="presentation">
          <span
            [style.width.%]="scorePercentage()"
            [attr.aria-label]="'Score ' + scorePercentage() + '%'"
          >
          </span>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .result-banner {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.85rem;
      border: 1px solid var(--clr-review-danger-200);
      background: var(--clr-review-danger-50);
    }

    .result-banner--pass {
      border-color: var(--clr-review-success-200);
      background: var(--clr-review-success-50);
    }

    .result-banner__icon {
      display: grid;
      place-items: center;
      width: 4rem;
      height: 4rem;
      border-radius: 999px;
      background: var(--clr-review-danger-500);
      color: var(--clr-white);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .result-banner--pass .result-banner__icon {
      background: var(--clr-review-success-500);
    }

    .result-banner__content {
      display: grid;
      gap: 0.35rem;
    }

    .result-banner__head {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .result-banner__score {
      margin: 0;
      color: var(--clr-blue-900);
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
    }

    .result-banner__badge {
      border-radius: 999px;
      background: var(--clr-review-danger-500);
      color: var(--clr-white);
      font-size: 0.72rem;
      letter-spacing: 0.02em;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
    }

    .result-banner__badge--pass {
      background: var(--clr-review-success-500);
    }

    .result-banner__message {
      margin: 0;
      color: var(--clr-gray-600);
      font-size: 0.95rem;
      font-weight: 600;
    }

    .result-banner__progress {
      margin-top: 0.35rem;
      width: 100%;
      height: 0.38rem;
      border-radius: 999px;
      background: var(--clr-gray-200);
      overflow: hidden;
    }

    .result-banner__progress > span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--clr-review-success-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultBanner {
  private readonly reviewQuizStore = inject(ReviewQuizStore);
  protected readonly scorePercentage = this.reviewQuizStore.scorePercentage;
  protected readonly isPassed = this.reviewQuizStore.quizAttempt()?.isPassed;
}
