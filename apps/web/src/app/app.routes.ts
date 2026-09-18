import { Routes } from "@angular/router";
import { authGuard } from "./core/auth.guard";
export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./layout/shell.component").then((m) => m.ShellComponent),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: "clients",
        loadComponent: () =>
          import("./pages/clients/clients.component").then(
            (m) => m.ClientsComponent,
          ),
      },
      {
        path: "invoices",
        loadComponent: () =>
          import("./pages/invoices/invoices.component").then(
            (m) => m.InvoicesComponent,
          ),
      },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
    ],
  },
  { path: "**", redirectTo: "" },
];
