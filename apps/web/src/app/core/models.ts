export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  taxId?: string;
  address?: string;
}
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
export interface Invoice {
  id: number;
  clientId: number;
  client: Client;
  number: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentUrl?: string;
}
export interface Dashboard {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  count: number;
}
