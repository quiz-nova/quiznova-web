import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Landing } from './landing/landing';
import { Register } from './auth/register/register';


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
  {
    path: 'instructor',
    loadComponent: () => import('./instructor/instructor').then((m) => m.Instructor),
    children: [
      {
        path: 'create-quiz',
        loadComponent: () =>
          import('./instructor/create-quiz/create-quiz').then((m) => m.CreateQuiz),
      },
    ],
  },
];
