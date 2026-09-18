import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { Client } from "../../core/models";
@Component({
  imports: [ReactiveFormsModule],
  template: `<div class="page-title">
      <div>
        <h1>Clientes</h1>
        <p>Administra las personas y empresas que facturas.</p>
      </div>
      <button class="primary" (click)="show.set(true)">Nuevo cliente</button>
    </div>
    @if (show()) {
      <form class="card form-grid" [formGroup]="form" (ngSubmit)="save()">
        <label>Nombre<input formControlName="name" /></label
        ><label>Correo<input formControlName="email" type="email" /></label
        ><label>Teléfono<input formControlName="phone" /></label
        ><label>NIT / Documento<input formControlName="taxId" /></label
        ><label class="wide"
          >Dirección<input formControlName="address"
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
            <th>Cliente</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Documento</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (c of clients(); track c.id) {
            <tr>
              <td>
                <strong>{{ c.name }}</strong>
              </td>
              <td>{{ c.email }}</td>
              <td>{{ c.phone || "—" }}</td>
              <td>{{ c.taxId || "—" }}</td>
              <td>
                <button class="danger-text" (click)="remove(c.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">No hay clientes registrados.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  clients = signal<Client[]>([]);
  show = signal(false);
  form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phone: [""],
    taxId: [""],
    address: [""],
  });
  constructor() {
    this.load();
  }
  load() {
    this.api.clients().subscribe((x) => this.clients.set(x));
  }
  save() {
    if (this.form.invalid) return;
    this.api.createClient(this.form.getRawValue()).subscribe(() => {
      this.form.reset();
      this.show.set(false);
      this.load();
    });
  }
  remove(id: number) {
    if (confirm("¿Eliminar cliente?"))
      this.api.deleteClient(id).subscribe(() => this.load());
  }
}
