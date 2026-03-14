import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="topbar-shell topbar-shell-rich">
      <div class="topbar-container topbar-container-rich">
        <div class="topbar-brand topbar-brand-rich">
          <div class="topbar-brand-logo">OP</div>
          <div>
            <p class="topbar-brand-title">Odontologia Pro</p>
            <p class="topbar-brand-subtitle">Clinical Operations Suite</p>
          </div>
        </div>

        <div class="topbar-center-stack">
          <div class="topbar-command-bar">
            <div>
              <span class="topbar-command-label">Vista actual</span>
              <p class="topbar-command-value">{{ activeNavLabel }}</p>
            </div>
            <div class="topbar-command-meta">
              <span class="topbar-status-dot"></span>
              <span>{{ currentDateLabel }}</span>
            </div>
          </div>

          <div class="topbar-nav-wrap">
            <nav class="topbar-nav">
              <a *ngFor="let item of navItems"
                [routerLink]="item.path"
                routerLinkActive="topbar-link-active"
                class="topbar-link">
                {{ item.label }}
              </a>
            </nav>
          </div>
        </div>

        <div class="topbar-utility-stack">
          <div class="topbar-insight-pill">
            <span class="topbar-insight-caption">Operacion</span>
            <strong class="topbar-insight-value">Sistema activo</strong>
          </div>

          <div class="topbar-user topbar-user-rich">
            <div class="topbar-user-avatar">{{ currentUser?.name?.charAt(0) }}</div>
            <div class="topbar-user-meta">
              <p class="topbar-user-name">{{ currentUser?.name }}</p>
              <p class="topbar-user-role">{{ currentUser?.role }}</p>
            </div>
            <button (click)="logout()" class="topbar-logout-btn">Salir</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  currentUser: any = null;
  currentDateLabel = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());
  navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/patients', label: 'Pacientes' },
    { path: '/appointments', label: 'Citas' },
    { path: '/medical-histories', label: 'Historias Clínicas' },
    { path: '/treatment-plans', label: 'Planes de Tratamiento' },
    { path: '/invoices', label: 'Facturación' },
    { path: '/inventory', label: 'Inventario' },
    { path: '/reports', label: 'Reportes' },
    { path: '/users', label: 'Usuarios' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get activeNavLabel(): string {
    return this.navItems.find(item => this.router.url.startsWith(item.path))?.label || 'Panel General';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.router.navigate(['/login']);
      }
    });
  }
}
