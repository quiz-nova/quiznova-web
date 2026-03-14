import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Landing } from './landing/landing';
import { Register } from './register/register';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
];
