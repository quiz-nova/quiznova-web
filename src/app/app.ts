import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('quiz-nova-client');
  protected readonly currentUser = signal<User | null>(null);

  private readonly authService = inject(AuthService);

  constructor() {
    effect(() => {
      this.currentUser.set(this.authService.currentUser());
    });
  }
}
