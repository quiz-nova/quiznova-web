import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-no-pending-grades',
  imports: [],
  template: `
    <div class="empty-state" role="status">
      <div class="empty-icon">
        <i class="fa-solid fa-clipboard-check"></i>
      </div>
      <h2>All caught up!</h2>
      <p>There are no essay answers waiting for your review.</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      min-height: 16rem;
      text-align: center;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
    }

    .empty-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      border-radius: 1.25rem;
      background: var(--clr-green-100);
      color: var(--clr-green-500);
      font-size: 1.75rem;
    }

    h2 {
      font-size: var(--fs-600);
      color: var(--clr-gray-800);
    }

    p {
      font-size: var(--fs-300);
      color: var(--clr-gray-600);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoPendingGrades {}
