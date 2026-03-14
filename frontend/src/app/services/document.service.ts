import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientDocument } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = '/api/documents';

  constructor(private http: HttpClient) { }

  getDocumentsByPatient(patientId: number): Observable<PatientDocument[]> {
    return this.http.get<PatientDocument[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  uploadDocument(patientId: number, file: File, documentType: string, description?: string): Observable<PatientDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    if (description) {
      formData.append('description', description);
    }
    return this.http.post<PatientDocument>(`${this.apiUrl}/patient/${patientId}`, formData);
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${documentId}`);
  }
}
