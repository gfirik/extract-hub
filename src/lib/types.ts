export type SourceType = "email" | "telegram" | "meet_summary";

export interface Source {
  id: string;
  type: SourceType;
  subject: string | null;
  raw_body: string | null;
  sender: string | null;
  received_at: string | null;
  processed_at: string | null;
  status: "pending" | "extracted" | "failed";
  created_at: string;
}

export interface Extraction {
  id: string;
  source_id: string;
  company_name: string | null;
  product_name: string | null;
  customer_name: string | null;
  price: number | null;
  quantity: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  payment_method: string | null;
  delivery_type: string | null;
  delivery_deadline: string | null;
  raw_extraction: Record<string, unknown> | null;
  confidence_score: number | null;
  created_at: string;
}

export interface ExtractionWithSource extends Extraction {
  sources: Source | null;
}

export interface Stats {
  total: number;
  today: number;
  avgConfidence: number;
  topSourceType: "email" | "telegram" | null;
}
