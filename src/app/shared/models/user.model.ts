import { UserRole } from './user-role.model';

export class User {
  constructor(
    public userId = '',
    public name = '',
    public userRole = UserRole.student,
    public claims: string[] = [],
    public accessToken = '',
  ) {}
}
