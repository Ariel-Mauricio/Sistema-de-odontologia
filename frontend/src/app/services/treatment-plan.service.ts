import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreatmentPlan } from '../models/treatment-plan.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentPlanService {
  private apiUrl = '/api/treatment-plans';

  constructor(private http: HttpClient) { }

  getAllPlans(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPlan(id: number): Observable<TreatmentPlan> {
    return this.http.get<TreatmentPlan>(`${this.apiUrl}/${id}`);
  }

  createPlan(plan: TreatmentPlan): Observable<TreatmentPlan> {
    return this.http.post<TreatmentPlan>(this.apiUrl, plan);
  }

  storeTreatmentPlan(plan: any): Observable<TreatmentPlan> {
    return this.http.post<TreatmentPlan>(this.apiUrl, plan);
  }

  updatePlan(id: number, plan: Partial<TreatmentPlan>): Observable<TreatmentPlan> {
    return this.http.put<TreatmentPlan>(`${this.apiUrl}/${id}`, plan);
  }

  updateTreatmentPlan(id: number, plan: any): Observable<TreatmentPlan> {
    return this.http.put<TreatmentPlan>(`${this.apiUrl}/${id}`, plan);
  }

  deleteTreatmentPlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addTreatmentItem(planId: number, item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${planId}/items`, item);
  }

  getPlansByPatient(patientId: number): Observable<TreatmentPlan[]> {
    return this.http.get<TreatmentPlan[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByPatient(patientId: string | number): Observable<TreatmentPlan[]> {
    return this.http.get<TreatmentPlan[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}
