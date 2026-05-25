import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BaseLayout } from '@Core/layout/base-layout/base-layout';

@Component({
  selector: 'app-student',
  imports: [BaseLayout],
  template: ` <app-base-layout></app-base-layout> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Student {}
