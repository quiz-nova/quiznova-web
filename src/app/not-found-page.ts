import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <a routerLink="/">Go back to home</a>
    </section>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    .not-found {
      text-align: center;
    }

    .not-found h1 {
      font-size: 6rem;
      margin: 0;
    }

    .not-found p {
      font-size: 1.5rem;
      margin: 1rem 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
