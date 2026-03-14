import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-reports',
  template: `
    <section class="page-shell reports-screen">
      <div class="module-hero">
        <div class="module-hero-content">
          <span class="module-hero-badge">Centro analitico</span>
          <h1 class="page-title">Reportes y Analisis</h1>
          <p class="page-subtitle">Lectura visual de ingresos, citas, pacientes e inventario sin recurrir a tablas pesadas.</p>
        </div>
        <div class="module-hero-actions">
          <div class="hero-stat-chip">
            <span class="hero-stat-chip-label">Periodo</span>
            <span class="hero-stat-chip-value">{{ filterDateFrom || 'Ultimo mes' }} - {{ filterDateTo || 'Hoy' }}</span>
          </div>
          <div class="hero-stat-chip hero-stat-chip-accent">
            <span class="hero-stat-chip-label">Vista</span>
            <span class="hero-stat-chip-value">{{ activeReport }}</span>
          </div>
        </div>
      </div>

      <div class="chip-tabs">
        <button (click)="switchReport('revenue')" [ngClass]="activeReport === 'revenue' ? 'chip-tab chip-tab-active' : 'chip-tab'">Ingresos</button>
        <button (click)="switchReport('appointments')" [ngClass]="activeReport === 'appointments' ? 'chip-tab chip-tab-active' : 'chip-tab'">Citas</button>
        <button (click)="switchReport('patients')" [ngClass]="activeReport === 'patients' ? 'chip-tab chip-tab-active' : 'chip-tab'">Pacientes</button>
        <button (click)="switchReport('inventory')" [ngClass]="activeReport === 'inventory' ? 'chip-tab chip-tab-active' : 'chip-tab'">Inventario</button>
      </div>

      <div class="module-surface">
        <div class="module-surface-header">
          <div>
            <h2 class="section-heading">{{ getReportTitle() }}</h2>
            <p class="page-subtitle">Filtros ligeros con lectura en formato tarjeta y stream.</p>
          </div>
        </div>

        <div class="module-filter-grid" *ngIf="activeReport === 'revenue' || activeReport === 'appointments' || activeReport === 'patients'">
          <div>
            <label class="field-label">Desde</label>
            <input type="date" [(ngModel)]="filterDateFrom" class="field-input">
          </div>
          <div>
            <label class="field-label">Hasta</label>
            <input type="date" [(ngModel)]="filterDateTo" class="field-input">
          </div>
          <div *ngIf="activeReport === 'appointments'">
            <label class="field-label">Estado</label>
            <select [(ngModel)]="filterAppointmentStatus" class="field-input">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div class="module-filter-action">
            <button (click)="reloadActiveReport()" class="primary-btn w-full">Actualizar</button>
          </div>
        </div>

        <div *ngIf="activeReport === 'revenue'" class="visual-stack">
          <div class="metric-strip">
            <div class="metric-card-compact metric-card-emerald">
              <p class="metric-card-label">Ingresos cobrados</p>
              <p class="metric-card-value">\${{ totalRevenue | number }}</p>
            </div>
            <div class="metric-card-compact metric-card-indigo">
              <p class="metric-card-label">Facturas pagadas</p>
              <p class="metric-card-value">{{ paidInvoices }}</p>
            </div>
            <div class="metric-card-compact metric-card-amber">
              <p class="metric-card-label">Pendiente</p>
              <p class="metric-card-value">\${{ pendingAmount | number }}</p>
            </div>
          </div>

          <div class="analytics-chart-grid">
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Comparativo</p>
                  <h3 class="analytics-chart-title">Facturado vs cobrado</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas">
                <canvas baseChart [data]="revenueChartData" [type]="barChartType" [options]="barChartOptions"></canvas>
              </div>
            </div>
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Distribucion</p>
                  <h3 class="analytics-chart-title">Estado financiero</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas analytics-chart-canvas-sm">
                <canvas baseChart [data]="revenueStatusChartData" [type]="doughnutChartType" [options]="doughnutChartOptions"></canvas>
              </div>
            </div>
          </div>

          <div class="stream-list">
            <div *ngFor="let invoice of revenueInvoices" class="stream-card stream-card-accent">
              <div class="stream-meta">
                <p class="stream-title">{{ invoice.patient?.full_name || 'Paciente sin nombre' }}</p>
                <p class="stream-subtitle">{{ invoice.invoice_number }}</p>
              </div>
              <div class="stream-body-grid">
                <div>
                  <span class="stream-caption">Total</span>
                  <p class="stream-amount">\${{ invoice.total | number }}</p>
                </div>
                <div>
                  <span class="stream-caption">Pagado</span>
                  <p class="stream-amount stream-amount-positive">\${{ invoice.paid_amount | number }}</p>
                </div>
                <div>
                  <span class="stream-caption">Saldo</span>
                  <p class="stream-amount stream-amount-warn">\${{ (invoice.total - invoice.paid_amount) | number }}</p>
                </div>
              </div>
              <div class="stream-aside">
                <span [ngClass]="getStatusBadge(invoice.status)" class="status-pill">{{ invoice.status }}</span>
              </div>
            </div>

            <div *ngIf="!revenueInvoices.length" class="empty-panel">
              <p>No hay facturas dentro del periodo seleccionado.</p>
            </div>
          </div>
        </div>

        <div *ngIf="activeReport === 'appointments'" class="visual-stack">
          <div class="metric-strip metric-strip-wide">
            <div class="metric-card-compact metric-card-indigo"><p class="metric-card-label">Total</p><p class="metric-card-value">{{ totalAppointments }}</p></div>
            <div class="metric-card-compact metric-card-emerald"><p class="metric-card-label">Completadas</p><p class="metric-card-value">{{ completedAppointments }}</p></div>
            <div class="metric-card-compact metric-card-amber"><p class="metric-card-label">Pendientes</p><p class="metric-card-value">{{ pendingAppointments }}</p></div>
            <div class="metric-card-compact metric-card-rose"><p class="metric-card-label">Canceladas</p><p class="metric-card-value">{{ cancelledAppointments }}</p></div>
          </div>

          <div class="analytics-chart-grid">
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Estado</p>
                  <h3 class="analytics-chart-title">Distribucion de citas</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas analytics-chart-canvas-sm">
                <canvas baseChart [data]="appointmentStatusChartData" [type]="doughnutChartType" [options]="doughnutChartOptions"></canvas>
              </div>
            </div>
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Tendencia</p>
                  <h3 class="analytics-chart-title">Citas por fecha</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas">
                <canvas baseChart [data]="appointmentTrendChartData" [type]="lineChartType" [options]="lineChartOptions"></canvas>
              </div>
            </div>
          </div>

          <div class="stream-list">
            <div *ngFor="let apt of appointmentReports" class="timeline-card compact-timeline-card">
              <div class="timeline-marker">
                <span>{{ apt.appointment_date | date:'dd' }}</span>
                <small>{{ apt.appointment_date | date:'MMM' }}</small>
              </div>
              <div class="timeline-body">
                <div class="timeline-heading-row">
                  <div>
                    <p class="timeline-heading">{{ apt.patient?.full_name }}</p>
                    <p class="timeline-copy">{{ apt.reason || 'Consulta general' }}</p>
                  </div>
                  <span [ngClass]="getStatusBadge(apt.status)" class="status-pill">{{ apt.status }}</span>
                </div>
                <div class="timeline-detail-row">
                  <span>Doctor: {{ apt.doctor?.name || 'Sin asignar' }}</span>
                  <span>{{ apt.appointment_date | date:'shortTime' }}</span>
                </div>
              </div>
            </div>

            <div *ngIf="!appointmentReports.length" class="empty-panel">
              <p>No hay citas para esos filtros.</p>
            </div>
          </div>
        </div>

        <div *ngIf="activeReport === 'patients'" class="visual-stack">
          <div class="metric-strip">
            <div class="metric-card-compact metric-card-violet"><p class="metric-card-label">Base total</p><p class="metric-card-value">{{ totalPatients }}</p></div>
            <div class="metric-card-compact metric-card-indigo"><p class="metric-card-label">Nuevos</p><p class="metric-card-value">{{ newPatients }}</p></div>
            <div class="metric-card-compact metric-card-slate"><p class="metric-card-label">Activos</p><p class="metric-card-value">{{ activePatients }}</p></div>
          </div>

          <div class="analytics-chart-grid">
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Registro</p>
                  <h3 class="analytics-chart-title">Pacientes recientes</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas">
                <canvas baseChart [data]="patientGrowthChartData" [type]="barChartType" [options]="barChartOptions"></canvas>
              </div>
            </div>
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Mix</p>
                  <h3 class="analytics-chart-title">Base vs nuevos vs activos</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas analytics-chart-canvas-sm">
                <canvas baseChart [data]="patientMixChartData" [type]="doughnutChartType" [options]="doughnutChartOptions"></canvas>
              </div>
            </div>
          </div>

          <div class="stream-grid">
            <div *ngFor="let patient of patientReports" class="profile-tile">
              <div class="profile-tile-avatar">{{ getInitials(patient.full_name) }}</div>
              <div class="profile-tile-body">
                <p class="profile-tile-title">{{ patient.full_name }}</p>
                <p class="profile-tile-copy">{{ patient.document_number }}</p>
                <p class="profile-tile-copy">{{ patient.email }}</p>
                <p class="profile-tile-foot">Registro: {{ patient.created_at | date:'mediumDate' }}</p>
              </div>
            </div>

            <div *ngIf="!patientReports.length" class="empty-panel empty-panel-grid">
              <p>No hay pacientes nuevos en el periodo.</p>
            </div>
          </div>
        </div>

        <div *ngIf="activeReport === 'inventory'" class="visual-stack">
          <div class="metric-strip metric-strip-wide">
            <div class="metric-card-compact metric-card-indigo"><p class="metric-card-label">Items</p><p class="metric-card-value">{{ totalInventoryItems }}</p></div>
            <div class="metric-card-compact metric-card-rose"><p class="metric-card-label">Stock bajo</p><p class="metric-card-value">{{ lowStockItems }}</p></div>
            <div class="metric-card-compact metric-card-emerald"><p class="metric-card-label">Valor</p><p class="metric-card-value">\${{ totalInventoryValue | number }}</p></div>
            <div class="metric-card-compact metric-card-amber"><p class="metric-card-label">Vencidos</p><p class="metric-card-value">{{ expiredItems }}</p></div>
          </div>

          <div class="analytics-chart-grid">
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Riesgo</p>
                  <h3 class="analytics-chart-title">Salud del inventario</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas analytics-chart-canvas-sm">
                <canvas baseChart [data]="inventoryHealthChartData" [type]="doughnutChartType" [options]="doughnutChartOptions"></canvas>
              </div>
            </div>
            <div class="analytics-chart-card">
              <div class="analytics-chart-head">
                <div>
                  <p class="analytics-chart-kicker">Criticos</p>
                  <h3 class="analytics-chart-title">Stock actual vs minimo</h3>
                </div>
              </div>
              <div class="analytics-chart-canvas">
                <canvas baseChart [data]="inventoryLowStockChartData" [type]="barChartType" [options]="horizontalBarChartOptions"></canvas>
              </div>
            </div>
          </div>

          <div class="stream-grid stream-grid-wide">
            <div *ngFor="let item of lowInventoryItems" class="inventory-alert-card">
              <div class="inventory-alert-head">
                <div>
                  <p class="inventory-alert-title">{{ item.name }}</p>
                  <p class="inventory-alert-copy">{{ item.sku }}</p>
                </div>
                <span class="status-pill bg-rose-100 text-rose-700">Bajo</span>
              </div>
              <div class="inventory-alert-stats">
                <div><span>Actual</span><strong>{{ item.quantity }}</strong></div>
                <div><span>Minimo</span><strong>{{ item.minimum_stock }}</strong></div>
                <div><span>Unidad</span><strong>\${{ item.unit_cost | number }}</strong></div>
              </div>
            </div>

            <div *ngIf="!lowInventoryItems.length" class="empty-panel empty-panel-grid">
              <p>No hay alertas criticas de inventario.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class ReportsComponent implements OnInit {
  activeReport = 'revenue';
  readonly barChartType: 'bar' = 'bar';
  readonly lineChartType: 'line' = 'line';
  readonly doughnutChartType: 'doughnut' = 'doughnut';

  readonly barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.14)' }
      }
    }
  };

  readonly lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.14)' }
      }
    }
  };

  readonly doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 18,
          color: '#475569'
        }
      }
    }
  };

  readonly horizontalBarChartOptions: ChartConfiguration['options'] = {
    ...this.barChartOptions,
    indexAxis: 'y'
  };

  // Filtros
  filterDateFrom = '';
  filterDateTo = '';
  filterAppointmentStatus = '';

  // Datos de Ingresos
  revenueInvoices: any[] = [];
  totalRevenue = 0;
  paidInvoices = 0;
  pendingAmount = 0;
  revenueChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  revenueStatusChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  // Datos de Citas
  appointmentReports: any[] = [];
  totalAppointments = 0;
  completedAppointments = 0;
  confirmedAppointments = 0;
  pendingAppointments = 0;
  cancelledAppointments = 0;
  appointmentStatusChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  appointmentTrendChartData: ChartData<'line'> = { labels: [], datasets: [] };

  // Datos de Pacientes
  patientReports: any[] = [];
  totalPatients = 0;
  newPatients = 0;
  activePatients = 0;
  patientGrowthChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  patientMixChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  // Datos de Inventario
  inventoryItems: any[] = [];
  lowInventoryItems: any[] = [];
  totalInventoryItems = 0;
  lowStockItems = 0;
  totalInventoryValue = 0;
  expiredItems = 0;
  inventoryHealthChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  inventoryLowStockChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRevenueReport();
  }

  switchReport(report: string): void {
    this.activeReport = report;
    this.reloadActiveReport();
  }

  reloadActiveReport(): void {
    if (this.activeReport === 'revenue') {
      this.loadRevenueReport();
      return;
    }
    if (this.activeReport === 'appointments') {
      this.loadAppointmentReport();
      return;
    }
    if (this.activeReport === 'patients') {
      this.loadPatientReport();
      return;
    }
    this.loadInventoryReport();
  }

  getReportTitle(): string {
    const titles: Record<string, string> = {
      revenue: 'Ingresos y cobranzas',
      appointments: 'Flujo de citas',
      patients: 'Crecimiento de pacientes',
      inventory: 'Riesgo operativo de inventario'
    };
    return titles[this.activeReport] || 'Reportes';
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  loadRevenueReport(): void {
    this.http.get<any>('/api/reports/revenue', {
      params: {
        from: this.filterDateFrom || '',
        to: this.filterDateTo || ''
      }
    }).subscribe({
      next: (data) => {
        this.revenueInvoices = data.invoices || [];
        this.totalRevenue = data.total_revenue || 0;
        this.paidInvoices = data.paid_invoices || 0;
        this.pendingAmount = data.pending_amount || 0;
        this.updateRevenueCharts();
      },
      error: (error) => console.error('Error loading revenue report:', error)
    });
  }

  loadAppointmentReport(): void {
    this.http.get<any>('/api/reports/appointments', {
      params: {
        from: this.filterDateFrom || '',
        to: this.filterDateTo || '',
        status: this.filterAppointmentStatus || ''
      }
    }).subscribe({
      next: (data) => {
        this.appointmentReports = data.appointments || [];
        this.totalAppointments = data.total || 0;
        this.completedAppointments = data.completed || 0;
        this.confirmedAppointments = data.confirmed || 0;
        this.pendingAppointments = data.pending || 0;
        this.cancelledAppointments = data.cancelled || 0;
        this.updateAppointmentCharts();
      },
      error: (error) => console.error('Error loading appointment report:', error)
    });
  }

  loadPatientReport(): void {
    this.http.get<any>('/api/reports/patients', {
      params: {
        from: this.filterDateFrom || '',
        to: this.filterDateTo || ''
      }
    }).subscribe({
      next: (data) => {
        this.patientReports = data.patients || [];
        this.totalPatients = data.total_patients || 0;
        this.newPatients = data.new_patients || 0;
        this.activePatients = data.active_patients || 0;
        this.updatePatientCharts();
      },
      error: (error) => console.error('Error loading patient report:', error)
    });
  }

  loadInventoryReport(): void {
    this.http.get<any>('/api/reports/inventory').subscribe({
      next: (data) => {
        this.inventoryItems = data.items || [];
        this.totalInventoryItems = data.total_items || 0;
        this.lowStockItems = data.low_stock_count || 0;
        this.totalInventoryValue = data.total_value || 0;
        this.expiredItems = data.expired_count || 0;
        this.lowInventoryItems = data.low_stock_items || [];
        this.updateInventoryCharts();
      },
      error: (error) => console.error('Error loading inventory report:', error)
    });
  }

  getStatusBadge(status: string): string {
    const badges: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'partial': 'bg-orange-100 text-orange-800',
      'paid': 'bg-green-100 text-green-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  }

  private updateRevenueCharts(): void {
    const chartInvoices = this.revenueInvoices.slice(0, 8);
    this.revenueChartData = {
      labels: chartInvoices.map(invoice => invoice.invoice_number || `#${invoice.id}`),
      datasets: [
        {
          label: 'Total',
          data: chartInvoices.map(invoice => invoice.total || 0),
          backgroundColor: 'rgba(99, 102, 241, 0.65)',
          borderRadius: 10,
          maxBarThickness: 28
        },
        {
          label: 'Pagado',
          data: chartInvoices.map(invoice => invoice.paid_amount || 0),
          backgroundColor: 'rgba(16, 185, 129, 0.70)',
          borderRadius: 10,
          maxBarThickness: 28
        }
      ]
    };

    const partialCount = this.revenueInvoices.filter(invoice => invoice.status === 'partial').length;
    const paidCount = this.revenueInvoices.filter(invoice => invoice.status === 'paid').length;
    const pendingCount = this.revenueInvoices.filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue').length;

    this.revenueStatusChartData = {
      labels: ['Pagadas', 'Parciales', 'Pendientes'],
      datasets: [{
        data: [paidCount, partialCount, pendingCount],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 0
      }]
    };
  }

  private updateAppointmentCharts(): void {
    const groupedByDate = this.groupCountsByDate(this.appointmentReports, 'appointment_date');
    this.appointmentStatusChartData = {
      labels: ['Pendientes', 'Confirmadas', 'Completadas', 'Canceladas'],
      datasets: [{
        data: [this.pendingAppointments, this.confirmedAppointments, this.completedAppointments, this.cancelledAppointments],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#f43f5e'],
        borderWidth: 0
      }]
    };

    this.appointmentTrendChartData = {
      labels: groupedByDate.labels,
      datasets: [{
        data: groupedByDate.values,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.16)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1'
      }]
    };
  }

  private updatePatientCharts(): void {
    const chartPatients = this.patientReports.slice(0, 8);
    this.patientGrowthChartData = {
      labels: chartPatients.map(patient => this.shortenName(patient.full_name)),
      datasets: [{
        label: 'Nuevos registros',
        data: chartPatients.map(() => 1),
        backgroundColor: 'rgba(129, 140, 248, 0.75)',
        borderRadius: 10,
        maxBarThickness: 28
      }]
    };

    const otherPatients = Math.max(this.totalPatients - this.newPatients - this.activePatients, 0);
    this.patientMixChartData = {
      labels: ['Nuevos', 'Activos', 'Resto base'],
      datasets: [{
        data: [this.newPatients, this.activePatients, otherPatients],
        backgroundColor: ['#6366f1', '#0ea5e9', '#cbd5e1'],
        borderWidth: 0
      }]
    };
  }

  private updateInventoryCharts(): void {
    const healthyItems = Math.max(this.totalInventoryItems - this.lowStockItems - this.expiredItems, 0);
    this.inventoryHealthChartData = {
      labels: ['Estable', 'Stock bajo', 'Vencidos'],
      datasets: [{
        data: [healthyItems, this.lowStockItems, this.expiredItems],
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
        borderWidth: 0
      }]
    };

    const criticalItems = this.lowInventoryItems.slice(0, 6);
    this.inventoryLowStockChartData = {
      labels: criticalItems.map(item => item.name),
      datasets: [
        {
          label: 'Actual',
          data: criticalItems.map(item => item.quantity || 0),
          backgroundColor: 'rgba(244, 63, 94, 0.75)',
          borderRadius: 10,
          maxBarThickness: 20
        },
        {
          label: 'Minimo',
          data: criticalItems.map(item => item.minimum_stock || 0),
          backgroundColor: 'rgba(148, 163, 184, 0.55)',
          borderRadius: 10,
          maxBarThickness: 20
        }
      ]
    };
  }

  private groupCountsByDate(items: any[], field: string): { labels: string[]; values: number[] } {
    const counts = new Map<string, number>();
    items.forEach(item => {
      const rawDate = item?.[field];
      if (!rawDate) return;
      const label = new Date(rawDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return {
      labels: Array.from(counts.keys()),
      values: Array.from(counts.values())
    };
  }

  private shortenName(name?: string): string {
    if (!name) return 'Paciente';
    return name.length > 16 ? `${name.slice(0, 16)}...` : name;
  }
}
