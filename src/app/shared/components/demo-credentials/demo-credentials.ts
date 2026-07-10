import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-demo-credentials',
  standalone: true,
  template: `
    <div class="demo-credentials">
      <p class="demo-note">
        <i class="fa-solid fa-lock"></i> <strong>Shh… Secret Passwords!</strong> Don't tell anyone!
      </p>
      <div class="credential-row">
        <span class="cred-role"><i class="fa-solid fa-crown"></i> Admin</span>
        <span class="cred-value">
          admin@quiznova.local /
          @if (visible() !== 'admin') {
            <button class="reveal-btn" (click)="reveal('admin')" type="button">
              <i class="fa-solid fa-eye"></i> Reveal
            </button>
          } @else {
            <button class="reveal-btn revealed" (click)="hide()" type="button">
              <i class="fa-solid fa-eye-slash"></i>
            </button>
            <span class="cred-password">Admin123!</span>
          }
        </span>
      </div>
      <div class="credential-row">
        <span class="cred-role"><i class="fa-solid fa-chalkboard-user"></i> Instructor</span>
        <span class="cred-value">
          ahmed.nasser@quiznova.local /
          @if (visible() !== 'instructor') {
            <button class="reveal-btn" (click)="reveal('instructor')" type="button">
              <i class="fa-solid fa-eye"></i> Reveal
            </button>
          } @else {
            <button class="reveal-btn revealed" (click)="hide()" type="button">
              <i class="fa-solid fa-eye-slash"></i>
            </button>
            <span class="cred-password">Instructor123!</span>
          }
        </span>
      </div>
      <div class="credential-row">
        <span class="cred-role"><i class="fa-solid fa-graduation-cap"></i> Student</span>
        <span class="cred-value">
          omar.yasser@quiznova.local /
          @if (visible() !== 'student') {
            <button class="reveal-btn" (click)="reveal('student')" type="button">
              <i class="fa-solid fa-eye"></i> Reveal
            </button>
          } @else {
            <button class="reveal-btn revealed" (click)="hide()" type="button">
              <i class="fa-solid fa-eye-slash"></i>
            </button>
            <span class="cred-password">Student123!</span>
          }
        </span>
      </div>
    </div>
  `,
  styles: `
    .demo-credentials {
      margin-top: 2rem;
      padding: 1.25rem;
      border: 1px solid rgba(18, 165, 136, 0.25);
      border-radius: var(--radius-lg);
      background: rgba(18, 165, 136, 0.06);
    }

    .demo-note {
      margin: 0 0 0.75rem;
      font-size: var(--fs-300);
      color: var(--clr-gray-300);
      text-align: center;
    }

    .demo-note i {
      color: var(--clr-green-300);
      margin-right: 0.3rem;
    }

    .demo-note strong {
      color: var(--clr-green-300);
    }

    .credential-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      margin-bottom: 0.35rem;
      border-radius: var(--radius-sm);
      background: rgba(0, 0, 0, 0.25);
      font-size: var(--fs-200);
    }

    .credential-row:last-child {
      margin-bottom: 0;
    }

    .cred-role {
      font-weight: 600;
      color: var(--clr-gray-200);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .cred-role i {
      font-size: var(--fs-12);
      color: var(--clr-green-300);
    }

    .cred-value {
      font-size: var(--fs-12);
      color: var(--clr-gray-400);
      text-align: right;
      word-break: break-all;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .cred-password {
      color: var(--clr-green-300);
      font-weight: 700;
      font-size: var(--fs-12);
    }

    .reveal-btn {
      background: none;
      border: 1px solid rgba(18, 165, 136, 0.3);
      border-radius: var(--radius-sm);
      color: var(--clr-green-300);
      cursor: pointer;
      font-size: var(--fs-12);
      padding: 0.15rem 0.5rem;
      transition: all 0.2s var(--ease-standard);
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
    }

    .reveal-btn:hover {
      background: rgba(18, 165, 136, 0.1);
      border-color: var(--clr-green-400);
    }

    .reveal-btn.revealed {
      border-color: transparent;
    }

    .reveal-btn.revealed:hover {
      background: transparent;
      color: var(--clr-gray-200);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCredentials {
  protected readonly visible = signal<string | null>(null);

  protected reveal(key: string): void {
    this.visible.set(key);
  }

  protected hide(): void {
    this.visible.set(null);
  }
}
