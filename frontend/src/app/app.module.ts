import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { AuthInterceptor } from './guards/auth.interceptor';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientManagementComponent } from './components/patient-management/patient-management.component';
import { AppointmentManagementComponent } from './components/appointment-management/appointment-management.component';
import { DentogramComponent } from './components/dentogram/dentogram.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { TreatmentPlanComponent } from './components/treatment-plan/treatment-plan.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PatientManagementComponent,
    AppointmentManagementComponent,
    DentogramComponent,
    InvoiceManagementComponent,
    InventoryManagementComponent,
    NavbarComponent,
    MedicalHistoryComponent,
    TreatmentPlanComponent,
    UserManagementComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    CoreModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
