import { Component, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { RouterLink } from '@angular/router';
import { email, form, FormField, required } from '@angular/forms/signals';
import { single } from 'rxjs';
enum UserRole {
  student = 'student',
  doctor = 'doctor',
  teachingAssistant = 'teachingAssistant',
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
    lable: 'Doctor',
    value: UserRole.doctor,
  },
  {
    id: 3,
    lable: 'Teaching Assistant',
    value: UserRole.teachingAssistant,
  },
  {
    id: 4,
    lable: 'Admin',
    value: UserRole.admin,
  },
  {
    id: 5,
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
