import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { Button } from '@shared/components/button/button';

import { CreateQuizStore } from '../../stores/create-quiz.store';

@Component({
  selector: 'app-quiz-publish-panel',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="publish-group">
      <button
        [disabled]="!store.isEntireQuizValid()"
        (click)="publish.emit()"
        appButton
        variant="green"
        type="button"
      >
        Publish Quiz
      </button>
      @if (!store.isEntireQuizValid()) {
        <span class="publish-hint">{{ store.publishDisabledReason() }}</span>
      }
    </div>
  `,
  styleUrl: './quiz-publish-panel.css',
})
export class QuizPublishPanel {
  readonly store = inject(CreateQuizStore);
  readonly publish = output<void>();
}
