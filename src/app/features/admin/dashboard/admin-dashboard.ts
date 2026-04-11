import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FeatureCardComponent } from '../../landing/features/feature-card/feature-card';
import { CollegeService } from '../../../shared/services/college.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FeatureCardComponent, ProgressSpinner],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p class="description">A read-only snapshot of the current college activity.</p>
        </div>
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
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: start;
    }

    .eyebrow {
      margin: 0 0 0.25rem;
      color: var(--clr-green-500);
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.75rem);
    }

    .description {
      margin: 0.75rem 0 0;
      color: var(--clr-gray-600);
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
  private readonly collegeService = inject(CollegeService);

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
        icon: 'fa-regular fa-users',
      },
      {
        title: 'Instructors',
        value: summary?.totalInstructors ?? 0,
        caption: 'Teaching staff currently assigned',
        icon: 'fa-regular fa-chalkboard-user',
      },
      {
        title: 'Departments',
        value: summary?.totalDepartments ?? 0,
        caption: 'Academic units represented in the system',
        icon: 'fa-regular fa-building',
      },
      {
        title: 'Courses',
        value: summary?.totalCourses ?? 0,
        caption: 'Courses tracked under this college',
        icon: 'fa-regular fa-book',
      },
    ];
  });
}
