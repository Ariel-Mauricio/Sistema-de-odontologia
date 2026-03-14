export interface Clinic {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  ruc?: string;
  business_hours?: string;
  logo_path?: string;
  description?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
