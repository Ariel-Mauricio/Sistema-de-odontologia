export interface InventoryItem {
  id: number;
  clinic_id: number;
  name: string;
  description?: string;
  category: string;
  sku: string;
  quantity: number;
  minimum_stock: number;
  unit: string;
  unit_cost: number;
  supplier?: string;
  expiry_date?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
