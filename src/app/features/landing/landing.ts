import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact } from './contact';
import { About } from './about';
import { Features } from './features';
import { Hero } from './hero';
import { Header } from './header';

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
