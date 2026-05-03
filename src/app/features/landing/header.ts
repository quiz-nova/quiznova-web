import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Logo } from '@shared/components/logo/logo';

export interface HeaderLink {
  id: number;
  label: string; // Name Will Appear To The User
  name: string; // Name We Will Use In Html attribute
}
export const headerLinks: HeaderLink[] = [
  { id: 1, label: 'Features', name: 'features' },
  { id: 2, label: 'Pricing', name: 'pricing' },
  { id: 3, label: 'About', name: 'about' },
  { id: 4, label: 'Contact', name: 'contact' },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, Logo],
  template: `
    <div class="container">
      <header>
        <app-logo />

        <button
          class="icon"
          [attr.aria-label]="menuClicked() ? 'Close menu' : 'Open menu'"
          [attr.aria-expanded]="menuClicked()"
          (click)="onClick()"
          type="button"
        >
          <i class="fa-solid" [class.fa-bars]="!menuClicked()" [class.fa-xmark]="menuClicked()"></i>
        </button>

        <nav class="links header__panel" [class.menu-open]="activateBurgerIcon() && menuClicked()">
          @for (link of sortedLinks(); track link.id) {
            <a [attr.href]="'#' + link.name">{{ link.label }}</a>
          }
        </nav>

        <div
          class="buttons header__panel"
          [class.menu-open]="activateBurgerIcon() && menuClicked()"
        >
          <button class="btn btn-gray" type="button" routerLink="/auth/login">Log in</button>
          <button class="btn btn-green" type="button" routerLink="/auth/register">
            Get Started
          </button>
        </div>
      </header>
    </div>
  `,
  styleUrls: ['./shared/landing-shared.css'],
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: block;
      background-color: var(--clr-transparent);
      backdrop-filter: blur(14px) saturate(180%);

      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--clr-gray-200);
      }
    }

    header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4rem;
      padding-inline: 0.75rem;
      font-family: var(--ff-heading);

      @media (width < 768px) {
        flex-wrap: wrap;
        height: auto;
        padding-block: 0.75rem;
      }
    }

    nav {
      display: flex;
      gap: 2rem;

      @media (width < 768px) {
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        margin-left: 0;
      }
    }

    a {
      color: var(--clr-gray-600);

      @media (width < 768px) {
        padding-left: 1rem;
      }

      &:hover {
        color: var(--clr-black-500);
      }
    }

    .header__panel {
      @media (width < 768px) {
        width: 100%;
        max-height: 0;
        padding-inline: 1rem;
        background-color: var(--clr-transparent);
        overflow: hidden;
        visibility: hidden;
      }

      &.menu-open {
        @media (width < 768px) {
          max-height: 500px;
          padding-block: 1rem;
          visibility: visible;
        }
      }
    }

    .buttons {
      position: relative;
      display: flex;
      gap: 0.625rem;

      @media (width < 768px) {
        justify-content: space-evenly;
        width: 100%;
      }

      button {
        min-height: auto;
        padding: 0.625rem 1rem;

        @media (width < 768px) {
          width: 40%;
        }
      }
    }

    .icon {
      display: none;
      padding: 0;
      border: 0;
      background: var(--clr-transparent);
      cursor: pointer;

      @media (width < 768px) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        font-size: var(--fs-600);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit, OnDestroy {
  private readonly media = window.matchMedia('(width <= 767px)');
  protected readonly activateBurgerIcon = signal(this.media.matches);
  protected readonly headerLinks = signal<HeaderLink[]>(headerLinks).asReadonly();
  protected readonly menuClicked = signal(false);

  private readonly onMediaChange = (e: MediaQueryListEvent) => {
    this.activateBurgerIcon.set(e.matches);
    this.menuClicked.set(false);
  };

  ngOnInit(): void {
    this.media.addEventListener('change', this.onMediaChange);
  }

  ngOnDestroy(): void {
    this.media.removeEventListener('change', this.onMediaChange);
  }

  sortedLinks = computed(() => [...this.headerLinks()].sort((a, b) => a.id - b.id));

  onClick() {
    if (!this.activateBurgerIcon()) {
      return;
    }

    this.menuClicked.update((oldValue) => !oldValue);
  }
}
