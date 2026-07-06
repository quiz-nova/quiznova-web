import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chart-placeholder',
  imports: [],
  template: `
    <div class="chart-placeholder">
      <span class="chart-placeholder-text">Loading chart…</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 300px;
    }

    .chart-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: var(--radius-lg);
      background-color: var(--clr-gray-100);
    }

    .chart-placeholder-text {
      font-family: var(--ff-heading), sans-serif;
      font-size: var(--fs-400);
      color: var(--clr-gray-400);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPlaceholder {}
