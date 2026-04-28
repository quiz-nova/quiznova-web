import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@Features/auth/auth.service';
import { FeatureCardComponent } from '@Features/landing/feature-card';
import { ProgressSpinner } from 'primeng/progressspinner';

import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { CollegeService } from '@shared/services/college.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FeatureCardComponent, ProgressSpinner, RoleDashboardHeader],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          [description]="'Welcome back, ' + welcomeName()"
          title="Admin Dashboard"
        />
      </header>

      @if (summaryResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (summaryResource.error()) {
        <div class="error">
          <p>Failed to load dashboard data.</p>
        </div>
      } @else {
        <section class="card-grid">
          @for (card of cards(); track card.title) {
            <app-feature-card>
              <i [class]="card.icon" aria-hidden="true"></i>
              <h3 class="card-title">{{ card.title }}</h3>
              <div class="card-content">
                <strong class="metric">{{ card.value }}</strong>
                <p>{{ card.caption }}</p>
              </div>
            </app-feature-card>
          }
        </section>
      }
    </section>
  `,
  styles: `
    .page {
      display: grid;
      gap: 1.5rem;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: start;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .metric {
      display: block;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      line-height: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  private readonly authService = inject(AuthService);
  private readonly collegeService = inject(CollegeService);

  protected readonly welcomeName = computed(() => this.authService.currentUser()?.name || 'Admin');

  protected readonly summaryResource = rxResource({
    stream: () => this.collegeService.getCollegeSummary(),
  });

  protected readonly cards = computed(() => {
    const summary = this.summaryResource.value() ?? null;

    return [
      {
        title: 'Students',
        value: summary?.totalStudents ?? 0,
        caption: 'Registered learners in this college',
        icon: 'fa-solid fa-users',
      },
      {
        title: 'Instructors',
        value: summary?.totalInstructors ?? 0,
        caption: 'Teaching staff currently assigned',
        icon: 'fa-solid fa-chalkboard-user',
      },
      {
        title: 'Courses',
        value: summary?.totalCourses ?? 0,
        caption: 'Courses tracked under this college',
        icon: 'fa-solid fa-book',
      },
    ];
  });
}
