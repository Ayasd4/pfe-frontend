import { Component, EventEmitter, HostListener, OnInit, Output, SimpleChanges } from '@angular/core';
import { navbarData } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthAdminService } from '../dashboard-admin/services/auth-admin.service';

interface HeaderNavToggle {
  screenwidth: number;
  collapsed: boolean;
}
interface NavItem {
  routeLink: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxUiLoaderModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms',
          style({ opacity: 0 })//0
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        )
      ])
    ])
  ]
})

export class HeaderComponent implements OnInit {

  @Output() onToggleHeaderNav: EventEmitter<HeaderNavToggle> = new EventEmitter();

  //role: string | null = null;
  role: any;
  collapsed = false;
  screenwidth = 0;
  navData = navbarData;
  isLoggedIn: boolean = false;

  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router, private authAdminService: AuthAdminService) { }

  @HostListener('window: resize', ['$event'])

  onResize(event: any) {
    this.screenwidth = window.innerWidth;
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
  }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    this.collapsed = true; // Initialise l’état du menu à "réduit"

    this.authService.isLoggedIn$.subscribe(status => {  //interface réactive aux changements de connexion 
      this.isLoggedIn = status; //permet de réagir automatiquement lorsqu’un utilisateur se connecte ou se déconnecte
      if (status) {
        const user = this.authService.getUser();
        console.log('Utilisateur retourné par getUser():', user);

        if (user && user.roles) {
          this.role = user.roles; // Enregistre les rôles de l’utilisateur
          this.navData = this.getUserNavData(); // Filtre dynamiquement les éléments de navigation
        } else {
          console.warn("Aucun rôle trouvé");
        }
      } else {
        console.warn("Utilisateur non connecté");
      }
    });

    this.authAdminService.isLoggedIn$.subscribe(status => { 
      this.isLoggedIn = status; 
      if (status) {
        const admin = this.authAdminService.getAdmin();
        console.log('admin retourné par getAdmin():', admin);

        if (admin && admin.roles) {
          this.role = admin.roles;
          this.navData = this.getAdminNavData();
        } else {
          console.warn("Aucun rôle trouvé");
        }
      } else {
        console.warn("admin non connecté");
      }
    });
  }

  getUserNavData() {
    const navItems: NavItem[] = [];

    if (this.role.includes('chef de direction technique')) {

      return [

        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'vehicule', icon: 'fal fa-bus', label: 'Véhicule' },
        { routeLink: 'chauffeur', icon: 'fal fa-user-tie', label: 'chauffeur' },
        { routeLink: 'atelier', icon: 'fal fa-hard-hat', label: 'atelier' },
        { routeLink: 'technicien', icon: 'fal fa-user-hard-hat ', label: 'technicien' },

      ];

    }

    if (this.role.includes('Chef service maintenance')) {
      return [
        { routeLink: 'maintenance', icon: 'fal fa-tools', label: `demandes d'avarie` },
        { routeLink: 'diagnostic', icon: 'fal fa-clipboard-list-check ', label: 'diagnostic' },
        { routeLink: 'ordre', icon: 'fal fa-clipboard-list', label: 'ordre de travail' },
      ];
    }

    if (this.role.includes('Responsable maintenance')) {
      return [
        { routeLink: 'ordres', icon: 'fal fa-clipboard-list', label: 'ordres' },
        { routeLink: 'intervention', icon: 'fal fa-hammer', label: 'intervention' },
      ];
    }

    if (this.role.includes('chef d’agence')) {
      return [{ routeLink: 'demande', icon: 'fal fa-file-alt', label: 'demandes d’avarie' }];
    }

    if (this.role.includes('Chef service maîtrise de l\'énergie')) {
      return [
        {
          routeLink: 'etat',
          icon: 'fal fa-calendar-check',
          label: 'etat vidange'
        },

        {
          routeLink: 'stat',
          icon: 'fal fa-chart-bar',
          label: 'statistique'
        },
      ]
    }

    if (this.role.includes('Agent de saisie maîtrise de l\'énergie')) {
      return [
        {
          routeLink: 'consomation',
          icon: 'fal fa-gas-pump',
          label: 'consomation'

        },

        {
          routeLink: 'kilometrage',
          icon: 'fal fa-tachometer-alt',
          label: 'kilometrage'
        },

      ]
    }

    return [];
  }

  getAdminNavData() {
    if (this.role.includes('adminn')) {
      return [{
        routeLink: 'dashboard-admin',
        icon: 'fal fa-user',
        label: 'utilisateur'
      }]
    }
    return [];

  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });

  }

  closeHeader(): void {
    this.collapsed = false; //false
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);

  }

  logoutAdmin() {
    this.authAdminService.logout();
    this.router.navigate(['/login-admin']);

  }

  navigateToTask(task: string) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // Rediriger vers la tâche spécifique
      this.router.navigate([task]);
      window.location.reload();
    }
  }


  navigateToTaskAdmin(task: string) {
    if (!this.authAdminService.isLoggedIn()) {
      this.router.navigate(['/login-admin']);
    } else {
      // Rediriger vers la tâche spécifique
      this.router.navigate([task]);
      window.location.reload();
    }
  }

}
