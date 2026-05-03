import { ChangeDetectionStrategy, Component } from '@angular/core';

import { About } from './about';
import { Contact } from './contact';
import { Features } from './features';
import { Header } from './header';
import { Hero } from './hero';

@Component({
  selector: 'app-landing',
  imports: [Contact, About, Features, Hero, Header],
  template: `
    <app-header></app-header>
    <app-hero></app-hero>
    <app-features></app-features>
    <app-about></app-about>
    <app-contact></app-contact>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {}
