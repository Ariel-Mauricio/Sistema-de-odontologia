export interface PatientDocument {
  id: number;
  patient_id: number;
  clinic_id: number;
  document_type: 'radiography' | 'photo' | 'prescription' | 'consent' | 'report' | 'other';
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description?: string;
  upload_date: string;
  uploaded_by: number;
  created_at?: string;
}
