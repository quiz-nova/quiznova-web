import {Component} from '@angular/core';

@Component({
  selector: 'app-tab-group',
  imports: [],
  template: `
    <div class="tab-group">
      <ng-content/>
    </div> `,
  styles: [
    `
      .tab-group {
        display: grid;
        gap: 0.375rem;
      }
    `,
  ],
})
export class TabGroup {
}
