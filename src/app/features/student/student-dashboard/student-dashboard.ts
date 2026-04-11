import { Component, inject } from '@angular/core';
import { APP_SETTINGS } from '../../../core/config/app.settings';
import { AuthService } from '../../auth/auth.service';
// import { QuizAttemptsService } from '../../../shared/services/quiz-attempts.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [],
  template: `
    <h1>Welcome back</h1>
    <p>, Alex! Here's your learning overview</p>
  `,
  styles: ``,
})
export class StudentDashboard {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly authService = inject(AuthService);
  // private readonly quizAttemptsService = inject(QuizAttemptsService);
  // private readonly studentId = computed(() => this.authService.currentUser()?.userId);
  // private readonly studentQuizAttemptsResource = rxResource({
  //   stream: () => this.quizAttemptsService.getQuizAttemptsByStudentId(this.studentId()!),
  // });
}
