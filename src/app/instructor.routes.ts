import { Routes } from '@angular/router';

export const instructorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@Features/instructor/instructor').then((m) => m.Instructor),
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
      {
        path: 'grade',
        loadComponent: () =>
          import('@Features/instructor/pending-grades/pending-grades').then((m) => m.PendingGrades),
      },
      {
        path: 'grade/:attemptId',
        loadComponent: () =>
          import('@Features/instructor/grade-review/grade-review').then((m) => m.GradeReview),
      },
      {
        path: 'course-chat',
        loadComponent: () =>
          import('@Features/course-chat/course-chat').then((m) => m.CourseChat),
      },
      {
        path: 'course-chat/:courseId',
        loadComponent: () =>
          import('@Features/course-chat/course-chat').then((m) => m.CourseChat),
      },
    ],
  },
];
