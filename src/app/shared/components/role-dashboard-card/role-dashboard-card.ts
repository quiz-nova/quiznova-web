import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-role-dashboard-card',
  imports: [],
  template: `
    <article class="dashboard-card" [class]="'theme-' + theme()">
      <div class="card-header">
        <h2 class="card-title">{{ title() }}</h2>
        <div class="card-icon" aria-hidden="true">
          <i [class]="icon()"></i>
        </div>
      </div>

      <div class="card-content">
        <p class="card-value">{{ value() }}</p>
        @if (caption()) {
          <p class="card-caption">{{ caption() }}</p>
        }
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dashboard-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1.5rem;
        min-height: 9.5rem;
        padding: 1.5rem;
        background: var(--clr-white);
        border: 1px solid var(--clr-gray-200);
        border-radius: var(--radius-lg, 1rem);
        box-shadow: 0 4px 16px rgb(15 23 42 / 6%);
        transition:
          transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);      }

      .dashboard-card:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 12px 24px -4px rgb(15 23 42 / 8%),
          0 8px 12px -6px rgb(15 23 42 / 6%);
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
      }

      .card-title {
        margin: 0;
        color: var(--clr-gray-600, #5a6e85);
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.3;
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .card-value {
        margin: 0;
        color: var(--clr-blue-900, #0f172a);
        font-size: clamp(2rem, 4vw, 2.5rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.02em;
      }

      .card-caption {
        margin: 0;
        color: var(--clr-gray-500, #64748b);
        font-size: 0.875rem;
        line-height: 1.4;
      }

      .card-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        border-radius: var(--radius-md, 0.875rem);
        font-size: 1.25rem;
        transition: 
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .dashboard-card:hover .card-icon {
        transform: scale(1.1) rotate(3deg);
      }

      /* Theme: Green */
      .theme-green {
        --theme-bg: var(--clr-green-50);
        --theme-text: var(--clr-green-500);
        --theme-border: var(--clr-green-200);
      }
      /* Theme: Amber */
      .theme-amber {
        --theme-bg: var(--clr-yellow-50);
        --theme-text: var(--clr-yellow-700);
        --theme-border: var(--clr-yellow-200);
      }
      /* Theme: Violet */
      .theme-violet {
        --theme-bg: var(--clr-violet-50);
        --theme-text: var(--clr-violet-700);
        --theme-border: var(--clr-violet-200);
      }
      /* Theme: Cyan */
      .theme-cyan {
        --theme-bg: var(--clr-cyan-50);
        --theme-text: var(--clr-cyan-700);
        --theme-border: var(--clr-cyan-200);
      }
      /* Theme: Primary */
      .theme-primary {
        --theme-bg: var(--clr-green-50);
        --theme-text: var(--clr-green-500);
        --theme-border: var(--clr-green-500);
      }

      /* Applying Theme Colors */
      .dashboard-card {
        border-color: var(--theme-border);
      }
      
      .card-icon {
        background-color: var(--theme-bg);
        color: var(--theme-text);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDashboardCard {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input.required<string>();
  readonly caption = input<string>();
  readonly theme = input<'green' | 'amber' | 'violet' | 'cyan' | 'primary'>('green');
}
