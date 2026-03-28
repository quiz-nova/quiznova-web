import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  template: `
    <div class="content">
      <div class="icon">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>
      <span>QuizNova</span>
    </div>
  `,
  styles: [
    `
      .content {
        display: flex;
        flex: 1;
        justify-content: flex-start;
        gap: 0.625rem;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: var(--radius-md);
        color: var(--clr-white);
        background-image: var(--gradient-main);
      }

      .content span {
        display: flex;
        align-items: center;
        font-weight: bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {}
