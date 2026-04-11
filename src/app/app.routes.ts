import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Landing } from './features/landing/landing';

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
    children: [
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
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/admin/departments/college-departments').then(
            (m) => m.CollegeDepartments,
          ),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('./features/admin/instructors/college-instructors').then(
            (m) => m.CollegeInstructors,
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/students/college-students').then((m) => m.CollegeStudents),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/admin/courses/college-courses').then((m) => m.CollegeCourses),
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('./features/admin/quizzes/college-quizzes').then((m) => m.CollegeQuizzes),
      },
    ],
  },
];
