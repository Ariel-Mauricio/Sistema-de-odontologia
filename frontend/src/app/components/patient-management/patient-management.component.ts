import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-management',
  template: `
    <section class="page-shell patient-screen">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Pacientes</h1>
          <p class="page-subtitle">{{ filteredPatients.length }} pacientes registrados</p>
        </div>
        <button (click)="openForm()" class="primary-btn">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Paciente
        </button>
      </div>

      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-4 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" [(ngModel)]="searchQuery" (input)="filterPatients()"
          placeholder="Buscar por nombre, email o cédula..."
          class="field-input pl-11">
      </div>

      <!-- Modal Form -->
      <div *ngIf="showForm" class="modal-overlay" (click)="closeOnBackdrop($event)">
        <div class="modal-box overflow-y-auto max-h-[92vh]" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">{{ editingId ? 'Editar Paciente' : 'Nuevo Paciente' }}</h2>
            <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="field-label">Nombre Completo</label>
                <input type="text" formControlName="full_name" class="field-input" placeholder="Juan Pérez">
              </div>
              <div>
                <label class="field-label">Número de Cédula</label>
                <input type="text" formControlName="document_number" class="field-input" placeholder="1234567890">
              </div>
              <div>
                <label class="field-label">Email</label>
                <input type="email" formControlName="email" class="field-input" placeholder="correo@ejemplo.com">
              </div>
              <div>
                <label class="field-label">Teléfono</label>
                <input type="text" formControlName="phone" class="field-input" placeholder="+57 300 123 4567">
              </div>
              <div>
                <label class="field-label">Fecha de Nacimiento</label>
                <input type="date" formControlName="birth_date" class="field-input">
              </div>
              <div>
                <label class="field-label">Dirección</label>
                <input type="text" formControlName="address" class="field-input" placeholder="Calle 123 # 45-67">
              </div>
            </div>
            <div class="mt-6 flex gap-3">
              <button type="submit" class="primary-btn flex-1">Guardar</button>
              <button type="button" (click)="closeForm()" class="secondary-btn flex-1">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Patient Cards Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <div *ngFor="let patient of filteredPatients" class="person-card group">
          <!-- Avatar + name -->
          <div class="flex items-start gap-3">
            <div class="person-avatar bg-indigo-100 text-indigo-700">
              {{ getInitials(patient.full_name) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-slate-900">{{ patient.full_name }}</p>
              <p class="truncate text-xs text-slate-400">{{ patient.document_number }}</p>
            </div>
          </div>
          <!-- Contact info -->
          <div class="space-y-1.5 pt-1">
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="truncate">{{ patient.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>{{ patient.phone }}</span>
            </div>
          </div>
          <!-- Actions — visible on hover -->
          <div class="flex gap-2 border-t border-slate-100 pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button (click)="editPatient(patient)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700">
              Editar
            </button>
            <div class="w-px bg-slate-100"></div>
            <button (click)="deletePatient(patient.id)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600">
              Eliminar
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredPatients.length === 0"
          class="col-span-full flex flex-col items-center py-16 text-slate-400">
          <svg class="mb-3 h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p class="text-sm">No se encontraron pacientes</p>
        </div>

      </div>
    </section>
  `,
  styles: []
})
export class PatientManagementComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  patientForm!: FormGroup;
  showForm = false;
  editingId: number | null = null;
  searchQuery = '';

  constructor(private patientService: PatientService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
  }

  initForm(): void {
    this.patientForm = this.formBuilder.group({
      full_name:       ['', Validators.required],
      document_number: ['', Validators.required],
      document_type:   ['CC'],
      email:           ['', [Validators.required, Validators.email]],
      phone:           ['', Validators.required],
      birth_date:      ['', Validators.required],
      gender:          [''],
      address:         ['', Validators.required],
      city:            ['Bogotá'],
      state:           ['Cundinamarca'],
      postal_code:     ['110111'],
      allergies:       [''],
      diseases:        [''],
      medications:     ['']
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res) => {
        this.patients = res.data || [];
        this.filteredPatients = this.patients;
      },
      error: (err) => console.error(err)
    });
  }

  filterPatients(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      p.full_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.document_number?.toLowerCase().includes(q)
    );
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.patientForm.reset({ document_type: 'CC', city: 'Bogotá', state: 'Cundinamarca', postal_code: '110111' });
  }

  closeForm(): void {
    this.showForm = false;
    this.patientForm.reset();
  }

  closeOnBackdrop(event: MouseEvent): void {
    this.closeForm();
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;
    if (this.editingId) {
      this.patientService.updatePatient(this.editingId, this.patientForm.value).subscribe({
        next: () => { this.loadPatients(); this.closeForm(); }
      });
    } else {
      this.patientService.createPatient(this.patientForm.value).subscribe({
        next: () => { this.loadPatients(); this.closeForm(); }
      });
    }
  }

  editPatient(patient: Patient): void {
    this.editingId = patient.id;
    this.patientForm.patchValue(patient);
    this.showForm = true;
  }

  deletePatient(id: number): void {
    if (confirm('¿Confirma eliminar este paciente?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => this.loadPatients()
      });
    }
  }
}

