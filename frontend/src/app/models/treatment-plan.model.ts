export interface TreatmentPlan {
  id: number;
  patient_id: number;
  doctor_id: number;
  clinic_id: number;
  name: string;
  description: string;
  start_date: string;
  estimated_end_date?: string;
  actual_end_date?: string;
  status: 'pending' | 'in_process' | 'completed' | 'cancelled';
  estimated_cost?: number;
  total_cost: number;
  paid_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  treatmentItems?: TreatmentItem[];
  treatment_items?: TreatmentItem[];
}

export interface TreatmentItem {
  id: number;
  treatment_plan_id: number;
  treatment_name: string;
  treatment_description?: string;
  description?: string;
  tooth_position?: number;
  tooth_number?: number;
  tooth_status?: string;
  cost: number;
  status: 'pending' | 'in_process' | 'completed' | 'cancelled';
  planned_date?: string;
  completed_date?: string;
  notes?: string;
}
