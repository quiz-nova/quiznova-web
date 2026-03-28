import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FadeInOnScrollDirective } from '../../shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [FadeInOnScrollDirective],
  template: `
    <section id="about" class="about">
      <article class="section-heading">
        <h2 class="fade-in">Built by educators, for educators</h2>
        <p class="fade-in">
          QuizNova was born from the frustration of managing assessments across large institutions.
          We built a platform that scales from a single department to an entire university system -
          without compromising on experience or security.
        </p>
      </article>
      <button type="button" class="btn btn-green fade-in">Join QuizNova today</button>
    </section>
  `,
  styleUrls: ['../shared/landing-shared.css'],
  styles: `
    .about {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 3rem;
      background-color: var(--clr-gray-100);
    }

    .btn {
      width: 200px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
