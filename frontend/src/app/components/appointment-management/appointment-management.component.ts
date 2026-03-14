import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-appointment-management',
  template: `
    <section class="page-shell appointment-screen">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Citas</h1>
          <p class="page-subtitle">{{ filteredAppointments.length }} citas encontradas</p>
        </div>
        <button (click)="openForm()" class="primary-btn">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Cita
        </button>
      </div>

      <!-- Status Filter Chips -->
      <div class="flex flex-wrap gap-2">
        <button (click)="activeFilter=''; applyFilter()"
          [ngClass]="activeFilter==='' ? 'filter-chip filter-chip-active' : 'filter-chip'">
          Todas
        </button>
        <button (click)="activeFilter='pending'; applyFilter()"
          [ngClass]="activeFilter==='pending' ? 'filter-chip filter-chip-active' : 'filter-chip'">
          Pendientes
        </button>
        <button (click)="activeFilter='confirmed'; applyFilter()"
          [ngClass]="activeFilter==='confirmed' ? 'filter-chip filter-chip-active' : 'filter-chip'">
          Confirmadas
        </button>
        <button (click)="activeFilter='completed'; applyFilter()"
          [ngClass]="activeFilter==='completed' ? 'filter-chip filter-chip-active' : 'filter-chip'">
          Completadas
        </button>
        <button (click)="activeFilter='cancelled'; applyFilter()"
          [ngClass]="activeFilter==='cancelled' ? 'filter-chip filter-chip-active' : 'filter-chip'">
          Canceladas
        </button>
      </div>

      <!-- Modal Form -->
      <div *ngIf="showForm" class="modal-overlay" (click)="closeOnBackdrop($event)">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">{{ editingId ? 'Editar Cita' : 'Nueva Cita' }}</h2>
            <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="field-label">Paciente</label>
                <select formControlName="patient_id" class="field-input">
                  <option value="">Seleccionar paciente</option>
                  <option *ngFor="let p of patients" [value]="p.id">{{ p.full_name }}</option>
                </select>
              </div>
              <div>
                <label class="field-label">Doctor (ID)</label>
                <input type="text" formControlName="doctor_id" class="field-input" placeholder="ID del doctor">
              </div>
              <div>
                <label class="field-label">Fecha y Hora</label>
                <input type="datetime-local" formControlName="appointment_date" class="field-input">
              </div>
              <div>
                <label class="field-label">Duración (minutos)</label>
                <input type="number" formControlName="duration_minutes" class="field-input" placeholder="30">
              </div>
              <div class="md:col-span-2">
                <label class="field-label">Motivo</label>
                <textarea formControlName="reason" class="field-input" rows="2" placeholder="Motivo de la consulta"></textarea>
              </div>
            </div>
            <div class="mt-6 flex gap-3">
              <button type="submit" class="primary-btn flex-1">Guardar</button>
              <button type="button" (click)="closeForm()" class="secondary-btn flex-1">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Appointment Timeline Cards -->
      <div class="space-y-3">
        <div *ngFor="let appt of filteredAppointments" class="appt-item group">

          <!-- Time column -->
          <div class="appt-time-badge">
            <span class="text-xs font-bold text-indigo-700">{{ appt.appointment_date | date:'HH:mm' }}</span>
            <span class="mt-0.5 text-[10px] leading-none text-indigo-400">{{ appt.appointment_date | date:'d MMM' }}</span>
            <span class="text-[10px] leading-none text-indigo-300">{{ appt.appointment_date | date:'yyyy' }}</span>
          </div>

          <!-- Patient avatar + info -->
          <div class="flex flex-1 min-w-0 items-center gap-3">
            <div class="person-avatar shrink-0 bg-indigo-50 text-indigo-700 text-xs"
              style="width:2rem;height:2rem;min-width:2rem;">
              {{ getInitials(appt.patient?.full_name) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-slate-900">{{ appt.patient?.full_name }}</p>
              <p class="truncate text-sm text-slate-500">{{ appt.reason }}</p>
            </div>
          </div>

          <!-- Status + actions -->
          <div class="flex shrink-0 items-center gap-2">
            <span [ngClass]="getStatusClass(appt.status)" class="status-pill">{{ getStatusLabel(appt.status) }}</span>
            <button (click)="editAppointment(appt)"
              class="opacity-0 group-hover:opacity-100 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition">
              Editar
            </button>
            <button (click)="cancelAppointment(appt.id)"
              class="opacity-0 group-hover:opacity-100 rounded-lg px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition">
              Cancelar
            </button>
          </div>

        </div>

        <!-- Empty state -->
        <div *ngIf="filteredAppointments.length === 0"
          class="flex flex-col items-center py-16 text-slate-400">
          <svg class="mb-3 h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="text-sm">No hay citas en esta categoría</p>
        </div>
      </div>

    </section>
  `,
  styles: []
})
export class AppointmentManagementComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  patients: Patient[] = [];
  appointmentForm!: FormGroup;
  showForm = false;
  editingId: number | null = null;
  activeFilter = '';

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAppointments();
    this.loadPatients();
  }

  initForm(): void {
    this.appointmentForm = this.formBuilder.group({
      patient_id:       ['', Validators.required],
      doctor_id:        ['', Validators.required],
      appointment_date: ['', Validators.required],
      duration_minutes: [30, Validators.required],
      reason:           ['', Validators.required],
      notes:            ['']
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (res) => {
        this.appointments = res.data || [];
        this.applyFilter();
      },
      error: (err) => console.error(err)
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res) => { this.patients = res.data || []; }
    });
  }

  applyFilter(): void {
    this.filteredAppointments = this.activeFilter
      ? this.appointments.filter(a => a.status === this.activeFilter)
      : [...this.appointments];
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    const p = name.split(' ');
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.appointmentForm.reset({ duration_minutes: 30 });
  }

  closeForm(): void {
    this.showForm = false;
    this.appointmentForm.reset();
  }

  closeOnBackdrop(event: MouseEvent): void {
    this.closeForm();
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) return;
    if (this.editingId) {
      this.appointmentService.updateAppointment(this.editingId, this.appointmentForm.value).subscribe({
        next: () => { this.loadAppointments(); this.closeForm(); }
      });
    } else {
      this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
        next: () => { this.loadAppointments(); this.closeForm(); }
      });
    }
  }

  editAppointment(appointment: Appointment): void {
    this.editingId = appointment.id;
    this.appointmentForm.patchValue(appointment);
    this.showForm = true;
  }

  cancelAppointment(id: number): void {
    if (confirm('¿Cancelar esta cita?')) {
      this.appointmentService.cancelAppointment(id, 'Cancelada por el usuario').subscribe({
        next: () => this.loadAppointments()
      });
    }
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'pending':   'bg-amber-100 text-amber-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-rose-100 text-rose-800',
      'no_show':   'bg-slate-100 text-slate-600'
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  }

  getStatusLabel(status: string): string {
    const map: { [key: string]: string } = {
      'pending':   'Pendiente',
      'confirmed': 'Confirmada',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'no_show':   'No asistió'
    };
    return map[status] || status;
  }
}

