import { Type } from '@angular/core';
// import { AdminCourses } from '../../sidebar/role-components/admin/admin-courses';
// import { AdminDashboard } from '../../sidebar/role-components/admin/admin-dashboard';
// import { AdminDepartments } from '../../sidebar/role-components/admin/admin-departments';
// import { AdminInstructors } from '../../sidebar/role-components/admin/admin-instructors';
// import { AdminQuizzes } from '../../sidebar/role-components/admin/admin-quizzes';
// import { AdminSettings } from '../../sidebar/role-components/admin/admin-settings';
// import { AdminStudents } from '../../sidebar/role-components/admin/admin-students';
// import { InstructorAnalytics } from '../../sidebar/role-components/instructor/instructor-analytics';
// import { InstructorCourses } from '../../sidebar/role-components/instructor/instructor-courses';
// import { InstructorCreateQuiz } from '../../sidebar/role-components/instructor/instructor-create-quiz';
// import { InstructorDashboard } from '../../sidebar/role-components/instructor/instructor-dashboard';
// import { InstructorProfile } from '../../sidebar/role-components/instructor/instructor-profile';
// import { StudentCourses } from '../../sidebar/role-components/student/student-courses';
// import { StudentDashboard } from '../../sidebar/role-components/student/student-dashboard';
// import { StudentProfile } from '../../sidebar/role-components/student/student-profile';
// import { StudentQuizzes } from '../../sidebar/role-components/student/student-quizzes';
// import { StudentResults } from '../../sidebar/role-components/student/student-results';

import { CreateQuiz } from '../../instructor/create-quiz/create-quiz';

export enum UserRole {
  student = 'student',
  instructor = 'instructor',
  admin = 'admin',
}

export type ActionComponentMap = Record<string, Type<unknown>>;

export interface RoleDefinition {
  id: number;
  label: string;
  value: UserRole;
  actions: readonly string[];
  actionComponents: ActionComponentMap;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  [UserRole.student]: {
    id: 1,
    label: 'Student',
    value: UserRole.student,
    actions: ['Dashboard', 'My Courses', 'Quizzes', 'Results', 'Profile'],
    actionComponents: {
      // Dashboard: StudentDashboard,
      // 'My Courses': StudentCourses,
      // Quizzes: StudentQuizzes,
      // Results: StudentResults,
      // Profile: StudentProfile,
    },
  },
  [UserRole.instructor]: {
    id: 2,
    label: 'Instructor',
    value: UserRole.instructor,
    actions: ['Dashboard', 'My Courses', 'Create Quiz', 'Analytics', 'Profile'],
    actionComponents: {
      // Dashboard: InstructorDashboard,
      // 'My Courses': InstructorCourses,
      'Create Quiz': CreateQuiz,
      // Analytics: InstructorAnalytics,
      // Profile: InstructorProfile,
    },
  },
  [UserRole.admin]: {
    id: 3,
    label: 'Admin',
    value: UserRole.admin,
    actions: [
      'Dashboard',
      'Departments',
      'Instructors',
      'Students',
      'Courses',
      'Quizzes',
      'Settings',
    ],
    actionComponents: {
      // Dashboard: AdminDashboard,
      // Departments: AdminDepartments,
      // Instructors: AdminInstructors,
      // Students: AdminStudents,
      // Courses: AdminCourses,
      // Quizzes: AdminQuizzes,
      // Settings: AdminSettings,
    },
  },
};

export const ROLES = Object.values(ROLE_DEFINITIONS);
