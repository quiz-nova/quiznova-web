import { Component } from '@angular/core';

@Component({
  selector: 'app-questions-progrss-bar',
  imports: [],
  template: `
    <section class="progress-card" aria-label="Quiz progress">
      <div class="progress-track" aria-hidden="true">
        <div class="progress-value"></div>
      </div>
      <p>2 of 15 answered</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .progress-card {
      display: grid;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    .progress-track {
      width: 100%;
      height: 0.5rem;
      background: var(--clr-gray-200);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-value {
      width: 13.33%;
      height: 100%;
      background: var(--clr-green-500);
    }

    p {
      margin: 0;
      text-align: center;
      font-size: 0.875rem;
      color: var(--clr-gray-700);
      font-weight: 600;
    }
  `,
})
export class QuestionsProgrssBar {}
