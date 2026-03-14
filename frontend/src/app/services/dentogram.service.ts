import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dentogram } from '../models/dentogram.model';

@Injectable({
  providedIn: 'root'
})
export class DentogramService {
  private apiUrl = '/api/dentogram';

  constructor(private http: HttpClient) { }

  getDentogram(patientId: number): Observable<Dentogram> {
    return this.http.get<Dentogram>(`${this.apiUrl}/${patientId}`);
  }

  updateDentogram(patientId: number, dentogram: Dentogram): Observable<Dentogram> {
    return this.http.put<Dentogram>(`${this.apiUrl}/${patientId}`, dentogram);
  }

  updateTooth(patientId: number, toothNumber: number, tooth: any): Observable<Dentogram> {
    return this.http.put<Dentogram>(`${this.apiUrl}/${patientId}/tooth/${toothNumber}`, tooth);
  }
}
