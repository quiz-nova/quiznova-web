import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { DEFAULT_USER_ROUTE } from '@Core/config/role.config';
import { AuthService } from '@Features/auth/auth.service';

import { UserRole } from '@shared/models/users/user-role.model';
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
