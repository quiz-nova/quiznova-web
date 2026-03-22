import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCardComponent {}
