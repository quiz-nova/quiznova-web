import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-questions-outline-placeholder',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-outline-placeholder">
      <p class="placeholder-text">Your quiz outline will appear here as you add questions.</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .empty-outline-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 1rem;
      color: var(--clr-gray-500);
      border: 1px dashed var(--clr-gray-300);
      border-radius: var(--radius-lg);
      background-color: var(--clr-white);
    }
  `,
})
export class QuestionsOutlinePlaceholder {}
