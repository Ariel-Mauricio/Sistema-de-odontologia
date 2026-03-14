import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientManagementComponent } from './components/patient-management/patient-management.component';
import { AppointmentManagementComponent } from './components/appointment-management/appointment-management.component';
import { DentogramComponent } from './components/dentogram/dentogram.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { TreatmentPlanComponent } from './components/treatment-plan/treatment-plan.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'patients', component: PatientManagementComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentManagementComponent, canActivate: [AuthGuard] },
  { path: 'dentogram/:patientId', component: DentogramComponent, canActivate: [AuthGuard] },
  { path: 'invoices', component: InvoiceManagementComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryManagementComponent, canActivate: [AuthGuard] },
  { path: 'medical-histories', component: MedicalHistoryComponent, canActivate: [AuthGuard] },
  { path: 'treatment-plans', component: TreatmentPlanComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
