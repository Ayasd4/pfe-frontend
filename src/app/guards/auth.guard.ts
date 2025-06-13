
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

   const publicRoutes = ['/forgot-password', '/login-admin', '/login'];

  // Autoriser l'accès direct aux routes publiques
  if (publicRoutes.includes(state.url)) {
    return true;
  }


  const user = authService.getUser(); // récupérer l'utilisateur connecté
  console.log('Utilisateur connecté:', user);

  if (!authService.isLoggedIn() || !user || !user.roles) {
    router.navigate(['/login']); // Rediriger si l'utilisateur n'est pas connecté
    return false;
  }

  // Vérifier si la route a une restriction de rôle
  const requiredRoles: string[] = route.data?.['roles'];
  console.log('Rôles requis:', requiredRoles); 

  if (requiredRoles && !requiredRoles.includes(user.roles.trim())) {
    router.navigate(['/login']); // Rediriger si l'utilisateur n'a pas le bon rôle
    return false;
  }

  return true;
};