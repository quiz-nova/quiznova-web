import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface GradingStat {
  label: string;
  value: number;
  icon: string;
  iconClass: string;
}

@Component({
  selector: 'app-pending-grades-stats',
  imports: [],
  template: `
    <section class="stats-row" aria-label="Grading summary">
      @for (stat of stats(); track stat.label) {
        <article class="stat-card">
          <div class="stat-icon" [class]="stat.iconClass" aria-hidden="true">
            <i [class]="stat.icon"></i>
          </div>
          <div>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </article>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 16px rgb(15 23 42 / 6%);
    }

    .stat-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-md);
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .stat-icon.green  { background: var(--clr-green-50); color: var(--clr-green-600); }
    .stat-icon.amber  { background: var(--clr-amber-50); color: var(--clr-amber-700); }
    .stat-icon.violet { background: var(--clr-violet-50); color: var(--clr-violet-700); }
    .stat-icon.cyan   { background: var(--clr-cyan-50); color: var(--clr-cyan-700); }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--clr-gray-800);
      line-height: 1;
      margin: 0;
    }

    .stat-label {
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
      margin-top: 0.25rem;
      margin-bottom: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingGradesStats {
  readonly stats = input.required<GradingStat[]>();
}
