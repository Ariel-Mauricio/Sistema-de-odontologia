import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentSlot } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  cancelAppointment(id: number, reason?: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { body: { cancellation_reason: reason } });
  }

  getAvailableSlots(doctorId: number, date: string): Observable<{ slots: AppointmentSlot[] }> {
    return this.http.get<{ slots: AppointmentSlot[] }>(`${this.apiUrl}/available/${doctorId}/${date}`);
  }

  getAppointmentByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getAppointmentByDoctor(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`);
  }
}
