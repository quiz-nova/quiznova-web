import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../shared/components/sidebar/side-bar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, SideBar],
  template: `
    <section class="admin-layout">
      <app-side-bar></app-side-bar>

      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </section>
  `,
  styles: `
    .admin-layout {
      display: grid;
      grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
      min-height: 100vh;
    }

    .admin-content {
      min-width: 0;
      padding: 2rem;
    }

    @media (width < 960px) {
      .admin-layout {
        grid-template-columns: 1fr;
      }

      .admin-content {
        padding: 1.25rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin {}
