import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FeatureCardComponent, featureCards } from './feature-card';
import { FadeInOnScrollDirective } from '../../shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-features',
  imports: [FadeInOnScrollDirective, FeatureCardComponent],
  template: `
    <section id="features" class="features">
      <div class="container">
        <article class="section-heading">
          <h2 appFadeInOnScroll>
            Everything you need to
            <span class="gradient-text">assess brilliance</span>
          </h2>
          <p appFadeInOnScroll [delay]="100">
            A complete platform for creating, managing, and analyzing educational assessments at
            scale.
          </p>
        </article>
        <div class="cards">
          @for (feature of cards(); track feature.id; let i = $index) {
            <app-feature-card appFadeInOnScroll [delay]="i * 50">
              <i [class]="feature.icon"></i>
              <h3 class="card-title">{{ feature.title }}</h3>
              <p class="card-content">{{ feature.content }}</p>
            </app-feature-card>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./shared/landing-shared.css'],
  styles: `
    .features {
      padding-block: 2.5rem;
      background-color: var(--clr-gray-100);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
      gap: 1rem;
    }

    .cards app-feature-card .card-title {
      font-size: var(--fs-500);
    }

    .cards app-feature-card .card-content {
      color: var(--clr-gray-600);
      font-size: var(--fs-400);
      word-spacing: 3px;
    }

    .cards app-feature-card i {
      color: var(--clr-green-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  protected readonly cards = signal(featureCards).asReadonly();
}
