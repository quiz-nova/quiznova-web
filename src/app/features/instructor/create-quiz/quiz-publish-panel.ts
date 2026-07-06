import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { Button } from '@shared/components/button/button';

import { CreateQuizStore } from './create-quiz.store';


@Component({
  selector: 'app-quiz-publish-panel',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="publish-group">
      <button
        appButton
        variant="green"
        [disabled]="!store.isEntireQuizValid()"
        (click)="publish.emit()"
        type="button"
      >
        Publish Quiz
      </button>
      @if (!store.isEntireQuizValid()) {
        <span class="publish-hint">{{ store.publishDisabledReason() }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .publish-group {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
    }

    .publish-hint {
      font-size: var(--fs-300);
      color: var(--clr-gray-500);
      white-space: nowrap;
    }
  `,
})
export class QuizPublishPanel {
  readonly store = inject(CreateQuizStore);
  readonly publish = output<void>();
}
