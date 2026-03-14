export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  clinic_id: number;
  appointment_date: string;
  duration_minutes: number;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminder_sent?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at?: string;
  updated_at?: string;
  patient?: any;
  doctor?: any;
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
}
