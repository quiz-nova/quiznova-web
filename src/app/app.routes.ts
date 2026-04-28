import {Routes} from '@angular/router';

import {roleGuard} from '@Core/guards/role.guard';
import {Login} from '@Features/auth/login/login';
import {Landing} from '@Features/landing/landing';

import {UserRole} from '@shared/models/user/user-role.model';

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
    loadComponent: () => import('@Features/instructor/instructor').then((m) => m.Instructor),
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
          import('@Features/instructor/instructor-dashboard/instructor-dashboard').then(
            (m) => m.InstructorDashboard,
          ),
      },
      {
        path: 'my-courses',
        loadComponent: () =>
          import('@Features/instructor/instructor-courses/instructor-courses').then(
            (m) => m.InstructorCourses,
          ),
      },
      {
        path: 'create-quiz',
        loadComponent: () =>
          import('@Features/instructor/create-quiz/create-quiz').then((m) => m.CreateQuiz),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('@Features/admin/admin').then((m) => m.Admin),
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
          import('@Features/admin/college-courses').then((m) => m.CollegeCourses),
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('@Features/admin/college-quizzes').then((m) => m.CollegeQuizzes),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('@Features/admin/college-admins/college-admins').then((m) => m.CollegeAdmins),
      },
      {
        path: 'quiz-attempts',
        loadComponent: () =>
          import('@Features/admin/college-quiz-attempts').then((m) => m.CollegeQuizAttempts),
      },
    ],
  },
  {
    path: 'student',
    loadComponent: () => import('@Features/student/student').then((m) => m.Student),
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
          import('@Features/student/student-courses/student-courses').then(
            (m) => m.StudentCourses,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@Features/student/student-dashboard/student-dashboard').then(
            (m) => m.StudentDashboard,
          ),
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('@Features/student/student-quizzes/student-quizzes').then(
            (m) => m.StudentQuizzes,
          ),
      },
      {
        path: 'quiz-attempt/:quizId',
        loadComponent: () =>
          import('@Features/student/quiz-attempt/quiz-attempt').then((m) => m.QuizAttempt),
      },
      {
        path: 'review-quiz/:attemptId',
        loadComponent: () =>
          import('@Features/student/review-quiz/review-quiz').then((m) => m.ReviewQuiz),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('@Features/student/student-results/student-results').then(
            (m) => m.StudentResults,
          ),
      },
    ],
  },
];
