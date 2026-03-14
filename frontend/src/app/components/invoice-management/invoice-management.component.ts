import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PatientService } from '../../services/patient.service';
import { Invoice, Payment } from '../../models/invoice.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-invoice-management',
  template: `
    <section class="page-shell invoice-screen">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Facturación</h1>
          <p class="page-subtitle">Control de cuentas y cobranzas — {{ invoices.length }} facturas</p>
        </div>
        <button (click)="openForm()" class="primary-btn">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Factura
        </button>
      </div>

      <!-- Metric cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="kpi-card">
          <p class="kpi-label">Total Facturado</p>
          <p class="kpi-value mt-1">{{ getTotalBilled() | currency:'USD':'symbol':'1.0-0' }}</p>
          <div class="mt-4 progress-bar-wrap">
            <div class="progress-bar-fill bg-indigo-400" style="width:100%"></div>
          </div>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">Cobrado</p>
          <p class="kpi-value mt-1 text-emerald-600">{{ getTotalPaid() | currency:'USD':'symbol':'1.0-0' }}</p>
          <div class="mt-4 progress-bar-wrap">
            <div class="progress-bar-fill bg-emerald-400" [style.width]="getPaidPercent()+'%'"></div>
          </div>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">Pendiente</p>
          <p class="kpi-value mt-1 text-amber-600">{{ getTotalPending() | currency:'USD':'symbol':'1.0-0' }}</p>
          <div class="mt-4 progress-bar-wrap">
            <div class="progress-bar-fill bg-amber-400" [style.width]="getPendingPercent()+'%'"></div>
          </div>
        </div>
      </div>

      <!-- Status Filter Chips -->
      <div class="flex flex-wrap gap-2">
        <button (click)="activeFilter=''; applyFilter()"
          [ngClass]="activeFilter==='' ? 'filter-chip filter-chip-active' : 'filter-chip'">Todas</button>
        <button (click)="activeFilter='pending'; applyFilter()"
          [ngClass]="activeFilter==='pending' ? 'filter-chip filter-chip-active' : 'filter-chip'">Pendientes</button>
        <button (click)="activeFilter='partial'; applyFilter()"
          [ngClass]="activeFilter==='partial' ? 'filter-chip filter-chip-active' : 'filter-chip'">Parciales</button>
        <button (click)="activeFilter='paid'; applyFilter()"
          [ngClass]="activeFilter==='paid' ? 'filter-chip filter-chip-active' : 'filter-chip'">Pagadas</button>
        <button (click)="activeFilter='overdue'; applyFilter()"
          [ngClass]="activeFilter==='overdue' ? 'filter-chip filter-chip-active' : 'filter-chip'">Vencidas</button>
      </div>

      <!-- Modal Form -->
      <div *ngIf="showForm" class="modal-overlay" (click)="closeOnBackdrop($event)">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Nueva Factura</h2>
            <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="field-label">Paciente</label>
                <select formControlName="patient_id" class="field-input">
                  <option value="">Seleccionar paciente</option>
                  <option *ngFor="let p of patients" [value]="p.id">{{ p.full_name }}</option>
                </select>
              </div>
              <div>
                <label class="field-label">Subtotal</label>
                <input type="number" formControlName="subtotal" step="0.01" class="field-input">
              </div>
              <div>
                <label class="field-label">Impuesto</label>
                <input type="number" formControlName="tax" step="0.01" class="field-input">
              </div>
              <div>
                <label class="field-label">Fecha de Vencimiento</label>
                <input type="date" formControlName="due_date" class="field-input">
              </div>
              <div class="md:col-span-2">
                <label class="field-label">Descripción</label>
                <textarea formControlName="description" class="field-input" rows="2"></textarea>
              </div>
            </div>
            <div class="mt-6 flex gap-3">
              <button type="submit" class="primary-btn flex-1">Guardar</button>
              <button type="button" (click)="closeForm()" class="secondary-btn flex-1">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Invoice Cards Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div *ngFor="let invoice of filteredInvoices" class="invoice-card group">
          <!-- Patient info + status -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="person-avatar bg-indigo-50 text-indigo-700 text-xs">
                {{ getInitials(invoice.patient?.full_name) }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ invoice.patient?.full_name }}</p>
                <p class="text-xs text-slate-400 font-mono">{{ invoice.invoice_number }}</p>
              </div>
            </div>
            <span [ngClass]="getStatusClass(invoice.status)" class="status-pill shrink-0">
              {{ getStatusLabel(invoice.status) }}
            </span>
          </div>

          <!-- Amounts -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Total</span>
              <span class="font-bold text-slate-900">{{ invoice.total | currency }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Cobrado</span>
              <span class="font-semibold text-emerald-600">{{ invoice.paid_amount | currency }}</span>
            </div>
            <!-- Payment progress bar -->
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill bg-emerald-400" [style.width]="getPayPercent(invoice)+'%'"></div>
            </div>
            <p class="text-right text-xs text-slate-400">{{ getPayPercent(invoice) | number:'1.0-0' }}% cobrado</p>
          </div>

          <!-- Actions on hover -->
          <div class="flex gap-2 border-t border-slate-100 pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button (click)="payInvoice(invoice.id)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition">
              Registrar Pago
            </button>
            <div class="w-px bg-slate-100"></div>
            <button (click)="viewDetails(invoice.id)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition">
              Ver Detalle
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredInvoices.length === 0"
          class="col-span-full flex flex-col items-center py-16 text-slate-400">
          <svg class="mb-3 h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-sm">No hay facturas en esta categoría</p>
        </div>

      </div>
    </section>
  `,
  styles: []
})
export class InvoiceManagementComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  patients: Patient[] = [];
  invoiceForm!: FormGroup;
  showForm = false;
  activeFilter = '';

  constructor(
    private invoiceService: InvoiceService,
    private patientService: PatientService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInvoices();
    this.loadPatients();
  }

  initForm(): void {
    this.invoiceForm = this.formBuilder.group({
      patient_id:  ['', Validators.required],
      description: ['', Validators.required],
      subtotal:    ['', Validators.required],
      tax:         [0],
      due_date:    ['']
    });
  }

  loadInvoices(): void {
    this.invoiceService.getAllInvoices().subscribe({
      next: (res) => {
        this.invoices = res.data || [];
        this.applyFilter();
      }
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res) => { this.patients = res.data || []; }
    });
  }

  applyFilter(): void {
    this.filteredInvoices = this.activeFilter
      ? this.invoices.filter(i => i.status === this.activeFilter)
      : [...this.invoices];
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    const p = name.split(' ');
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  getTotalBilled(): number  { return this.invoices.reduce((s, i) => s + (i.total || 0), 0); }
  getTotalPaid(): number    { return this.invoices.reduce((s, i) => s + (i.paid_amount || 0), 0); }
  getTotalPending(): number { return this.getTotalBilled() - this.getTotalPaid(); }
  getPaidPercent(): number  { const t = this.getTotalBilled(); return t ? Math.round((this.getTotalPaid() / t) * 100) : 0; }
  getPendingPercent(): number { return 100 - this.getPaidPercent(); }

  getPayPercent(inv: Invoice): number {
    if (!inv.total) return 0;
    return Math.min(100, Math.round(((inv.paid_amount || 0) / inv.total) * 100));
  }

  openForm(): void { this.showForm = true; this.invoiceForm.reset({ tax: 0 }); }
  closeForm(): void { this.showForm = false; this.invoiceForm.reset(); }
  closeOnBackdrop(e: MouseEvent): void { this.closeForm(); }

  onSubmit(): void {
    if (this.invoiceForm.invalid) return;
    const v = this.invoiceForm.value;
    const total = parseFloat(v.subtotal) + parseFloat(v.tax || 0);
    this.invoiceService.createInvoice({ ...v, total }).subscribe({
      next: () => { this.loadInvoices(); this.closeForm(); }
    });
  }

  payInvoice(invoiceId: number): void {
    const amount = prompt('Ingrese el monto a pagar:');
    if (amount) {
      const payment: Payment = {
        invoice_id: invoiceId, patient_id: 0, clinic_id: 0,
        amount: parseFloat(amount),
        payment_method: 'cash',
        payment_date: new Date().toISOString()
      };
      this.invoiceService.createPayment(payment).subscribe({
        next: () => this.loadInvoices()
      });
    }
  }

  viewDetails(id: number): void { alert('Detalle de factura #' + id); }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'paid':     'bg-emerald-100 text-emerald-800',
      'partial':  'bg-blue-100 text-blue-800',
      'pending':  'bg-amber-100 text-amber-800',
      'overdue':  'bg-rose-100 text-rose-800',
      'cancelled':'bg-slate-100 text-slate-600'
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  }

  getStatusLabel(status: string): string {
    const map: { [key: string]: string } = {
      'paid':     'Pagada',
      'partial':  'Parcial',
      'pending':  'Pendiente',
      'overdue':  'Vencida',
      'cancelled':'Cancelada'
    };
    return map[status] || status;
  }
}

