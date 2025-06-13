import { CanActivateFn, Router } from '@angular/router';
import { AuthAdminService } from '../dashboard-admin/services/auth-admin.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {

  const adminService = inject(AuthAdminService);
  const router = inject(Router);

  const admin = adminService.getAdmin();
  console.log('Admin connected:', admin);

  if (!adminService.isLoggedIn() || !admin || !admin.roles) {
    router.navigate(['/login-admin']);
    return false;
  }

  const requiredRoles: string[] = route.data?.['roles'];
  console.log('Rôles requis:', requiredRoles);

  if (requiredRoles && !requiredRoles.includes(admin.roles.trim())) {

    router.navigate(['/login-admin']); 
    return false;
  }

  return true;
};
