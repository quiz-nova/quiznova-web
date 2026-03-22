import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FadeInOnScrollDirective } from '../../shared/directives/fade-in-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [FadeInOnScrollDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
