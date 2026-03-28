import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FeatureCard, featureCards } from './feature-card.model';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  template: `
    <article class="card">
      <div class="icon">
        <ng-content select="i"></ng-content>
      </div>

      <ng-content select=".card-title"></ng-content>

      <ng-content select=".card-content"></ng-content>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .card {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      gap: 0.625rem;
      height: 180px;
      padding: 1.5rem;
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
      transition:
        transform 0.2s linear,
        box-shadow 0.2s ease-in-out;

      @media (width < 768px) {
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }

    .card h3 {
      font-size: var(--fs-500);
    }

    .card p {
      color: var(--clr-gray-600);
      font-size: var(--fs-400);
      word-spacing: 3px;
    }

    .card:hover {
      transform: scale(1.01);
      box-shadow:
        0 20px 25px -5px rgb(0 0 0 / 10%),
        0 10px 10px -5px rgb(0 0 0 / 4%);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-md);
      background: var(--clr-green-100);
      transition: transform 0.3s ease-in-out;
    }

    .card:hover .icon {
      transform: scale(1.2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCardComponent {
  cards = signal<FeatureCard[]>(featureCards);
}
