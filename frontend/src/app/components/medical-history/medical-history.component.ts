import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { MedicalHistory } from '../../models/medical-history.model';

@Component({
  selector: 'app-medical-history',
  template: `
    <section class="page-shell medical-history-screen">
      <div class="module-hero">
        <div class="module-hero-content">
          <span class="module-hero-badge">Seguimiento clinico</span>
          <h1 class="page-title">Historias Clinicas</h1>
          <p class="page-subtitle">Vista tipo timeline para leer diagnosticos, evolucion y medicacion sin tablas rigidas.</p>
        </div>
        <div class="module-hero-actions">
          <button (click)="showForm = true" class="primary-btn">Nueva Historia</button>
        </div>
      </div>

      <div class="selector-panel">
        <div class="selector-panel-main">
          <label class="field-label">Paciente</label>
          <select (change)="onPatientChange($event)" [value]="selectedPatientId" class="field-input">
            <option value="">Seleccionar paciente</option>
            <option *ngFor="let patient of patients" [value]="patient.id">{{ patient.full_name }} ({{ patient.document_number }})</option>
          </select>
        </div>
        <div class="selector-panel-stat">
          <span class="selector-panel-label">Registros cargados</span>
          <strong>{{ medicalHistories.length }}</strong>
        </div>
      </div>

      <div class="timeline-stack" *ngIf="medicalHistories.length > 0">
        <div *ngFor="let history of medicalHistories" class="timeline-card">
          <div class="timeline-marker timeline-marker-large">
            <span>{{ history.consultation_date | date:'dd' }}</span>
            <small>{{ history.consultation_date | date:'MMM yyyy' }}</small>
          </div>
          <div class="timeline-body timeline-body-spacious">
            <div class="timeline-heading-row">
              <div>
                <p class="timeline-heading">{{ history.doctor?.name || 'Doctor no asignado' }}</p>
                <p class="timeline-copy">{{ history.diagnosis }}</p>
              </div>
              <div class="timeline-actions">
                <button (click)="editHistory(history)" class="action-pill action-pill-indigo">Editar</button>
                <button (click)="deleteHistory(history.id)" class="action-pill action-pill-rose">Eliminar</button>
              </div>
            </div>

            <div class="history-grid">
              <div class="history-block">
                <span class="history-block-label">Evolucion</span>
                <p>{{ history.evolution }}</p>
              </div>
              <div class="history-block">
                <span class="history-block-label">Medicamentos</span>
                <p>{{ history.medications }}</p>
              </div>
              <div class="history-block history-block-wide">
                <span class="history-block-label">Plan / notas</span>
                <p>{{ history.treatment_plan || 'Sin observaciones adicionales' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="medicalHistories.length === 0" class="empty-panel">
        <p>No hay historias clinicas disponibles para el paciente seleccionado.</p>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="cancelForm()">
        <div class="modal-box max-h-[92vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">
            {{ editingHistory ? 'Editar Historia Clínica' : 'Nueva Historia Clínica' }}
          </h2>

          <form [formGroup]="historyForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Paciente -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Paciente *</label>
              <select 
                formControlName="patient_id"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">-- Seleccionar --</option>
                <option *ngFor="let patient of patients" [value]="patient.id">
                  {{ patient.full_name }}
                </option>
              </select>
              <div *ngIf="historyForm.get('patient_id')?.invalid && historyForm.get('patient_id')?.touched" 
                class="text-red-500 text-sm mt-1">Requerido</div>
            </div>

            <!-- Diagnóstico -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Diagnóstico *</label>
              <textarea 
                formControlName="diagnosis"
                rows="3"
                placeholder="Describe el diagnóstico del paciente"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              <div *ngIf="historyForm.get('diagnosis')?.invalid && historyForm.get('diagnosis')?.touched" 
                class="text-red-500 text-sm mt-1">Requerido</div>
            </div>

            <!-- Evolución -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Evolución *</label>
              <textarea 
                formControlName="evolution"
                rows="3"
                placeholder="Describe la evolución del tratamiento"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              <div *ngIf="historyForm.get('evolution')?.invalid && historyForm.get('evolution')?.touched" 
                class="text-red-500 text-sm mt-1">Requerido</div>
            </div>

            <!-- Medicamentos -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Medicamentos Prescritos *</label>
              <textarea 
                formControlName="medications"
                rows="2"
                placeholder="Ej: Amoxicilina 500mg c/8h por 7 días"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              <div *ngIf="historyForm.get('medications')?.invalid && historyForm.get('medications')?.touched" 
                class="text-red-500 text-sm mt-1">Requerido</div>
            </div>

            <!-- Notas de Tratamiento -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Notas de Tratamiento</label>
              <textarea 
                formControlName="treatment_plan"
                rows="2"
                placeholder="Notas adicionales sobre el tratamiento"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 justify-end pt-4">
              <button 
                type="button"
                (click)="cancelForm()"
                class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition">
                Cancelar
              </button>
              <button 
                type="submit"
                [disabled]="historyForm.invalid"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition">
                {{ editingHistory ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class MedicalHistoryComponent implements OnInit {
  medicalHistories: MedicalHistory[] = [];
  patients: Patient[] = [];
  historyForm!: FormGroup;
  showForm = false;
  editingHistory: MedicalHistory | null = null;
  selectedPatientId: string = '';

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  initializeForm(): void {
    this.historyForm = this.fb.group({
      patient_id: ['', Validators.required],
      diagnosis: ['', Validators.required],
      evolution: ['', Validators.required],
      medications: ['', Validators.required],
      treatment_plan: ['']
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data: any) => {
        this.patients = data.data || data;
      },
      error: (error) => console.error('Error loading patients:', error)
    });
  }

  onPatientChange(event: any): void {
    const patientId = event.target.value;
    this.selectedPatientId = patientId;
    if (patientId) {
      this.loadMedicalHistories(patientId);
    }
  }

  loadMedicalHistories(patientId: string): void {
    this.medicalHistoryService.getHistoryByPatient(patientId).subscribe({
      next: (data: any) => {
        this.medicalHistories = data;
      },
      error: (error) => console.error('Error loading histories:', error)
    });
  }

  editHistory(history: MedicalHistory): void {
    this.editingHistory = history;
    this.historyForm.patchValue({
      patient_id: history.patient_id,
      diagnosis: history.diagnosis,
      evolution: history.evolution,
      medications: history.medications,
      treatment_plan: history.treatment_plan
    });
    this.showForm = true;
  }

  onSubmit(): void {
    if (this.historyForm.invalid) return;

    const formData = {
      ...this.historyForm.value,
      patient_id: parseInt(this.historyForm.value.patient_id)
    };

    if (this.editingHistory) {
      this.medicalHistoryService.updateMedicalHistory(this.editingHistory.id, formData).subscribe({
        next: () => {
          this.cancelForm();
          if (this.selectedPatientId) {
            this.loadMedicalHistories(this.selectedPatientId);
          }
        },
        error: (error) => console.error('Error updating history:', error)
      });
    } else {
      this.medicalHistoryService.storeMedicalHistory(formData).subscribe({
        next: () => {
          this.cancelForm();
          if (this.selectedPatientId) {
            this.loadMedicalHistories(this.selectedPatientId);
          }
        },
        error: (error) => console.error('Error creating history:', error)
      });
    }
  }

  deleteHistory(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta historia clínica?')) {
      this.medicalHistoryService.deleteMedicalHistory(id).subscribe({
        next: () => {
          if (this.selectedPatientId) {
            this.loadMedicalHistories(this.selectedPatientId);
          }
        },
        error: (error) => console.error('Error deleting history:', error)
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingHistory = null;
    this.initializeForm();
  }
}
