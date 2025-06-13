import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatIconModule } from '@angular/material/icon';
import { AuthAdminService } from '../dashboard-admin/services/auth-admin.service';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, RouterModule, MatMenuModule, MatButtonModule, MatDialogModule]
})
export class ToolBarComponent implements OnInit {

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  user: any = null;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private dialog: MatDialog,
    private authService: AuthService, private cdRef: ChangeDetectorRef,
    private ngxService: NgxUiLoaderService,
    private authAdminService: AuthAdminService
  ) { }


  ngOnInit() {
    const userSub = this.authService.isLoggedIn$.subscribe(status => {
      if (status) {
        this.user = this.authService.getUser();
        this.isLoggedIn = true;
        this.isAdmin = this.user?.roles === 'admin'; // ou autre nom de rôle
        console.log("User connected:", this.user);
      }
      this.cdRef.detectChanges();
    });
    this.subscriptions.push(userSub);

    // Auth admin
    const adminSub = this.authAdminService.isLoggedIn$.subscribe(status => {
      if (status) {
        this.user = this.authAdminService.getAdmin();
        this.isLoggedIn = true;
        this.isAdmin = this.user?.roles === 'admin' || this.user?.roles === 'adminn';
        console.log("Admin connected:", this.user);
      }
      this.cdRef.detectChanges();
    });
    this.subscriptions.push(adminSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }

  logout() {
    this.ngxService.start();
    console.log('user logged out');
    this.authService.logout();
    this.isLoggedIn = false;

    setTimeout(() => {
      this.ngxService.stop(); // Arrêter l'animation ou le chargement
      this.router.navigate(['/login']);
    }, 500);
  }

  logoutAdmin() {
    this.ngxService.start();
    console.log('admin logged out');
    this.authAdminService.logout();
    this.isLoggedIn = false;

    setTimeout(() => {
      this.ngxService.stop(); // Arrêter l'animation ou le chargement
      this.router.navigate(['/login-admin']);
    }, 500);
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

}