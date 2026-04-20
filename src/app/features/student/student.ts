import { Component } from '@angular/core';
import { BaseLayout } from '../../core/layout/base-layout/base-layout';

@Component({
  selector: 'app-student',
  imports: [BaseLayout],
  template: `
    <app-base-layout></app-base-layout>
  `,
  styles: ``,
})
export class Student {}
