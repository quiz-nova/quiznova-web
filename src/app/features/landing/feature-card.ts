import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface FeatureCard {
  id: number;
  icon: string;
  title: string;
  content: string;
}

export const featureCards: FeatureCard[] = [
  {
    id: 1,
    icon: 'fa-solid fa-building-shield',
    title: 'Multi-Tenant Architecture',
    content:
      'Each institution gets its own isolated workspace with custom branding and configuration.',
  },
  {
    id: 2,
    icon: 'fa-solid fa-user-shield',
    title: 'Role-Based Access',
    content: 'Admin, Instructor, and Student — each with tailored dashboards.',
  },
  {
    id: 3,
    icon: 'fa-solid fa-database',
    title: 'Smart Question Bank',
    content: 'Build reusable question pools with tagging, difficulty labels, and auto-shuffle.',
  },
  {
    id: 4,
    icon: 'fa-solid fa-chart-line',
    title: 'Real-Time Analytics',
    content:
      'Track performance with detailed reports, charts, and exportable data across every view.',
  },
  {
    id: 5,
    icon: 'fa-solid fa-lock',
    title: 'Secure Assessments',
    content: 'Anti-cheating measures, time limits, randomized questions, and secure browser mode.',
  },
  {
    id: 6,
    icon: 'fa-solid fa-check-double',
    title: 'Instant Grading',
    content: 'Automatic scoring with customizable rubrics and instant result publishing.',
  },
];

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

      h3 {
        font-size: var(--fs-500);
      }

      p {
        color: var(--clr-gray-600);
        font-size: var(--fs-400);
        word-spacing: 3px;
      }

      &:hover {
        transform: scale(1.01);
        box-shadow:
          0 20px 25px -5px rgb(0 0 0 / 10%),
          0 10px 10px -5px rgb(0 0 0 / 4%);

        .icon {
          transform: scale(1.2);
        }
      }
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCardComponent {
  cards = signal<FeatureCard[]>(featureCards);
}
