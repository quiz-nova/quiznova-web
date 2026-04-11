import { Component } from '@angular/core';

@Component({
  selector: 'app-questions-navigator',
  imports: [],
  template: `
    <section class="navigator-card" aria-label="Question navigator">
      <h2>Question Navigator</h2>

      <div class="navigator-grid">
        <button type="button" class="active">1</button>
        <button type="button" class="active">2</button>
        <button type="button">3</button>
        <button type="button">4</button>
        <button type="button">5</button>
        <button type="button">6</button>
        <button type="button">7</button>
        <button type="button">8</button>
      </div>

      <ul class="legend" aria-label="Question status legend">
        <li><span class="dot answered"></span>Answered</li>
        <li><span class="dot unanswered"></span>Unanswered</li>
        <li><span class="dot flagged"></span>Flagged</li>
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .navigator-card {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    h2 {
      margin: 0;
      font-size: 1rem;
    }

    .navigator-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(2rem, 1fr));
      gap: 0.5rem;
    }

    button {
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.625rem;
      min-height: 2rem;
      background: var(--clr-white);
      font-weight: 600;
      color: var(--clr-gray-700);
    }

    button.active {
      background: var(--clr-green-500);
      color: var(--clr-white);
      border-color: var(--clr-green-500);
    }

    .legend {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--clr-gray-700);
    }

    .legend li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 999px;
      display: inline-block;
    }

    .answered {
      background: var(--clr-green-500);
    }

    .unanswered {
      background: var(--clr-gray-300);
    }

    .flagged {
      background: #f8d57e;
    }
  `,
})
export class QuestionsNavigator {}
