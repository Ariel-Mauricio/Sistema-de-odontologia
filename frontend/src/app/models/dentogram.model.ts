export interface Tooth {
  number: number;
  status: 'healthy' | 'caries' | 'restoration' | 'crown' | 'implant' | 'extraction' | 'prosthesis' | 'endodontics';
  treatments: string[];
  notes: string;
}

export interface Dentogram {
  id: number;
  patient_id: number;
  clinic_id: number;
  teeth_data: { [key: string]: Tooth };
  created_at?: string;
  updated_at?: string;
}
