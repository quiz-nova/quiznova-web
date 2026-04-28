import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { SideBar } from '@Core/layout/sidebar/side-bar';
import { TopBar } from '@Core/layout/top-bar/top-bar';
import { distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, TopBar, SideBar],
  template: `
    <section class="base-layout" [class.sidebar-open]="isSidebarOpen()">
      <app-top-bar (toggleMenu)="toggleSidebar()"></app-top-bar>

      <div class="base-layout__body">
        @if (isMobile() && isSidebarOpen()) {
          <button
            class="base-layout__backdrop"
            (click)="toggleSidebar()"
            type="button"
            aria-label="Close sidebar"
          ></button>
        }

        <app-side-bar class="base-layout__sidebar" [class.opened]="isSidebarOpen()"></app-side-bar>

        <main class="base-layout__content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }

    .base-layout {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
    }

    .base-layout__body {
      display: grid;
      grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
      position: relative;
      transition: grid-template-columns 0.3s ease-in-out;
    }

    .base-layout:not(.sidebar-open) .base-layout__body {
      grid-template-columns: 0 minmax(0, 1fr);
    }

    .base-layout__sidebar {
      overflow: hidden;
    }

    .base-layout__content {
      min-width: 0;
    }

    @media (width < 768px) {
      .base-layout__body {
        grid-template-columns: 1fr;
      }

      .base-layout:not(.sidebar-open) .base-layout__body {
        grid-template-columns: 1fr;
      }

      .base-layout__sidebar {
        position: fixed;
        top: 4.25rem;
        left: -280px;
        width: 280px;
        height: calc(100dvh - 4.25rem);
        z-index: 1000;
        transition: left 0.3s ease-in-out;
      }

      .base-layout__sidebar.opened {
        left: 0;
      }

      .base-layout__backdrop {
        position: fixed;
        inset: 4.25rem 0 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }
    }
  `,
})
export class BaseLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly isMobile = toSignal(
    this.breakpointObserver.observe(['(max-width: 767px)']).pipe(
      map((result) => result.matches),
      distinctUntilChanged(),
    ),
    { initialValue: false },
  );

  protected readonly isSidebarOpen = signal(true);
  
  constructor() {
    effect(() => {
      this.isSidebarOpen.set(!this.isMobile());
    });
  }

  protected toggleSidebar() {
    this.isSidebarOpen.update((state) => !state);
  }
}
