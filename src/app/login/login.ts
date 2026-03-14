import { Component, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { RouterLink } from '@angular/router';
import { email, form, FormField, required } from '@angular/forms/signals';
enum UserRole {
  student = 'student',
  instructor = 'instructor',
  admin = 'admin',
  superAdmin = 'superAdmin',
}
interface LoginData {
  email: string;
  password: string;
  role: UserRole;
}

export const roles = [
  {
    id: 1,
    lable: 'Student',
    value: UserRole.student,
  },
  {
    id: 2,
    lable: 'Instructor',
    value: UserRole.instructor,
  },
  {
    id: 3,
    lable: 'Admin',
    value: UserRole.admin,
  },
  {
    id: 4,
    lable: 'Super Admin',
    value: UserRole.superAdmin,
  },
];
@Component({
  selector: 'app-login',
  imports: [Logo, RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userRoles = signal(roles);
  loginModel = signal<LoginData>({
    email: '',
    password: '',
    role: UserRole.student,
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    required(schemaPath.password, { message: 'Password is required' });
    required(schemaPath.role, { message: 'Role is required' });
    email(schemaPath.email);
  });
  onSubmit() {}
}
