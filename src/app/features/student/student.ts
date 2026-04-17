import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../shared/components/sidebar/side-bar';

@Component({
  selector: 'app-student',
  imports: [RouterOutlet, SideBar],
  template: `
    <section class="student-dashboard">
      <app-side-bar></app-side-bar>
      <router-outlet></router-outlet>
    </section>
  `,
  styles: `
    .student-dashboard {
      display: flex;
    }

    app-side-bar {
      flex: 1;
    }
  `,
})
export class Student {}

