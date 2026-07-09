import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { UIChart } from 'primeng/chart';

import { ChartPlaceholder } from '@shared/components/chart-placeholder/chart-placeholder';
import { QuizAttempt } from '@shared/models/quiz-attempt/quiz-attempt.model';
import { chartColor } from '@shared/utils/chart-colors';

@Component({
  selector: 'app-student-dashboard-charts',
  imports: [UIChart, ChartPlaceholder],
  template: `
    <section class="charts-grid" aria-label="Student analytics">
      <article class="chart-card">
        <h3 class="chart-title">My Score Trend</h3>
        <div class="chart-container">
          @defer (on viewport({rootMargin: '100px'}); prefetch on viewport({rootMargin: '200px'})) {
            <p-chart
              [data]="scoreTrendData()"
              [options]="scoreTrendOptions()"
              type="line"
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
export class StudentDashboardCharts {
  readonly quizAttempts = input<QuizAttempt[]>([]);

  protected readonly scoreTrendData = computed(() => {
    const attempts = this.quizAttempts()
      .filter((a) => a.submittedAt)
      .sort((a, b) => new Date(a.submittedAt!).getTime() - new Date(b.submittedAt!).getTime());

    return {
      labels: attempts.map((a) => a.quizTitle),
      datasets: [
        {
          label: 'Score',
          backgroundColor: chartColor('--clr-green-400'),
          borderColor: chartColor('--clr-green-400'),
          borderWidth: 2,
          pointBackgroundColor: chartColor('--clr-green-400'),
          pointBorderColor: chartColor('--clr-white'),
          pointBorderWidth: 1.5,
          pointRadius: 4,
          tension: 0.3,
          fill: false,
          data: attempts.map((a) => a.score),
        },
      ],
    };
  });

  protected readonly scoreTrendOptions = computed(() => ({
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
        min: 0,
      },
    },
  }));
}
