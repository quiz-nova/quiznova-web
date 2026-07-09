import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AdminDashboardCharts } from '@Features/admin/admin-dashboard/admin-dashboard-charts';
import { AuthService } from '@Features/auth/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';

import { OperationFailed } from '@shared/components/operation-failed/operation-failed';
import { RoleDashboardCard } from '@shared/components/role-dashboard-card/role-dashboard-card';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { CourseEnrollmentCount } from '@shared/models/enrollment/course-enrollment-count.model';
import { CollegeService } from '@shared/services/college.service';
import { EnrollmentService } from '@shared/services/enrollment.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ProgressSpinner, RoleDashboardHeader, RoleDashboardCard, AdminDashboardCharts, OperationFailed],
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
        <app-operation-failed>
          <p>Failed to load dashboard data.</p>
        </app-operation-failed>
      } @else {
        <section class="card-grid">
          @for (card of cards(); track card.title) {
            <app-role-dashboard-card
              [title]="card.title"
              [value]="card.value"
              [icon]="card.icon"
              [caption]="card.caption"
              [theme]="card.theme"
            />
          }
        </section>

        <app-admin-dashboard-charts
          [summary]="summaryResource.value() ?? null"
          [enrollmentCounts]="enrollmentResource.value()"
        />
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
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  private readonly authService = inject(AuthService);
  private readonly collegeService = inject(CollegeService);
  private readonly enrollmentService = inject(EnrollmentService);

  protected readonly welcomeName = computed(() => this.authService.currentUser()?.personalInformation?.name || 'Admin');

  protected readonly summaryResource = rxResource({
    stream: () => this.collegeService.getCollegeSummary(),
  });

  protected readonly enrollmentResource = rxResource({
    stream: () => this.enrollmentService.getAllCoursesEnrollmentCounts(),
    defaultValue: [] as CourseEnrollmentCount[],
  });

  protected readonly cards = computed(() => {
    const summary = this.summaryResource.value() ?? null;

    return [
      {
        title: 'Students',
        value: summary?.totalStudents ?? 0,
        caption: 'Registered learners in this college',
        icon: 'fa-solid fa-users',
        theme: 'cyan' as const,
      },
      {
        title: 'Instructors',
        value: summary?.totalInstructors ?? 0,
        caption: 'Teaching staff currently assigned',
        icon: 'fa-solid fa-chalkboard-user',
        theme: 'violet' as const,
      },
      {
        title: 'Courses',
        value: summary?.totalCourses ?? 0,
        caption: 'Courses tracked under this college',
        icon: 'fa-solid fa-book',
        theme: 'green' as const,
      },
    ];
  });
}
