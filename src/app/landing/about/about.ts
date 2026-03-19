import { Component } from '@angular/core';
import { FadeInOnScrollDirective } from '../../shared/fade-in-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [FadeInOnScrollDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
