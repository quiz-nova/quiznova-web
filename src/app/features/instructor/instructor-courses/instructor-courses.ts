import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { APP_SETTINGS } from '../../../core/config/app.settings';

@Component({
  selector: 'app-instructor-courses',
  imports: [],
  template: ` <p>instructor-courses works!</p> `,
  styles: ``,
})
export class InstructorCourses implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly authService = inject(AuthService);
  ngOnInit() {
    this.http
      .get(`${this.appSettings.apiBaseUrl}/${this.authService.currentUser()?.userId}/courses`)
      .subscribe({
      next: (data) => console.log('Courses data:', data),
      error: (err) => console.error('Failed to load courses', err),
      });
  }
}
