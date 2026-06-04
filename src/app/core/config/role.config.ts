import { UserRole, DefaultUserRoute, RoleDefinition } from '@shared/models/users/user-role.model';

export const DEFAULT_USER_ROUTE: DefaultUserRoute = {
  [UserRole.student]: '/student/dashboard',
  [UserRole.instructor]: '/instructor/dashboard',
  [UserRole.admin]: '/admin/dashboard',
};

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  [UserRole.student]: {
    id: 1,
    label: 'Student',
    value: UserRole.student,
    actions: ['Dashboard', 'My Courses', 'Quizzes', 'Results'],
    actionRouteLinks: {
      Dashboard: '/student/dashboard',
      'My Courses': '/student/my-courses',
      Quizzes: '/student/quizzes',
      Results: '/student/results',
    },
  },
  [UserRole.instructor]: {
    id: 2,
    label: 'Instructor',
    value: UserRole.instructor,
    actions: ['Dashboard', 'My Courses', 'Create Quiz', 'Pending Grades'],
    actionRouteLinks: {
      Dashboard: '/instructor/dashboard',
      'My Courses': '/instructor/my-courses',
      'Create Quiz': '/instructor/create-quiz',
      'Pending Grades': '/instructor/grade',
    },
  },
  [UserRole.admin]: {
    id: 3,
    label: 'Admin',
    value: UserRole.admin,
    actions: ['Dashboard', 'Instructors', 'Students', 'Courses', 'Quizzes', 'Quiz Attempts', 'Admins'],
    actionRouteLinks: {
      Dashboard: '/admin/dashboard',
      Instructors: '/admin/instructors',
      Students: '/admin/students',
      Courses: '/admin/courses',
      Quizzes: '/admin/quizzes',
      'Quiz Attempts': '/admin/quiz-attempts',
      Admins: '/admin/admins',
    },
  },
};

export const ROLES = Object.values(ROLE_DEFINITIONS);
