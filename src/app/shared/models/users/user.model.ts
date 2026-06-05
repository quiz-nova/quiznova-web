import { PersonalInformation } from './personal-information.model';
import { UserRole } from './user-role.model';

export interface User {
  id: string;
  role: UserRole;
  personalInformation: PersonalInformation;
}
