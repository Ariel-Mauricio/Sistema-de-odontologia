export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'assistant' | 'patient';
  speciality?: string;
  clinic_id?: number;
  active: boolean;
  last_login_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
