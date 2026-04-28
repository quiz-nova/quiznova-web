import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@Features/auth/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { of } from 'rxjs';

import { CoursesService } from '@shared/services/courses.service';


@Component({
  selector: 'app-instructor-courses',
  imports: [ProgressSpinner],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>My Courses</h1>
        </div>
      </header>

      @if (coursesResource.isLoading()) {
        <div class="status-container">
          <p-progress-spinner ariaLabel="Loading instructor courses" />
        </div>
      } @else if (coursesResource.error()) {
        <div class="status-container error-state" role="alert">
          <p>Failed to load course data.</p>
        </div>
      } @else if (!coursesResource.value().length) {
        <p class="feedback">No courses are assigned to you yet.</p>
      } @else {
        <section class="course-grid" aria-label="Instructor courses">
          @for (course of coursesResource.value(); track course.courseId) {
            <article class="course-card">
              <div class="course-card__header">
                <div>
                  <p class="course-label">Course</p>
                  <h2>{{ course.courseName }}</h2>
                </div>
                <div class="course-icon" aria-hidden="true">
                  <i class="fa-solid fa-book-open-reader"></i>
                </div>
              </div>

              <p class="course-id">ID {{ course.courseId.slice(0, 8) }}</p>

              <dl class="course-stats">
                <div>
                  <dt>Instructor</dt>
                  <dd>{{ course.instructorName }}</dd>
                </div>
                <div>
                  <dt>Students</dt>
                  <dd>{{ course.enrolledStudentsCount }}</dd>
                </div>
                <div>
                  <dt>Quizzes</dt>
                  <dd>{{ course.quizzesCount }}</dd>
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
      width: 100%;
      background-color: var(--clr-gray-50);
    }

    .page {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      padding: 1.5rem;
    }

    h1 {
      margin: 0;
      font-family: var(--ff-heading), sans-serif;
      font-size: clamp(2rem, 4vw, var(--fs-700));
      font-weight: 700;
    }

    .status-container {
      display: grid;
      min-height: 12rem;
      place-items: center;
    }

    .error-state {
      border: 1px solid var(--clr-red-500, #fecaca);
      border-radius: var(--radius-md);
      color: var(--clr-red-500, #b91c1c);
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
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }

    .course-card {
      display: grid;
      gap: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e2ec;
      border-radius: 1rem;
      background: var(--clr-white);
      box-shadow: 0 12px 30px rgb(15 23 42 / 8%);
    }

    .course-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .course-label {
      margin: 0 0 0.35rem;
      color: var(--clr-gray-600);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      color: #0f172a;
      font-size: 1.4rem;
      line-height: 1.25;
    }

    .course-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 1rem;
      background: #e9fbf6;
      color: #19b394;
      font-size: 1.2rem;
    }

    .course-id {
      margin: 0;
      color: var(--clr-gray-500);
      font-size: 0.95rem;
    }

    .course-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
      margin: 0;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .course-stats div {
      display: grid;
      gap: 0.35rem;
    }

    dt {
      color: var(--clr-gray-600);
      font-size: 0.85rem;
    }

    dd {
      margin: 0;
      color: #0f172a;
      font-size: 1.1rem;
      font-weight: 700;
    }

    @media (width < 640px) {
      .course-stats {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorCourses {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);

  protected readonly instructorId = computed(() => this.authService.currentUser()?.userId ?? null);

  protected readonly coursesResource = rxResource({
    stream: () => {
      const instructorId = this.instructorId();

      if (!instructorId) {
        return of([]);
      }

      return this.coursesService.getInstructorCourses(instructorId);
    },
    defaultValue: [],
  });
}
