import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthAdminService } from '../dashboard-admin/services/auth-admin.service';
import { TokenAdminService } from '../dashboard-admin/services/token-admin.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule
  ]
})
export class LoginAdminComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  adminRole: string = '';

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private fb: FormBuilder,
    private authService: AuthAdminService,
    private tokenService: TokenAdminService,
    private router: Router,
    private ngxService: NgxUiLoaderService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    document.body.classList.add('login-container');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-container');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.ngxService.start();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {


        console.log('Réponse de connexion:', response); // Inspecte la réponse

        if (response && response.token && response.adminn) {
          // Sauvegarder le token et l'utilisateur dans le localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('adminn', JSON.stringify(response.adminn));

          console.log("Admin stocké dans localStorage:", localStorage.getItem('adminn'));
          console.log("Token stocké dans localStorage:", localStorage.getItem('token'));

          this.authService.setLoggedIn(true);

          this.ngxService.stop();

          // Redirection en fonction du rôle
          const adminRole = response.adminn.roles;

          if (adminRole === 'adminn') {
            this.router.navigate(['/dasboard-admin']);
          } else {
            this.router.navigate(['/login-admin']);

          }
        } else {
          this.errorMessage = 'Invalid credentials';
          console.error('Réponse non valide');
        }
      },
      error: (error) => {
        this.ngxService.stop();
        console.error('Login error', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

}