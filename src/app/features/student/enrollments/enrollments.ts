import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@Features/auth/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { of } from 'rxjs';

import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { EnrollmentService } from '@shared/services/enrollment.service';


@Component({
  selector: 'app-student-courses',
  imports: [ProgressSpinner, DatePipe, RoleDashboardHeader],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="My Enrolled Courses"
          description="View and access the courses you are currently enrolled in"
        />
      </header>

      @if (coursesResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="Loading courses" />
        </div>
      } @else if (coursesResource.error()) {
        <div class="error" role="alert">
          <p>Failed to load your courses. Please try again later.</p>
        </div>
      } @else if (!(coursesResource.value()?.length ?? 0)) {
        <p class="feedback">You are not enrolled in any courses yet.</p>
      } @else {
        <section class="course-grid" aria-label="Enrolled courses">
          @for (course of coursesResource.value() ?? []; track course.courseId) {
            <article class="course-card">
              <div class="course-card__header">
                <div>
                  <h2>{{ course.courseName }}</h2>
                </div>
                <div class="course-icon" aria-hidden="true">
                  <i class="fa-solid fa-graduation-cap"></i>
                </div>
              </div>

              <p class="course-id">Enrolled on: {{ course.enrolledOnUtc | date: 'mediumDate' }}</p>

              <dl class="course-stats">
                <div>
                  <dt>Instructor</dt>
                  <dd>{{ course.instructor.name }}</dd>
                </div>
                <div>
                  <dt>Quizzes Taken</dt>
                  <dd>{{ course.student.quizzesTaken }}</dd>
                </div>
              </dl>
            </article>
          }
        </section>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--clr-gray-50);
    }

    .page {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      padding: 1.5rem;
    }

    .feedback {
      padding: 1rem 1.25rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
      color: var(--clr-gray-600);
    }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .course-card {
      display: grid;
      gap: 1.25rem;
      padding: 1.5rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      background: var(--clr-white);
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .course-card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .course-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    
    h2 {
      margin: 0;
      color: var(--clr-black-700);
      font-size: 1.25rem;
      line-height: 1.4;
      font-weight: 600;
    }

    .course-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-md);
      background: var(--clr-green-100);
      color: var(--clr-green-400);
      font-size: 1.25rem;
    }

    .course-id {
      margin: 0;
      color: var(--clr-gray-600);
      font-size: 0.875rem;
    }

    .course-stats {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1rem;
      margin: 0;
      padding-top: 1rem;
      border-top: 1px solid var(--clr-gray-100);
    }

    .course-stats div {
      display: grid;
      gap: 0.25rem;
    }

    dt {
      color: var(--clr-gray-500);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      color: var(--clr-black-500);
      font-size: 1rem;
      font-weight: 600;
    }

    @media (width < 640px) {
      .course-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Enrollments {
  private readonly authService = inject(AuthService);
  private readonly enrollmentService = inject(EnrollmentService);

  protected readonly studentId = computed(() => this.authService.currentUser()?.id ?? null);

  protected readonly coursesResource = rxResource({
    stream: () => {
      const studentId = this.studentId();

      if (!studentId) {
        return of(undefined);
      }

      return this.enrollmentService.getEnrollments(studentId);
    },
  });
}
