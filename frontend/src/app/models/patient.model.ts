export interface Patient {
  id: number;
  full_name: string;
  document_number: string;
  document_type: string;
  birth_date: string;
  gender?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  allergies?: string;
  diseases?: string;
  medications?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_company?: string;
  insurance_policy?: string;
  credit_balance: number;
  last_visit?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
