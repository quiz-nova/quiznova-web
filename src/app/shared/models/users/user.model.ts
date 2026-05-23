import { UserRole } from './user-role.model';

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: UserRole;
}
