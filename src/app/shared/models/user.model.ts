import { UserRole } from './user-role.model';

export interface User {
  userId: string;
  name: string;
  role: UserRole;
}
