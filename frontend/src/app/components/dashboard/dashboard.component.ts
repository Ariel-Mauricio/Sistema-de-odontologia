import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <section class="page-shell dashboard-screen">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">{{ today | date:'EEEE, d MMMM yyyy' }}</p>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div class="kpi-card">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Citas Hoy</p>
              <p class="kpi-value mt-1">{{ dashboardData?.today_appointments || 0 }}</p>
            </div>
            <div class="kpi-icon bg-blue-50">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 progress-bar-wrap"><div class="progress-bar-fill bg-blue-400" style="width:70%"></div></div>
        </div>

        <div class="kpi-card">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Ingresos Hoy</p>
              <p class="kpi-value mt-1">{{ dashboardData?.today_income | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="kpi-icon bg-emerald-50">
              <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 progress-bar-wrap"><div class="progress-bar-fill bg-emerald-400" style="width:55%"></div></div>
        </div>

        <div class="kpi-card">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Pacientes Nuevos</p>
              <p class="kpi-value mt-1">{{ dashboardData?.new_patients || 0 }}</p>
            </div>
            <div class="kpi-icon bg-violet-50">
              <svg class="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 progress-bar-wrap"><div class="progress-bar-fill bg-violet-400" style="width:40%"></div></div>
        </div>

        <div class="kpi-card">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Tratamientos Activos</p>
              <p class="kpi-value mt-1">{{ dashboardData?.pending_treatments || 0 }}</p>
            </div>
            <div class="kpi-icon bg-amber-50">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 progress-bar-wrap"><div class="progress-bar-fill bg-amber-400" style="width:62%"></div></div>
        </div>

      </div>

      <!-- Upcoming Appointments — card list, NO table -->
      <div class="enterprise-card enterprise-card-body">
        <div class="flex items-center justify-between mb-5">
          <h2 class="section-heading">Próximas Citas</h2>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            {{ dashboardData?.upcoming_appointments?.length || 0 }} programadas
          </span>
        </div>

        <div class="space-y-3">
          <div *ngFor="let appt of dashboardData?.upcoming_appointments" class="appt-item">
            <div class="appt-time-badge">
              <span class="text-xs font-bold text-indigo-700">{{ appt.appointment_date | date:'HH:mm' }}</span>
              <span class="mt-0.5 text-[10px] leading-none text-indigo-400">{{ appt.appointment_date | date:'d MMM' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-900 truncate">{{ appt.patient?.full_name }}</p>
              <p class="text-sm text-slate-500 truncate">{{ appt.reason || 'Consulta general' }}</p>
              <p class="text-xs text-slate-400 mt-0.5">Dr. {{ appt.doctor?.name }}</p>
            </div>
            <span [ngClass]="getStatusClass(appt.status)" class="status-pill self-start">
              {{ getStatusLabel(appt.status) }}
            </span>
          </div>

          <div *ngIf="!dashboardData?.upcoming_appointments?.length" class="flex flex-col items-center py-10 text-slate-400">
            <svg class="mb-2 h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-sm">Sin citas próximas</p>
          </div>
        </div>
      </div>

    </section>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {};
  today = new Date();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => { this.dashboardData = data; },
      error: (err) => console.error('Dashboard error:', err)
    });
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'pending':   'bg-amber-100 text-amber-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-rose-100 text-rose-800'
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  }

  getStatusLabel(status: string): string {
    const map: { [key: string]: string } = {
      'pending':   'Pendiente',
      'confirmed': 'Confirmada',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return map[status] || status;
  }
}
