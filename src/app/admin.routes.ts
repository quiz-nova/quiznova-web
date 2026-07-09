import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@Features/admin/admin').then((m) => m.Admin),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@Features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('@Features/admin/college-instructors/college-instructors').then(
            (m) => m.CollegeInstructors,
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('@Features/admin/college-students/college-students').then(
            (m) => m.CollegeStudents,
          ),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('@Features/admin/college-courses/college-courses').then((m) => m.CollegeCourses),
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('@Features/admin/college-quizzes/college-quizzes').then((m) => m.CollegeQuizzes),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('@Features/admin/college-admins/college-admins').then((m) => m.CollegeAdmins),
      },
      {
        path: 'quiz-attempts',
        loadComponent: () =>
          import('@Features/admin/college-quizzes-attempts/college-quiz-attempts').then(
            (m) => m.CollegeQuizzesAttempts,
          ),
      },
    ],
  },
];
