import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tab',
  imports: [],
  template: '',
  styles: [''],
})
export class Tab {
  tabName = input.required<string>();
}
