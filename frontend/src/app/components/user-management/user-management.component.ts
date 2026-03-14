import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-user-management',
  template: `
    <section class="page-shell user-screen">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Usuarios</h1>
          <p class="page-subtitle">{{ filteredUsers.length }} usuarios registrados</p>
        </div>
        <button (click)="showForm = true" class="primary-btn">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Usuario
        </button>
      </div>

      <!-- Filter Row -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label class="field-label">Rol</label>
          <select [(ngModel)]="filterRole" (change)="applyFilters()" class="field-input">
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Recepcionista</option>
            <option value="assistant">Asistente</option>
            <option value="patient">Paciente</option>
          </select>
        </div>
        <div>
          <label class="field-label">Clínica</label>
          <select [(ngModel)]="filterClinic" (change)="applyFilters()" class="field-input">
            <option value="">Todas las clínicas</option>
            <option *ngFor="let c of clinics" [value]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="field-label">Estado</label>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="field-input">
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>

      <!-- User Card Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <div *ngFor="let user of filteredUsers" class="person-card group"
          [ngClass]="!user.active ? 'opacity-60' : ''">

          <!-- Avatar + name -->
          <div class="flex items-start gap-3">
            <div class="person-avatar text-sm"
              [ngClass]="getRoleAvatarClass(user.role)">
              {{ getInitials(user.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-slate-900">{{ user.name }}</p>
              <p class="truncate text-xs text-slate-400">{{ user.email }}</p>
            </div>
          </div>

          <!-- Role + clinic badges -->
          <div class="flex flex-wrap gap-1.5">
            <span class="role-badge" [ngClass]="getRoleBadgeClass(user.role)">
              {{ getRoleLabel(user.role) }}
            </span>
            <span *ngIf="user.active" class="role-badge bg-emerald-100 text-emerald-700">Activo</span>
            <span *ngIf="!user.active" class="role-badge bg-slate-100 text-slate-500">Inactivo</span>
          </div>

          <div class="text-xs text-slate-400 truncate" *ngIf="user.clinic?.name">
            {{ user.clinic?.name }}
          </div>
          <div class="text-xs text-slate-400" *ngIf="user.phone">{{ user.phone }}</div>

          <!-- Actions on hover -->
          <div class="flex gap-2 border-t border-slate-100 pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button (click)="editUser(user)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition">
              Editar
            </button>
            <div class="w-px bg-slate-100"></div>
            <button (click)="toggleUserStatus(user)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
              [ngClass]="user.active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'">
              {{ user.active ? 'Desactivar' : 'Activar' }}
            </button>
            <div class="w-px bg-slate-100"></div>
            <button (click)="deleteUser(user.id)"
              class="flex-1 rounded-lg py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition">
              Eliminar
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredUsers.length === 0"
          class="col-span-full flex flex-col items-center py-16 text-slate-400">
          <svg class="mb-3 h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <p class="text-sm">No se encontraron usuarios</p>
        </div>

      </div>

      <!-- Modal Form -->
      <div *ngIf="showForm" class="modal-overlay" (click)="cancelForm()">
        <div class="modal-box overflow-y-auto max-h-[92vh]" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
            <button (click)="cancelForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="field-label">Nombre Completo</label>
                <input type="text" formControlName="name" class="field-input" placeholder="Nombre del usuario">
              </div>
              <div>
                <label class="field-label">Email</label>
                <input type="email" formControlName="email" class="field-input" placeholder="usuario@ejemplo.com">
              </div>
              <div>
                <label class="field-label">Teléfono</label>
                <input type="tel" formControlName="phone" class="field-input" placeholder="+573001234567">
              </div>
              <div>
                <label class="field-label">Rol</label>
                <select formControlName="role" class="field-input">
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Recepcionista</option>
                  <option value="assistant">Asistente</option>
                  <option value="patient">Paciente</option>
                </select>
              </div>
              <div>
                <label class="field-label">Clínica</label>
                <select formControlName="clinic_id" class="field-input">
                  <option value="">Seleccionar clínica</option>
                  <option *ngFor="let c of clinics" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div *ngIf="userForm.get('role')?.value === 'doctor'" class="md:col-span-2">
                <label class="field-label">Especialidad</label>
                <input type="text" formControlName="speciality" class="field-input" placeholder="Ej: Ortodoncia, Endodoncia…">
              </div>
              <div *ngIf="!editingUser" class="md:col-span-2">
                <label class="field-label">Contraseña</label>
                <input type="password" formControlName="password" class="field-input" placeholder="Mínimo 8 caracteres">
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" [disabled]="userForm.invalid" class="primary-btn flex-1 disabled:opacity-50">
                {{ editingUser ? 'Actualizar' : 'Crear Usuario' }}
              </button>
              <button type="button" (click)="cancelForm()" class="secondary-btn flex-1">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

    </section>
  `,
  styles: []
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  clinics: Clinic[] = [];
  userForm!: FormGroup;
  showForm = false;
  editingUser: any = null;

  filterRole   = '';
  filterClinic = '';
  filterStatus = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadClinics();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      name:       ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      phone:      ['', Validators.required],
      role:       ['', Validators.required],
      speciality: [''],
      clinic_id:  ['', Validators.required],
      password:   ['', this.editingUser ? [] : [Validators.required, Validators.minLength(8)]],
      active:     [true]
    });
  }

  loadUsers(): void {
    this.http.get<any>('/api/users').subscribe({
      next: (data) => { this.users = data.data || data; this.applyFilters(); },
      error: (err)  => console.error(err)
    });
  }

  loadClinics(): void {
    this.http.get<any>('/api/clinics').subscribe({
      next: (data) => { this.clinics = data.data || data; },
      error: (err)  => console.error(err)
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(u => {
      if (this.filterRole   && u.role !== this.filterRole) return false;
      if (this.filterClinic && u.clinic_id !== parseInt(this.filterClinic)) return false;
      if (this.filterStatus !== '' && u.active !== (this.filterStatus === 'true')) return false;
      return true;
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const p = name.split(' ');
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  getRoleAvatarClass(role: string): string {
    const map: { [key: string]: string } = {
      'admin':        'bg-indigo-100 text-indigo-700',
      'doctor':       'bg-blue-100 text-blue-700',
      'receptionist': 'bg-violet-100 text-violet-700',
      'assistant':    'bg-amber-100 text-amber-700',
      'patient':      'bg-emerald-100 text-emerald-700'
    };
    return map[role] || 'bg-slate-100 text-slate-600';
  }

  getRoleBadgeClass(role: string): string {
    const map: { [key: string]: string } = {
      'admin':        'bg-indigo-100 text-indigo-700',
      'doctor':       'bg-blue-100 text-blue-700',
      'receptionist': 'bg-violet-100 text-violet-700',
      'assistant':    'bg-amber-100 text-amber-700',
      'patient':      'bg-emerald-100 text-emerald-700'
    };
    return map[role] || 'bg-slate-100 text-slate-600';
  }

  getRoleLabel(role: string): string {
    const labels: any = {
      'admin':        'Administrador',
      'doctor':       'Doctor',
      'receptionist': 'Recepcionista',
      'assistant':    'Asistente',
      'patient':      'Paciente'
    };
    return labels[role] || role;
  }

  editUser(user: any): void {
    this.editingUser = user;
    this.initializeForm();
    this.userForm.patchValue({
      name: user.name, email: user.email, phone: user.phone,
      role: user.role, speciality: user.speciality || '',
      clinic_id: user.clinic_id, active: user.active
    });
    this.showForm = true;
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    const formData = { ...this.userForm.value, clinic_id: parseInt(this.userForm.value.clinic_id) };
    if (this.editingUser) {
      this.http.put(`/api/users/${this.editingUser.id}`, formData).subscribe({
        next: () => { this.cancelForm(); this.loadUsers(); },
        error: (err) => console.error(err)
      });
    } else {
      this.http.post('/api/users', formData).subscribe({
        next: () => { this.cancelForm(); this.loadUsers(); },
        error: (err) => console.error(err)
      });
    }
  }

  toggleUserStatus(user: any): void {
    this.http.put(`/api/users/${user.id}`, { active: !user.active }).subscribe({
      next: () => this.loadUsers()
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Eliminar este usuario permanentemente?')) {
      this.http.delete(`/api/users/${id}`).subscribe({
        next: () => this.loadUsers()
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.initializeForm();
  }
}

