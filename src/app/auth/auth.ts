import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../shared/components/logo/logo';

@Component({
  selector: 'app-auth',
  imports: [Logo, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth {
  readonly leftTitle = input.required<string>();
  readonly leftDescription = input.required<string>();
  readonly heading = input.required<string>();
  readonly promptText = input.required<string>();
  readonly promptLinkLabel = input.required<string>();
  readonly promptLink = input.required<string>();
}
