import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CoursesService } from '../../../shared/services/courses.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-college-courses',
  imports: [ProgressSpinner],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Courses</p>
          <h1>Course Status</h1>
          <p class="description">Each row shows ownership, enrollment, and quiz coverage.</p>
        </div>
      </header>

      @if (coursesResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading" />
        </div>
      } @else if (coursesResource.error()) {
        <div class="error">
          <p>Failed to load course data.</p>
        </div>
      } @else if (!(coursesResource.value()?.length ?? 0)) {
        <p class="feedback">No courses are available yet.</p>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Course</th>
                <th>Departments</th>
                <th>Instructor</th>
                <th>Enrolled</th>
                <th>Quizzes</th>
              </tr>
            </thead>
            <tbody>
              @for (course of coursesResource.value() ?? []; track course.courseId) {
                <tr>
                  <td>{{ course.courseId.slice(0, 8) }}</td>
                  <td>{{ course.courseName }}</td>
                  <td>{{ course.departments.join(', ') || 'Unassigned' }}</td>
                  <td>{{ course.instructorName }}</td>
                  <td>{{ course.enrolledStudentCount }}</td>
                  <td>{{ course.quizCount }}</td>
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
      white-space: nowrap;
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
export class CollegeCourses {
  private readonly coursesService = inject(CoursesService);
  protected readonly coursesResource = rxResource({
    stream: () => this.coursesService.getAllCourses(),
  });
}
