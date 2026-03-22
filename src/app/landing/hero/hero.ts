<<<<<<< Updated upstream
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FadeInOnScrollDirective } from '../../shared/fade-in-on-scroll.directive';
=======
import { Component } from '@angular/core';
import { FadeInOnScrollDirective } from '../../shared/directives/fade-in-on-scroll.directive';
>>>>>>> Stashed changes

@Component({
  selector: 'app-hero',
  imports: [FadeInOnScrollDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
