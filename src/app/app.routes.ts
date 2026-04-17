import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Landing } from './features/landing/landing';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './shared/models/user-role.model';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'instructor',
    loadComponent: () => import('./features/instructor/instructor').then((m) => m.Instructor),
    canMatch: [roleGuard(UserRole.instructor)],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/instructor/instructor-dashboard/instructor-dashboard').then(
            (m) => m.InstructorDashboard,
          ),
      },
      {
        path: 'my-courses',
        loadComponent: () =>
          import('./features/instructor/instructor-courses/instructor-courses').then(
            (m) => m.InstructorCourses,
          ),
      },
      {
        path: 'create-quiz',
        loadComponent: () =>
          import('./features/instructor/create-quiz/create-quiz').then((m) => m.CreateQuiz),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then((m) => m.Admin),
    canMatch: [roleGuard(UserRole.admin)],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('./features/admin/college-instructors').then((m) => m.CollegeInstructors),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/college-students').then((m) => m.CollegeStudents),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/admin/college-courses').then((m) => m.CollegeCourses),
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('./features/admin/college-quizzes').then((m) => m.CollegeQuizzes),
      },
    ],
  },
  {
    path: 'student',
    loadComponent: () => import('./features/student/student').then((m) => m.Student),
    canMatch: [roleGuard(UserRole.student)],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'my-courses',
        loadComponent: () =>
          import('./features/student/student-courses/student-courses').then(
            (m) => m.StudentCourses,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/student/student-dashboard/student-dashboard').then(
            (m) => m.StudentDashboard,
          ),
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('./features/student/student-quizzes/stundet-quizzes').then(
            (m) => m.StudentQuizzes,
          ),
      },
      {
        path: 'quiz-attempt/:quizId',
        loadComponent: () =>
          import('./features/student/quiz-attempt/quiz-attempt').then((m) => m.QuizAttempt),
      },
      {
        path: 'review-quiz/:attemptId',
        loadComponent: () =>
          import('./features/student/review-quiz/review-quiz').then((m) => m.ReviewQuiz),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./features/student/student-results/student-results').then((m) => m.StudentResults),
      },
    ],
  },
];
