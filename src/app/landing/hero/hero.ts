import { Component } from '@angular/core';
import { FadeInOnScrollDirective } from '../../shared/fade-in-on-scroll.directive';

@Component({
  selector: 'app-hero',
  imports: [FadeInOnScrollDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {}
