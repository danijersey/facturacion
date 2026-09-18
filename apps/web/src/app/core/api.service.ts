import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Client, Dashboard, Invoice, InvoiceStatus } from "./models";
@Injectable({ providedIn: "root" })
export class ApiService {
  private h = inject(HttpClient);
  private url = environment.apiUrl;
  dashboard() {
    return this.h.get<Dashboard>(`${this.url}/invoices/dashboard`);
  }
  clients() {
    return this.h.get<Client[]>(`${this.url}/clients`);
  }
  createClient(x: Omit<Client, "id">) {
    return this.h.post<Client>(`${this.url}/clients`, x);
  }
  deleteClient(id: number) {
    return this.h.delete(`${this.url}/clients/${id}`);
  }
  invoices() {
    return this.h.get<Invoice[]>(`${this.url}/invoices`);
  }
  createInvoice(x: {
    clientId: number;
    description: string;
    amount: number;
    currency: string;
    dueDate: string;
  }) {
    return this.h.post<Invoice>(`${this.url}/invoices`, x);
  }
  status(id: number, status: InvoiceStatus) {
    return this.h.patch<Invoice>(`${this.url}/invoices/${id}/status`, {
      status,
    });
  }
  checkout(id: number) {
    return this.h.post<{ url: string }>(
      `${this.url}/payments/${id}/checkout`,
      {},
    );
  }
}
