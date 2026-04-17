import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { InstructorService } from '../../shared/services/instructor.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-instructors',
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Instructors</p>
          <h1>Instructor Directory</h1>
          <p class="description">A quick view of teaching assignments and quiz activity.</p>
        </div>
      </header>

      @if (instructorsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (instructorsResource.error()) {
        <div class="error">
          <p>Failed to load instructor data.</p>
        </div>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Courses</th>
                <th>Quizzes</th>
              </tr>
            </thead>
            <tbody>
              @for (
                instructor of instructorsResource.value() || [];
                track instructor.instructorId
              ) {
                <tr>
                  <td>{{ instructor.name }}</td>
                  <td>{{ instructor.courseCount }}</td>
                  <td>{{ instructor.quizCount }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
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

    .table-shell {
      overflow: auto;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--clr-gray-200);
    }

    th {
      color: var(--clr-gray-600);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    tbody tr:last-child td {
      border-bottom: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressSpinner],
})
export class CollegeInstructors {
  private readonly instructorService = inject(InstructorService);
  protected readonly instructorsResource = rxResource({
    stream: () => this.instructorService.getAllInstructors(),
  });
}
