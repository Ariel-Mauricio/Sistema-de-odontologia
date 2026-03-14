import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalHistory } from '../models/medical-history.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = '/api/medical-histories';

  constructor(private http: HttpClient) { }

  getAllHistories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getHistory(id: number): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/${id}`);
  }

  createHistory(history: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, history);
  }

  updateHistory(id: number, history: Partial<MedicalHistory>): Observable<MedicalHistory> {
    return this.http.put<MedicalHistory>(`${this.apiUrl}/${id}`, history);
  }

  storeMedicalHistory(history: any): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, history);
  }

  updateMedicalHistory(id: number, history: any): Observable<MedicalHistory> {
    return this.http.put<MedicalHistory>(`${this.apiUrl}/${id}`, history);
  }

  deleteMedicalHistory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getHistoryByPatient(patientId: string | number): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}
