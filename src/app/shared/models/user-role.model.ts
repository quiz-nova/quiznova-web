import { Type } from '@angular/core';
import { CreateQuiz } from '../../features/instructor/create-quiz/create-quiz';

export enum UserRole {
  student = 'student',
  instructor = 'instructor',
  admin = 'admin',
}

export type ActionComponentMap = Record<string, Type<unknown>>;
export type DefaultUserRoute = Record<UserRole, string>;

export const DEFAULT_USER_ROUTE: DefaultUserRoute = {
  [UserRole.student]: '/student/dashboard',
  [UserRole.instructor]: '/instructor/dashboard',
  [UserRole.admin]: '/admin/dashboard',
};

export interface RoleDefinition {
  id: number;
  label: string;
  value: UserRole;
  actions: readonly string[];
  actionComponents?: ActionComponentMap;
  actionRouteLinks?: Record<string, string>;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  [UserRole.student]: {
    id: 1,
    label: 'Student',
    value: UserRole.student,
    actions: ['Dashboard', 'My Courses', 'Quizzes', 'Results', 'Profile'],
    actionComponents: {},
  },
  [UserRole.instructor]: {
    id: 2,
    label: 'Instructor',
    value: UserRole.instructor,
    actions: ['Dashboard', 'My Courses', 'Create Quiz', 'Analytics', 'Profile'],
    actionComponents: {
      'Create Quiz': CreateQuiz,
    },
    actionRouteLinks: {
      'Create Quiz': '/instructor/create-quiz',
    },
  },
  [UserRole.admin]: {
    id: 3,
    label: 'Admin',
    value: UserRole.admin,
    actions: ['Dashboard', 'Departments', 'Instructors', 'Students', 'Courses', 'Quizzes'],
    actionComponents: {},
    actionRouteLinks: {
      Dashboard: '/admin/dashboard',
      Departments: '/admin/departments',
      Instructors: '/admin/instructors',
      Students: '/admin/students',
      Courses: '/admin/courses',
      Quizzes: '/admin/quizzes',
    },
  },
};

export const ROLES = Object.values(ROLE_DEFINITIONS);
