import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TreatmentPlanService } from '../../services/treatment-plan.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { TreatmentPlan, TreatmentItem } from '../../models/treatment-plan.model';

@Component({
  selector: 'app-treatment-plan',
  template: `
    <section class="page-shell treatment-plan-screen">
      <div class="module-hero">
        <div class="module-hero-content">
          <span class="module-hero-badge">Planeacion terapeutica</span>
          <h1 class="page-title">Planes de Tratamiento</h1>
          <p class="page-subtitle">Vista por tarjetas con etapas, costos, fechas y piezas dentales sin estructura tabular.</p>
        </div>
        <div class="module-hero-actions">
          <button (click)="showForm = true" class="primary-btn">Nuevo Plan</button>
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
          <span class="selector-panel-label">Planes activos</span>
          <strong>{{ treatmentPlans.length }}</strong>
        </div>
      </div>

      <div class="plan-board" *ngIf="treatmentPlans.length > 0">
        <div *ngFor="let plan of treatmentPlans" class="plan-stage-card" [ngClass]="getBorderColor(plan.status)">
          <div class="plan-stage-head">
            <div>
              <h3 class="plan-stage-title">Plan #{{ plan.id }}</h3>
              <p class="plan-stage-subtitle">Creado {{ plan.created_at | date:'mediumDate' }}</p>
            </div>
            <div class="plan-stage-actions">
              <span [ngClass]="getStatusBadge(plan.status)" class="status-pill">{{ plan.status }}</span>
              <button (click)="editPlan(plan)" class="action-pill action-pill-indigo">Editar</button>
              <button (click)="deletePlan(plan.id)" class="action-pill action-pill-rose">Eliminar</button>
            </div>
          </div>

          <div class="plan-stage-meta">
            <div><span>Inicio</span><strong>{{ plan.start_date | date:'mediumDate' }}</strong></div>
            <div><span>Fin estimado</span><strong>{{ plan.estimated_end_date | date:'mediumDate' }}</strong></div>
            <div><span>Costo</span><strong>\${{ plan.estimated_cost || 0 | number }}</strong></div>
          </div>

          <div class="history-block history-block-wide" *ngIf="plan.notes">
            <span class="history-block-label">Notas</span>
            <p>{{ plan.notes }}</p>
          </div>

          <div class="plan-items-header">
            <h4>Tratamientos incluidos</h4>
            <span>{{ plan.treatment_items?.length || 0 }} items</span>
          </div>

          <div *ngIf="plan.treatment_items && plan.treatment_items.length > 0" class="plan-items-grid">
            <div *ngFor="let item of plan.treatment_items" class="plan-item-card">
              <div class="plan-item-card-head">
                <div>
                  <p class="plan-item-title">Pieza {{ item.tooth_position }}</p>
                  <p class="plan-item-copy">{{ item.treatment_description }}</p>
                </div>
                <span [ngClass]="getItemStatusBadge(item.status)" class="status-pill">{{ item.status }}</span>
              </div>
              <div class="plan-item-card-foot">
                <span>{{ item.planned_date | date:'mediumDate' }}</span>
                <strong>\${{ item.cost | number }}</strong>
              </div>
            </div>
          </div>

          <div *ngIf="!plan.treatment_items || plan.treatment_items.length === 0" class="empty-inline-note">
            Sin tratamientos asignados.
          </div>

          <div class="pt-2">
            <button (click)="openAddItemModal(plan)" class="secondary-btn">Agregar Tratamiento</button>
          </div>
        </div>
      </div>

      <div *ngIf="treatmentPlans.length === 0" class="empty-panel">
        <p>No hay planes de tratamiento disponibles.</p>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="cancelForm()">
        <div class="modal-box max-h-[92vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">
            {{ editingPlan ? 'Editar Plan de Tratamiento' : 'Nuevo Plan de Tratamiento' }}
          </h2>

          <form [formGroup]="planForm" (ngSubmit)="onSubmitPlan()" class="space-y-4">
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
            </div>

            <!-- Fecha de Inicio -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha de Inicio *</label>
              <input 
                type="date"
                formControlName="start_date"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Fecha Final Estimada -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha Final Estimada *</label>
              <input 
                type="date"
                formControlName="estimated_end_date"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Costo Estimado -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Costo Estimado *</label>
              <input 
                type="number"
                formControlName="estimated_cost"
                placeholder="0.00"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Notas -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Notas del Plan</label>
              <textarea 
                formControlName="notes"
                rows="2"
                placeholder="Notas adicionales..."
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
                [disabled]="planForm.invalid"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition">
                {{ editingPlan ? 'Actualizar' : 'Crear Plan' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Agregar Item -->
      <div *ngIf="showAddItemForm" class="modal-overlay" (click)="cancelItemForm()">
        <div class="modal-box max-h-[92vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Agregar Tratamiento al Plan</h2>

          <form [formGroup]="itemForm" (ngSubmit)="onSubmitItem()" class="space-y-4">
            <!-- Descripción del Tratamiento -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción del Tratamiento *</label>
              <input 
                type="text"
                formControlName="treatment_description"
                placeholder="Ej: Limpieza, Restauración, etc."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Posición de la Pieza -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Posición de la Pieza (1-32) *</label>
              <input 
                type="number"
                formControlName="tooth_position"
                min="1"
                max="32"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Costo -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Costo *</label>
              <input 
                type="number"
                formControlName="cost"
                placeholder="0.00"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Fecha Planeada -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha Planeada *</label>
              <input 
                type="date"
                formControlName="planned_date"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Botones -->
            <div class="flex gap-3 justify-end pt-4">
              <button 
                type="button"
                (click)="cancelItemForm()"
                class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition">
                Cancelar
              </button>
              <button 
                type="submit"
                [disabled]="itemForm.invalid"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition">
                Agregar Tratamiento
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class TreatmentPlanComponent implements OnInit {
  treatmentPlans: TreatmentPlan[] = [];
  patients: Patient[] = [];
  planForm!: FormGroup;
  itemForm!: FormGroup;
  showForm = false;
  showAddItemForm = false;
  editingPlan: TreatmentPlan | null = null;
  selectedPlanForItem: TreatmentPlan | null = null;
  selectedPatientId: string = '';

  constructor(
    private treatmentPlanService: TreatmentPlanService,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
    this.initializeItemForm();
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  initializeForm(): void {
    this.planForm = this.fb.group({
      patient_id: ['', Validators.required],
      start_date: ['', Validators.required],
      estimated_end_date: ['', Validators.required],
      estimated_cost: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  initializeItemForm(): void {
    this.itemForm = this.fb.group({
      treatment_description: ['', Validators.required],
      tooth_position: ['', [Validators.required, Validators.min(1), Validators.max(32)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      planned_date: ['', Validators.required]
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
      this.loadTreatmentPlans(patientId);
    }
  }

  loadTreatmentPlans(patientId: string): void {
    this.treatmentPlanService.getByPatient(patientId).subscribe({
      next: (data: any) => {
        this.treatmentPlans = data;
      },
      error: (error) => console.error('Error loading plans:', error)
    });
  }

  editPlan(plan: TreatmentPlan): void {
    this.editingPlan = plan;
    this.planForm.patchValue({
      patient_id: plan.patient_id,
      start_date: this.formatDate(plan.start_date),
      estimated_end_date: this.formatDate(plan.estimated_end_date),
      estimated_cost: plan.estimated_cost,
      notes: plan.notes
    });
    this.showForm = true;
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onSubmitPlan(): void {
    if (this.planForm.invalid) return;

    const formData = {
      ...this.planForm.value,
      patient_id: parseInt(this.planForm.value.patient_id)
    };

    if (this.editingPlan) {
      this.treatmentPlanService.updateTreatmentPlan(this.editingPlan.id, formData).subscribe({
        next: () => {
          this.cancelForm();
          if (this.selectedPatientId) {
            this.loadTreatmentPlans(this.selectedPatientId);
          }
        },
        error: (error) => console.error('Error updating plan:', error)
      });
    } else {
      this.treatmentPlanService.storeTreatmentPlan(formData).subscribe({
        next: () => {
          this.cancelForm();
          if (this.selectedPatientId) {
            this.loadTreatmentPlans(this.selectedPatientId);
          }
        },
        error: (error) => console.error('Error creating plan:', error)
      });
    }
  }

  openAddItemModal(plan: TreatmentPlan): void {
    this.selectedPlanForItem = plan;
    this.showAddItemForm = true;
    this.initializeItemForm();
  }

  onSubmitItem(): void {
    if (!this.selectedPlanForItem || this.itemForm.invalid) return;

    const formData = {
      ...this.itemForm.value,
      treatment_plan_id: this.selectedPlanForItem.id
    };

    this.treatmentPlanService.addTreatmentItem(this.selectedPlanForItem.id, formData).subscribe({
      next: () => {
        this.cancelItemForm();
        if (this.selectedPatientId) {
          this.loadTreatmentPlans(this.selectedPatientId);
        }
      },
      error: (error) => console.error('Error adding item:', error)
    });
  }

  deletePlan(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este plan de tratamiento?')) {
      this.treatmentPlanService.deleteTreatmentPlan(id).subscribe({
        next: () => {
          if (this.selectedPatientId) {
            this.loadTreatmentPlans(this.selectedPatientId);
          }
        },
        error: (error) => console.error('Error deleting plan:', error)
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingPlan = null;
    this.initializeForm();
  }

  cancelItemForm(): void {
    this.showAddItemForm = false;
    this.selectedPlanForItem = null;
    this.initializeItemForm();
  }

  getBorderColor(status: string): string {
    const colors: any = {
      'pending': 'border-yellow-500',
      'in_process': 'border-blue-500',
      'completed': 'border-green-500',
      'cancelled': 'border-red-500'
    };
    return colors[status] || 'border-gray-300';
  }

  getStatusBadge(status: string): string {
    const badges: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_process': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  }

  getItemStatusBadge(status: string): string {
    const badges: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_process': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  }
}
