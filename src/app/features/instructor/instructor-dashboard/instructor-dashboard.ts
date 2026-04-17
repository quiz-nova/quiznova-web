import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, forkJoin } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../auth/auth.service';
import { CoursesService } from '../../../shared/services/courses.service';
import { QuizService } from '../../../shared/services/quiz.service';
import { RoleDashboardHeader } from '../../../shared/components/role-dashboard-header/role-dashboard-header';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [ProgressSpinner, RoleDashboardHeader],
  template: `
    <section class="dashboard">
      <header class="dashboard-header">
        <app-role-dashboard-header
          title="Instructor Dashboard"
          [description]="'Welcome back, ' + welcomeName()"
        />
      </header>

      @if (summaryResource.isLoading()) {
        <div class="status-container">
          <p-progress-spinner ariaLabel="Loading instructor dashboard" />
        </div>
      } @else if (summaryResource.error()) {
        <div class="status-container error-state" role="alert">
          <p>Failed to load dashboard data.</p>
        </div>
      } @else {
        <section class="card-grid" aria-label="Instructor summary">
          @for (card of cards(); track card.title) {
            <article class="summary-card">
              <div class="card-header">
                <h2>{{ card.title }}</h2>
                <div class="card-icon" aria-hidden="true">
                  <i [class]="card.icon"></i>
                </div>
              </div>

              <p class="card-value">{{ card.value }}</p>
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

    .dashboard {
      display: grid;
      gap: 1.5rem;
      width: 100%;
      padding: 1.5rem;
    }

    .dashboard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
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

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }

    .summary-card {
      display: grid;
      gap: 1.5rem;
      min-height: 9.5rem;
      padding: 1.5rem;
      border: 1px solid #d9e2ec;
      border-radius: 1rem;
      background: var(--clr-white);
      box-shadow: 0 12px 30px rgb(15 23 42 / 8%);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    h2 {
      margin: 0;
      color: #556987;
      font-size: 1.625rem;
      font-weight: 600;
    }

    .card-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 1rem;
      background: #e9fbf6;
      color: #19b394;
      font-size: 1.25rem;
    }

    .card-value {
      margin: 0;
      color: #0f172a;
      font-size: clamp(2rem, 4vw, 2.5rem);
      font-weight: 700;
      line-height: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboard {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly quizService = inject(QuizService);

  protected readonly welcomeName = computed(() => this.authService.currentUser()?.name || 'Instructor');
  protected readonly instructorId = computed(() => this.authService.currentUser()?.userId ?? null);

  protected readonly summaryResource = rxResource({
    stream: () => {
      const instructorId = this.instructorId();

      if (!instructorId) {
        return of({
          courses: {
            courseCount: 0,
          },
          quizzes: {
            quizCount: 0,
          },
        });
      }

      return forkJoin({
        courses: this.coursesService.getInstructorCoursesCount(instructorId),
        quizzes: this.quizService.getInstructorQuizzesCount(instructorId),
      });
    },
    defaultValue: {
      courses: {
        courseCount: 0,
      },
      quizzes: {
        quizCount: 0,
      },
    },
  });

  protected readonly cards = computed(() => {
    const summary = this.summaryResource.value();

    return [
      {
        title: 'My Courses',
        value: summary.courses.courseCount,
        icon: 'fa-solid fa-book-open',
      },
      {
        title: 'Total Quizzes',
        value: summary.quizzes.quizCount,
        icon: 'fa-regular fa-clipboard',
      },
    ];
  });
}
