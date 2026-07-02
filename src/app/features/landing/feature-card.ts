import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface FeatureCardData {
  id: number;
  icon: string;
  title: string;
  content: string;
}

export const featureCards: FeatureCardData[] = [
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
      gap: 0.75rem;
      min-height: 190px;
      padding: 1.75rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      background-color: var(--clr-white);
      transition:
        transform 0.3s var(--ease-spring),
        border-color 0.3s var(--ease-spring);

      @media (width < 768px) {
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      h3 {
        font-family: var(--ff-heading), sans-serif;
        font-size: var(--fs-500);
        font-weight: 700;
        color: var(--clr-blue-900);
        margin: 0;
      }

      p {
        color: var(--clr-gray-600);
        font-size: var(--fs-400);
        line-height: 1.5;
        margin: 0;
      }

      &:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: var(--clr-green-300);

        .icon {
          transform: scale(1.15) rotate(5deg);
          color: var(--clr-white);
        }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
      background: var(--clr-green-100);
      color: var(--clr-green-400);
      font-size: 1.15rem;
      transition:
        transform 0.3s var(--ease-spring),
        background-color 0.3s var(--ease-spring),
        color 0.3s var(--ease-spring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCard {}
