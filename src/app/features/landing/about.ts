import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Button } from '@shared/components/button/button';
import { FadeInOnScrollDirective } from '@shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [FadeInOnScrollDirective, Button],
  template: `
    <section class="about" id="about">
      <div class="container">
        <article class="section-heading">
          <h2 appFadeInOnScroll>Built by educators, for educators</h2>
          <p appFadeInOnScroll>
            QuizNova was born from the frustration of managing assessments across large institutions.
            We built a platform that scales from a single campus team to an entire university system —
            without compromising on experience or security.
          </p>
        </article>
        <div class="about-cta" appFadeInOnScroll>
          <button appButton variant="green" type="button">Join QuizNova today</button>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./shared/landing-shared.css'],
  styles: `
    .about {
      padding-block: 5rem;
      background-color: var(--clr-gray-100);
    }

    .about-cta {
      display: flex;
      justify-content: center;
      padding-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
