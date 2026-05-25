import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-no-answer',
  imports: [],
  template: `
    <div class="no-answer" role="status">
      <i class="fa-solid fa-ban" aria-hidden="true"></i>
      Student did not answer this question
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .no-answer {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--fs-300);
      color: var(--clr-gray-500);
      background: var(--clr-gray-50);
      padding: 0.5rem 0.875rem;
      border-radius: var(--radius-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoAnswer {}
