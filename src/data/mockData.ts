export interface Extraction {
  id: string;
  company: string;
  customer: string;
  price: number;
  quantity: number;
  paymentMethod: string;
  deliveryType: string;
  contact: string;
  confidence: number;
  date: string;
}

export interface SourceEmail {
  id: string;
  sender: string;
  subject: string;
  date: string;
  status: "extracted" | "needs_review" | "failed";
  body: string;
}

export const extractions: Extraction[] = [
  { id: "1", company: "Acme Corp", customer: "John Smith", price: 12500, quantity: 250, paymentMethod: "Wire Transfer", deliveryType: "Express", contact: "john@acme.com", confidence: 0.95, date: "2026-02-19" },
  { id: "2", company: "Globex Inc", customer: "Sarah Chen", price: 8400, quantity: 120, paymentMethod: "Credit Card", deliveryType: "Standard", contact: "sarah@globex.io", confidence: 0.87, date: "2026-02-18" },
  { id: "3", company: "Initech", customer: "Mike Ross", price: 3200, quantity: 45, paymentMethod: "ACH", deliveryType: "Overnight", contact: "mike@initech.co", confidence: 0.62, date: "2026-02-18" },
  { id: "4", company: "Umbrella Ltd", customer: "Alice Wong", price: 19800, quantity: 500, paymentMethod: "Wire Transfer", deliveryType: "Standard", contact: "alice@umbrella.com", confidence: 0.43, date: "2026-02-17" },
  { id: "5", company: "Stark Industries", customer: "Tony Parker", price: 45000, quantity: 1000, paymentMethod: "Invoice", deliveryType: "Express", contact: "tony@stark.io", confidence: 0.91, date: "2026-02-17" },
  { id: "6", company: "Wayne Enterprises", customer: "Bruce Lee", price: 7600, quantity: 80, paymentMethod: "Credit Card", deliveryType: "Standard", contact: "bruce@wayne.com", confidence: 0.78, date: "2026-02-16" },
  { id: "7", company: "Oscorp", customer: "Norman Pace", price: 15300, quantity: 300, paymentMethod: "ACH", deliveryType: "Express", contact: "norman@oscorp.net", confidence: 0.33, date: "2026-02-15" },
  { id: "8", company: "Cyberdyne", customer: "Miles Chen", price: 22100, quantity: 400, paymentMethod: "Wire Transfer", deliveryType: "Overnight", contact: "miles@cyberdyne.ai", confidence: 0.88, date: "2026-02-15" },
];

export const sourceEmails: SourceEmail[] = [
  { id: "1", sender: "procurement@acme.com", subject: "PO #4821 - Office Supplies Q1", date: "2026-02-19", status: "extracted", body: "Hi Team,\n\nPlease find attached our purchase order #4821 for Q1 office supplies.\n\nItems:\n- 250x Printer Paper Reams @ $50/ea = $12,500\n- Payment: Wire Transfer\n- Delivery: Express shipping requested\n\nContact: John Smith (john@acme.com)\n\nBest regards,\nAcme Corp Procurement" },
  { id: "2", sender: "orders@globex.io", subject: "New Order - Electronics Batch", date: "2026-02-18", status: "extracted", body: "Order confirmation for 120 units of electronic components.\n\nTotal: $8,400\nPayment: Credit Card ending 4242\nDelivery: Standard (5-7 business days)\n\nCustomer: Sarah Chen\nsarah@globex.io" },
  { id: "3", sender: "mike@initech.co", subject: "Re: Quote Request - Urgent", date: "2026-02-18", status: "needs_review", body: "Thanks for the quote. We'd like to proceed with 45 units.\n\nCan you confirm the total of $3,200 and overnight delivery?\n\nWe'll pay via ACH.\n\nMike Ross\nInitech" },
  { id: "4", sender: "purchasing@umbrella.com", subject: "Bulk Order Inquiry", date: "2026-02-17", status: "failed", body: "We are interested in placing a bulk order for approximately 500 units. Could you provide pricing and availability?\n\nAlice Wong\nUmbrella Ltd\n\n[Note: Attached PDF was corrupted]" },
  { id: "5", sender: "tony@stark.io", subject: "PO-2026-0219 Confirmed", date: "2026-02-17", status: "extracted", body: "Purchase Order Confirmed\n\nPO Number: PO-2026-0219\nCompany: Stark Industries\nQuantity: 1,000 units\nTotal: $45,000\nPayment: Invoice (Net 30)\nDelivery: Express\n\nAuthorized by: Tony Parker" },
  { id: "6", sender: "noreply@wayne.com", subject: "Order #W-7891", date: "2026-02-16", status: "needs_review", body: "Automated order notification.\n\nOrder W-7891 placed by Bruce Lee.\n80 units, $7,600 total.\nCC payment.\nStandard delivery.\n\n[System-generated, please verify details]" },
];

export const stats = {
  totalExtractions: extractions.length,
  today: extractions.filter(e => e.date === "2026-02-19").length,
  pendingReview: sourceEmails.filter(e => e.status === "needs_review").length,
  avgConfidence: Math.round((extractions.reduce((sum, e) => sum + e.confidence, 0) / extractions.length) * 100),
};
