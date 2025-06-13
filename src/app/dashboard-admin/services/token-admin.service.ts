import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenAdminService {

  private jwtHelper = new JwtHelperService();

  constructor() { }

  saveRole(role: string) {
    localStorage.setItem('admin_role', role);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAdminRole(): string | null {
    // Récupérer le rôle stocké directement
    const role = localStorage.getItem('admin_role');
    if (role) return role;

    // Sinon, essayer de le récupérer depuis le token
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.role || null;
  }


  isTokenExpired(): boolean {
    const token = this.getToken();
    return this.jwtHelper.isTokenExpired(token);
  }
}
