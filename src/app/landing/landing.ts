import { Component } from '@angular/core';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { Features } from './features/features';
import { Hero } from './hero/hero';
import { Header } from './header/header';

@Component({
  selector: 'app-landing',
  imports: [Contact, About, Features, Hero, Header],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {}
