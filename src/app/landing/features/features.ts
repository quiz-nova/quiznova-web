import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FeatureCardComponent } from './feature-card/feature-card';
import { FeatureCardsService } from './feature-cards.service';
import { FadeInOnScrollDirective } from '../../shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-features',
  imports: [FadeInOnScrollDirective, FeatureCardComponent],
  templateUrl: './features.html',
  styleUrl: './features.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  private readonly featureCardsService = inject(FeatureCardsService);

  sortedCards = computed(() => [...this.featureCardsService.cards()].sort((a, b) => a.id - b.id));
}
