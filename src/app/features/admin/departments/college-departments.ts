import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DepartmentService } from '../../../shared/services/department.service';

@Component({
  selector: 'app-college-departments',
  imports: [ProgressSpinner],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Departments</p>
          <h1>Department Breakdown</h1>
          <p class="description">Each department card summarizes the current academic footprint.</p>
        </div>
      </header>

      @if (departmentsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (departmentsResource.error()) {
        <div class="error">
          <p>Failed to load department data.</p>
        </div>
      } @else if (!(departmentsResource.value()?.length ?? 0)) {
        <p class="feedback">No departments are available yet.</p>
      } @else {
        <section class="card-grid">
          @for (department of departmentsResource.value() ?? []; track department.departmentId) {
            <article class="department-card">
              <h2>{{ department.departmentName }}</h2>
              <div class="details">
                <p><strong>Students:</strong> {{ department.studentCount }}</p>
                <p><strong>Instructors:</strong> {{ department.instructorCount }}</p>
                <p><strong>Courses:</strong> {{ department.courseCount }}</p>
              </div>
            </article>
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
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .department-card {
      display: grid;
      gap: 1rem;
      padding: 1.25rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
    }

    h2 {
      margin: 0;
      font-size: 1.125rem;
    }

    .details {
      display: grid;
      gap: 0.4rem;
    }

    .details p {
      margin: 0;
    }

    .feedback {
      padding: 1rem 1.25rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
      color: var(--clr-gray-600);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeDepartments {
  private readonly departmentService = inject(DepartmentService);

  protected readonly departmentsResource = rxResource({
    stream: () => this.departmentService.getAllDepartments(),
  });
}
