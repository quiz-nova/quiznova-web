import { UserRole } from './user-role.model';

export interface User {
  userId: string;
  name: string;
  userRole: UserRole;
  claims: string[];
  accessToken: string;
}
