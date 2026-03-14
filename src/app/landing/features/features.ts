import { Component, computed, signal } from '@angular/core';
import { FeatureCard, featureCards } from './feature-card/feature-card';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  cards = signal<FeatureCard[]>(featureCards);

  sortedCards = computed(() => [...this.cards()].sort((a, b) => a.id - b.id));
}
