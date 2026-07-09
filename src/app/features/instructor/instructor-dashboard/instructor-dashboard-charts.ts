import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { UIChart } from 'primeng/chart';

import { ChartPlaceholder } from '@shared/components/chart-placeholder/chart-placeholder';
import { CoursePerformance } from '@shared/models/course/course-performance.model';
import { Course } from '@shared/models/course/course.model';
import { chartColor } from '@shared/utils/chart-colors';

@Component({
  selector: 'app-instructor-dashboard-charts',
  imports: [UIChart, ChartPlaceholder],
  template: `
    <section class="charts-grid" aria-label="Course analytics">
      <article class="chart-card">
        <h3 class="chart-title">Students Enrolled in My Courses</h3>
        <div class="chart-container">
          @defer (on viewport({rootMargin: '100px'}); prefetch on viewport({rootMargin: '200px'})) {
            <p-chart
              [data]="enrolledChartData()"
              [options]="enrolledChartOptions()"
              type="bar"
              height="300"
            />
          } @placeholder {
            <app-chart-placeholder />
          }
        </div>
      </article>
      <article class="chart-card">
        <h3 class="chart-title">Average Score Per Course</h3>
        <div class="chart-container">
          @defer (on viewport({rootMargin: '100px'}); prefetch on viewport({rootMargin: '200px'})) {
            <p-chart
              [data]="performanceChartData()"
              [options]="performanceChartOptions()"
              type="bar"
              height="300"
            />
          } @placeholder {
            <app-chart-placeholder />
          }
        </div>
      </article>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
      gap: 1.5rem;
      margin-top: 0.5rem;
    }

    @media (width <= 576px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (width < 480px) {
      .chart-card {
        padding: 1rem;
      }

      .chart-container {
        height: 220px;
      }
    }

    .chart-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1.5rem;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      background-color: var(--clr-white);
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.05),
        0 2px 4px -2px rgb(0 0 0 / 0.05);
    }

    .chart-title {
      font-family: var(--ff-heading), sans-serif;
      font-size: var(--fs-500);
      font-weight: 600;
      color: var(--clr-blue-400);
    }

    .chart-container {
      position: relative;
      width: 100%;
      height: 300px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboardCharts {
  readonly coursesList = input.required<Course[]>();
  readonly performanceList = input.required<CoursePerformance[]>();

  protected readonly enrolledChartData = computed(() => {
    const courses = this.coursesList();
    return {
      labels: courses.map((c) => c.courseName),
      datasets: [
        {
          label: 'Enrolled Students',
          backgroundColor: chartColor('--clr-green-100'),
          borderColor: chartColor('--clr-green-400'),
          borderWidth: 1.5,
          hoverBackgroundColor: chartColor('--clr-green-200'),
          data: courses.map((c) => c.enrolledStudentsCount),
        },
      ],
    };
  });

  protected readonly enrolledChartOptions = computed(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: chartColor('--clr-black-500'),
          titleFont: { family: 'Space Grotesk', size: 13 },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 10,
          cornerRadius: 6,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: chartColor('--clr-gray-650'),
            font: { family: 'Inter', size: 11 },
          },
        },
        y: {
          grid: {
            color: chartColor('--clr-gray-150'),
          },
          ticks: {
            color: chartColor('--clr-gray-650'),
            font: { family: 'Inter', size: 11 },
            stepSize: 1,
          },
        },
      },
    };
  });

  protected readonly performanceChartData = computed(() => {
    const perf = this.performanceList();
    const backgroundColors = perf.map((c) =>
      c.avgScore >= 80
        ? chartColor('--clr-green-100')
        : c.avgScore >= 50
          ? chartColor('--clr-gray-100')
          : chartColor('--clr-red-50'),
    );
    const borderColors = perf.map((c) =>
      c.avgScore >= 80
        ? chartColor('--clr-green-400')
        : c.avgScore >= 50
          ? chartColor('--clr-gray-600')
          : chartColor('--clr-red-500'),
    );
    const hoverBackgroundColors = perf.map((c) =>
      c.avgScore >= 80
        ? chartColor('--clr-green-200')
        : c.avgScore >= 50
          ? chartColor('--clr-gray-200')
          : chartColor('--clr-red-200'),
    );

    return {
      labels: perf.map((c) => c.name),
      datasets: [
        {
          label: 'Average Score (%)',
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          hoverBackgroundColor: hoverBackgroundColors,
          data: perf.map((c) => c.avgScore),
        },
      ],
    };
  });

  protected readonly performanceChartOptions = computed(() => {
    return {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: chartColor('--clr-black-500'),
          titleFont: { family: 'Space Grotesk', size: 13 },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 10,
          cornerRadius: 6,
        },
      },
      scales: {
        x: {
          grid: {
            color: chartColor('--clr-gray-150'),
          },
          ticks: {
            color: chartColor('--clr-gray-650'),
            font: { family: 'Inter', size: 11 },
          },
          min: 0,
          max: 100,
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'var(--clr-gray-650)',
            font: { family: 'Inter', size: 11 },
          },
        },
      },
    };
  });
}
