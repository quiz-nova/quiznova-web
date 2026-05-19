import { Admin } from '@shared/models/admin/admin.model';

export type CreateAdmin = Omit<Admin, 'adminId'> & {
  role: string;
};
