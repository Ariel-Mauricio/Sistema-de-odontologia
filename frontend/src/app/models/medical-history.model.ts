export interface MedicalHistory {
  id: number;
  patient_id: number;
  doctor_id: number;
  clinic_id: number;
  consultation_date: string;
  diagnosis: string;
  observations?: string;
  evolution?: string;
  treatment_plan?: string;
  medications?: string;
  medications_prescribed?: string;
  recommendations?: string;
  next_visit?: string;
  created_at?: string;
  updated_at?: string;
  doctor?: any;
}
