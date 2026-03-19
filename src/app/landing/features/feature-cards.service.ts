import { Injectable, signal } from '@angular/core';
import { FeatureCard, featureCards } from './feature-card/feature-card.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureCardsService {
  private readonly cardsState = signal<FeatureCard[]>(featureCards);

  readonly cards = this.cardsState.asReadonly();
}
