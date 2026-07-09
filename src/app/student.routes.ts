import { Routes } from '@angular/router';

import { canDeactivateQuizAttempt } from '@Features/student/quiz-attempt/quiz-attempt.guard';

export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@Features/student/student').then((m) => m.Student),
    children: [
      {
        path: 'quiz-attempt/:quizId',
        loadComponent: () =>
          import('@Features/student/quiz-attempt/quiz-attempt').then((m) => m.QuizAttempt),
        canDeactivate: [canDeactivateQuizAttempt],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'my-courses',
        loadComponent: () =>
          import('@Features/student/enrollments/enrollments').then((m) => m.Enrollments),
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
          import('@Features/student/student-quizzes/student-quizzes').then((m) => m.StudentQuizzes),
      },
      {
        path: 'review-quiz/:attemptId',
        loadComponent: () =>
          import('@Features/student/review-quiz/review-quiz').then((m) => m.ReviewQuiz),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('@Features/student/student-results/student-results').then((m) => m.StudentResults),
      },
      {
        path: 'course-chat',
        loadComponent: () => import('@Features/course-chat/course-chat').then((m) => m.CourseChat),
      },
      {
        path: 'course-chat/:courseId',
        loadComponent: () => import('@Features/course-chat/course-chat').then((m) => m.CourseChat),
      },
    ],
  },
];
