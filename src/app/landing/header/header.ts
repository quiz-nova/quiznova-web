import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderLink, headerLinks } from './header-link/header-link';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit, OnDestroy {
  media = window.matchMedia('(width <= 767px)');
  activateBurgerIcon = signal(this.media.matches);
  headerLinks = signal<HeaderLink[]>(headerLinks);
  menuClicked = signal(false);

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
