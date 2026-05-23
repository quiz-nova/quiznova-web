import { Admin } from '@shared/models/users/admin.model';

export type CreateAdmin = Omit<Admin, 'id'> & {
  role: string;
};
