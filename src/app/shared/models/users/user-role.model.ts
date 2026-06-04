export enum UserRole {
  student = 'student',
  instructor = 'instructor',
  admin = 'admin',
}

export type DefaultUserRoute = Record<UserRole, string>;

export interface RoleDefinition {
  id: number;
  label: string;
  value: UserRole;
  actions: readonly string[];
  actionRouteLinks?: Record<string, string>;
}
