import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chart-placeholder',
  imports: [],
  template: `
    <div class="chart-placeholder">
      <span class="chart-placeholder-text">Loading chart…</span>
    </div>
  `,
  styleUrl: './chart-placeholder.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPlaceholder {}
