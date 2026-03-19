export enum UserRole {
  student = 'student',
  instructor = 'instructor',
  admin = 'admin',
  superAdmin = 'superAdmin',
}

export const ROLES = [
  {
    id: 1,
    label: 'Student',
    value: UserRole.student,
  },
  {
    id: 2,
    label: 'Instructor',
    value: UserRole.instructor,
  },
  {
    id: 3,
    label: 'Admin',
    value: UserRole.admin,
  },
  {
    id: 4,
    label: 'Super Admin',
    value: UserRole.superAdmin,
  },
] as const;