import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from '@Features/auth/auth.service';

import { DEFAULT_USER_ROUTE, UserRole } from '@shared/models/user/user-role.model';


export const roleGuard = (role: UserRole): CanMatchFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }
    const currentUser = authService.currentUser();
    if (currentUser?.role !== role) {
      if (currentUser) {
        return router.createUrlTree([DEFAULT_USER_ROUTE[currentUser.role]]);
      }

      return router.createUrlTree(['/auth/login']);
    }
    return true;
  };
};
