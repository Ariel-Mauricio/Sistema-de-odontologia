export interface Invoice {
  id: number;
  invoice_number: string;
  patient_id: number;
  clinic_id: number;
  invoice_date: string;
  due_date?: string;
  description: string;
  subtotal: number;
  tax: number;
  total: number;
  paid_amount: number;
  status: 'pending' | 'partial' | 'paid' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  payments?: Payment[];
  patient?: any;
}

export interface Payment {
  id?: number;
  invoice_id: number;
  patient_id: number;
  clinic_id: number;
  amount: number;
  payment_method: 'cash' | 'card' | 'transfer' | 'check';
  reference_number?: string;
  payment_date: string;
  receipt_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
