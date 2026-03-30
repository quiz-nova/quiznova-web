import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../shared/components/sidebar/side-bar';

@Component({
  selector: 'app-instructor',
  imports: [RouterOutlet, SideBar],
  template: `
    <section class="instructor-dashboard">
      <app-side-bar></app-side-bar>
      <router-outlet></router-outlet>
    </section> `,
  styles: `
    .instructor-dashboard {
      display: flex;
    }

    app-side-bar {
      flex: 1;
    }
  `,
})
export class Instructor {}
