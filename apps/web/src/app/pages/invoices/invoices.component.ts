import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { Client, Invoice, InvoiceStatus } from "../../core/models";
@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  template: `<div class="page-title">
      <div>
        <h1>Facturas</h1>
        <p>Crea facturas y envía enlaces de pago.</p>
      </div>
      <button class="primary" (click)="show.set(true)">Nueva factura</button>
    </div>
    @if (show()) {
      <form class="card form-grid" [formGroup]="form" (ngSubmit)="save()">
        <label
          >Cliente<select formControlName="clientId">
            <option [ngValue]="0">Seleccionar</option>
            @for (c of clients(); track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
            }
          </select></label
        ><label>Valor<input formControlName="amount" type="number" /></label
        ><label
          >Moneda<select formControlName="currency">
            <option>COP</option>
            <option>USD</option>
            <option>EUR</option>
          </select></label
        ><label
          >Vencimiento<input formControlName="dueDate" type="date" /></label
        ><label class="wide"
          >Descripción<input formControlName="description"
        /></label>
        <div class="actions wide">
          <button type="button" class="ghost" (click)="show.set(false)">
            Cancelar</button
          ><button class="primary" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    }
    <div class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Vence</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          @for (i of invoices(); track i.id) {
            <tr>
              <td>
                <strong>{{ i.number }}</strong
                ><small class="block">{{ i.description }}</small>
              </td>
              <td>{{ i.client.name }}</td>
              <td>{{ i.dueDate | date: "dd/MM/yyyy" }}</td>
              <td>
                {{
                  i.amount | currency: i.currency : "symbol-narrow" : "1.0-0"
                }}
              </td>
              <td>
                <span
                  class="badge"
                  [class]="'badge ' + i.status.toLowerCase()"
                  >{{ labels[i.status] }}</span
                >
              </td>
              <td>
                @if (i.status === "DRAFT") {
                  <button class="small primary" (click)="pay(i.id)">
                    Enviar cobro
                  </button>
                } @else if (i.paymentUrl && i.status !== "PAID") {
                  <a class="small ghost" [href]="i.paymentUrl" target="_blank"
                    >Ver pago</a
                  >
                } @else {
                  —
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6">No hay facturas.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  invoices = signal<Invoice[]>([]);
  clients = signal<Client[]>([]);
  show = signal(false);
  labels: Record<InvoiceStatus, string> = {
    DRAFT: "Borrador",
    SENT: "Enviada",
    PAID: "Pagada",
    OVERDUE: "Vencida",
    CANCELLED: "Cancelada",
  };
  form = this.fb.nonNullable.group({
    clientId: [0, [Validators.required, Validators.min(1)]],
    description: ["", Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    currency: ["COP", Validators.required],
    dueDate: ["", Validators.required],
  });
  constructor() {
    this.load();
    this.api.clients().subscribe((x) => this.clients.set(x));
  }
  load() {
    this.api.invoices().subscribe((x) => this.invoices.set(x));
  }
  save() {
    if (this.form.invalid) return;
    this.api.createInvoice(this.form.getRawValue()).subscribe(() => {
      this.form.reset({
        clientId: 0,
        amount: 0,
        currency: "COP",
        description: "",
        dueDate: "",
      });
      this.show.set(false);
      this.load();
    });
  }
  pay(id: number) {
    this.api.checkout(id).subscribe((r) => {
      if (r.url) window.open(r.url, "_blank");
      this.load();
    });
  }
}
