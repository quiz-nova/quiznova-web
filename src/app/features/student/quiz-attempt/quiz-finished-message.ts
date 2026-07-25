import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { Button } from 'primeng/button';

@Component({
  selector: 'app-quiz-finished-message',
  imports: [Button],
  template: `
    <div class="quiz-completed-card">
      <div class="quiz-completed-card__icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2 class="quiz-completed-card__title">Quiz Completed!</h2>
      <p class="quiz-completed-card__message">
        You Have Compelete the Quiz Take a Rest Before you See you results 😉
      </p>
      <p-button
        (onClick)="seeResults.emit()"
        label="See Results"
        severity="success"
        type="button"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .quiz-completed-card {
      display: grid;
      place-items: center;
      align-content: center;
      gap: 1.5rem;
      padding: 3.5rem 2rem;
      background-color: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.02);
      max-width: 32rem;
      width: 100%;
      margin: 4rem auto;
      text-align: center;
      animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .quiz-completed-card__icon {
      font-size: 3.5rem;
      color: var(--clr-green-400);
      animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .quiz-completed-card__title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--clr-blue-900);
      margin: 0;
    }

    .quiz-completed-card__message {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--clr-gray-600);
      margin: 0;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizFinishedMessage {
  seeResults = output<void>();
}
