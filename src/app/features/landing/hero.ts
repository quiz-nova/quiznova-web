import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FadeInOnScrollDirective } from '@shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-hero',
  imports: [FadeInOnScrollDirective],
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
          Smarter quizzes for <span class="gradient-text">modern education</span>
        </h1>
        <p class="system-description" [delay]="200" appFadeInOnScroll>
          QuizNova empowers colleges and institutions to create, assign, and analyze quizzes with a
          powerful multi-tenant platform built for scale.
        </p>
        <div class="buttons" [delay]="250" appFadeInOnScroll>
          <button class="btn btn-green" appFadeInOnScroll>Start free trial</button>
          <button class="btn btn-gray" appFadeInOnScroll>See how it works</button>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./shared/landing-shared.css'],
  styles: `
    main {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 1rem;
      height: calc(100vh - 4rem);
    }

    .content {
      display: flex;
      gap: 0.25rem;
      margin-block: 1rem;
      padding: 0.625rem;
      border-radius: var(--radius-md);
      background-color: var(--clr-green-100);
      color: var(--clr-green-500);
      text-align: center;
    }

    h1 {
      font-size: var(--fs-900);
      line-height: 1;
      text-align: center;
    }

    .system-description {
      margin-block: 2rem;
      color: var(--clr-gray-600);
      font-size: var(--fs-600);
      text-align: center;
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

    .buttons .btn {
      width: min(230px, 50%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
