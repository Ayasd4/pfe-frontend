import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  adminn: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  baseUrl: string = "http://localhost:3100/adminn";

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  adminSubject: any;


  constructor(private httpClient: HttpClient) {
    this.adminSubject = new BehaviorSubject<any>(null);
    const adminData = localStorage.getItem('adminn');
    if (adminData) {
      this.adminSubject.next(JSON.parse(adminData)); // Charger l'utilisateur existant au démarrage
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response && response.token && response.adminn) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('adminn', JSON.stringify(response.adminn));
          this.adminSubject.next(response.adminn);
          this.isLoggedInSubject.next(true);

        } else {
          throw new Error("Invalid response from server");
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminn');
    this.isLoggedInSubject.next(false); // Met à jour l'état
    this.adminSubject.next(null); // Met à jour l'admin déconnecté
    window.location.reload()
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si le token existe

  }

  setLoggedIn(status: boolean) {
    this.isLoggedInSubject.next(status);
  }

  getAdmin(): any {
    const adminData = localStorage.getItem('adminn');
    console.log('Admin récupéré du localStorage:', adminData); //  déboguer

    if (adminData) {
      return adminData ? JSON.parse(adminData) : null;
    }
    return null;
  }


  saveAdmin(adminn: any) {
    localStorage.setItem('adminn', JSON.stringify(adminn)); //Stocker l'utilisateur après connexion
  }

}
