import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Button } from '@shared/components/button/button';
import { FadeInOnScrollDirective } from '@shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-hero',
  imports: [FadeInOnScrollDirective, Button],
  template: `
    <div class="container">
      <main>
        <div class="content" appFadeInOnScroll>
          <div class="icon" [delay]="50" appFadeInOnScroll>
            <i class="fa-solid fa-star"></i>
          </div>
          <p [delay]="100" appFadeInOnScroll>The future of educational assessment</p>
        </div>
        <h1 [delay]="150" appFadeInOnScroll>
          Smarter quizzes for <span class="accent-word">modern education</span>
        </h1>
        <p class="system-description" [delay]="200" appFadeInOnScroll>
          QuizNova empowers colleges and institutions to create, assign, and analyze quizzes with a
          powerful multi-tenant platform built for scale.
        </p>
        <div class="buttons" [delay]="250" appFadeInOnScroll>
          <button appButton variant="green" appFadeInOnScroll>Start free trial</button>
          <button appButton variant="gray" appFadeInOnScroll>See how it works</button>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./shared/landing-shared.css'],
  styles: `
    :host {
      display: block;
      background: radial-gradient(circle at 50% 35%, rgba(18, 165, 136, 0.05) 0%, transparent 55%);
    }

    main {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 1rem;
      min-height: calc(100vh - 4.5rem);
    }

    .content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-block: 1rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--clr-green-100);
      border-radius: 9999px; /* impeccable-disable-line design-system-radius */
      background-color: var(--clr-green-50);
      color: var(--clr-green-800);
      font-weight: 600;
      font-size: var(--fs-300);
      text-align: center;
    }

    h1 {
      font-family: var(--ff-heading), sans-serif;
      font-size: var(--fs-900);
      font-weight: 700;
      line-height: 1.1;
      text-align: center;
      letter-spacing: -0.03em;
      max-width: 50rem;
    }

    .accent-word {
      color: var(--clr-green-400);
    }

    .system-description {
      margin-block: 1rem 2rem;
      color: var(--clr-gray-600);
      font-size: var(--fs-600);
      line-height: 1.6;
      text-align: center;
      max-width: 44rem;
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      width: 100%;

      @media (width < 575px) {
        flex-direction: column;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
