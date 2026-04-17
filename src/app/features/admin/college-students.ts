import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StudentService } from '../../shared/services/student.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-college-students',
  imports: [ProgressSpinner],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Students</p>
          <h1>Student Roster</h1>
          <p class="description">A simple roster view of enrollment load.</p>
        </div>
      </header>

      @if (studentsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (studentsResource.error()) {
        <div class="error">
          <p>Failed to load student data.</p>
        </div>
      } @else if (!(studentsResource.value()?.length ?? 0)) {
        <p class="feedback">No students are available yet.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Enrolled Courses</th>
              </tr>
            </thead>
            <tbody>
              @for (student of studentsResource.value() ?? []; track student.studentId) {
                <tr>
                  <td>{{ student.name }}</td>
                  <td>{{ student.enrolledCourseCount }}</td>
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
export class CollegeStudents {
  private readonly studentService = inject(StudentService);

  protected readonly studentsResource = rxResource({
    stream: () => this.studentService.getAllStudents(),
  });
}
