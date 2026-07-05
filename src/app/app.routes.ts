import { Routes } from '@angular/router';


import { roleGuard } from '@Core/guards/role.guard';
import { Login } from '@Features/auth/login/login';
import { Landing } from '@Features/landing/landing';

import { UserRole } from '@shared/models/users/user-role.model';

import { NotFoundPage } from './not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'instructor',
    canMatch: [roleGuard(UserRole.instructor)],
    loadChildren: () => import('./instructor.routes').then((m) => m.instructorRoutes),
  },
  {
    path: 'admin',
    canMatch: [roleGuard(UserRole.admin)],
    loadComponent: () => import('@Features/admin/admin').then((m) => m.Admin),
    loadChildren: () => import('./admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'student',
    canMatch: [roleGuard(UserRole.student)],
    loadChildren: () => import('./student.routes').then((m) => m.studentRoutes),
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
