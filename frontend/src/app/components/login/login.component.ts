import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-screen">
      <div class="login-shell">
        <section class="login-story-panel">
          <div class="login-story-copy">
            <span class="login-badge">Dental command center</span>
            <h1 class="login-title">La operación clínica en una sola superficie.</h1>
            <p class="login-subtitle">Un acceso diseñado para administración, médicos, recepción y análisis financiero con una estética más sólida y ejecutiva.</p>
          </div>

          <div class="login-stat-grid">
            <div class="login-stat-card">
              <span class="login-stat-label">Monitoreo</span>
              <strong class="login-stat-value">24/7</strong>
              <p class="login-stat-copy">Seguimiento de citas y caja en tiempo real.</p>
            </div>
            <div class="login-stat-card">
              <span class="login-stat-label">Pacientes</span>
              <strong class="login-stat-value">360</strong>
              <p class="login-stat-copy">Historia clínica, pagos y tratamientos conectados.</p>
            </div>
          </div>

          <div class="login-feature-list">
            <div class="login-feature-card">
              <span class="login-feature-kicker">Clinical flow</span>
              <p>Agenda, diagnóstico, tratamiento y cobro en un mismo flujo.</p>
            </div>
            <div class="login-feature-card">
              <span class="login-feature-kicker">Finance layer</span>
              <p>Facturación, pendientes y reportes visuales listos para gerencia.</p>
            </div>
            <div class="login-feature-card">
              <span class="login-feature-kicker">Inventory pulse</span>
              <p>Materiales críticos y alertas operativas visibles desde el primer panel.</p>
            </div>
          </div>
        </section>

        <section class="login-form-panel">
          <div class="login-form-header">
            <div>
              <span class="login-form-kicker">Acceso seguro</span>
              <h2 class="login-form-title">Iniciar Sesion</h2>
              <p class="login-form-subtitle">Ingresa con tus credenciales activas del sistema.</p>
            </div>
            <div class="login-form-chip">
              <span>Estado</span>
              <strong>Online</strong>
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="field-label">Email</label>
              <input
                type="email"
                formControlName="email"
                class="field-input login-field-input"
                placeholder="correo@clinicadental.com">
            </div>

            <div>
              <label class="field-label">Contraseña</label>
              <input
                type="password"
                formControlName="password"
                class="field-input login-field-input"
                placeholder="••••••••">
            </div>

            <div class="login-action-stack">
              <button
                type="submit"
                class="primary-btn login-submit-btn"
                [disabled]="loading">
                {{ loading ? 'Ingresando...' : 'Iniciar Sesion' }}
              </button>
              <div class="login-inline-note">
                <span class="login-inline-note-label">Demo sugerido</span>
                <strong>admin&#64;clinicadental.com</strong>
              </div>
            </div>

            <div *ngIf="loginError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {{ loginError }}
            </div>

            <div class="login-footer-row">
              <p class="text-sm text-slate-600">
                ¿No tienes cuenta? <a routerLink="/register" class="font-semibold text-indigo-600 hover:text-indigo-700">Regístrate aquí</a>
              </p>
              <div class="login-trust-pill">
                <span class="topbar-status-dot"></span>
                <span>Protección por sesión</span>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  loginError = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.authService.setCurrentUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.loginError = error?.error?.message || 'No se pudo iniciar sesión. Verifica tus credenciales.';
        console.error('Login error:', error);
      }
    });
  }
}
