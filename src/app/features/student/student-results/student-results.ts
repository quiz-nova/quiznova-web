import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';

@Component({
  selector: 'app-student-results',
  imports: [RoleDashboardHeader],
  template: `
    <section class="page">
      <app-role-dashboard-header
        title="My Results"
        description="View and analyze your quiz attempts, scores, and feedback"
      />
      <div
        class="card"
        style="margin-top: 1.5rem; padding: 1.5rem; background: var(--clr-white); border: 1px solid var(--clr-gray-200); border-radius: var(--radius-md);"
      >
        <p style="color: var(--clr-gray-600); margin: 0;">
          Your quiz results and performance analytics will appear here.
        </p>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--clr-gray-50);
    }
    .page {
      display: grid;
      width: 100%;
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentResults {}
