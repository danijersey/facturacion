# InvoiceFlow

Aplicación full stack para crear clientes y facturas, generar enlaces de pago con Stripe, confirmar pagos mediante webhooks, enviar correos y marcar facturas vencidas automáticamente.

## Stack

- Angular 20
- NestJS 11
- MySQL 8
- TypeORM
- Stripe Checkout + Webhooks
- Nodemailer/Brevo
- JWT
- Docker Compose

## Inicio rápido

```bash
docker compose up -d
cp apps/api/.env.example apps/api/.env
npm run install:all
npm run dev:api
npm run dev:web
```

- Web: http://localhost:4200
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/docs

## Stripe local

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Copiar el `whsec_...` generado a `STRIPE_WEBHOOK_SECRET` y usar una clave `sk_test_...` en `STRIPE_SECRET_KEY`.

## Base de datos

Docker ejecuta automáticamente `database/init.sql`. Si usas MySQL instalado localmente, ejecuta ese archivo manualmente y configura `apps/api/.env`.

## Flujo

1. Registro o inicio de sesión.
2. Creación de cliente.
3. Creación de factura.
4. Generación y envío del enlace de Stripe.
5. Webhook confirma el pago.
6. Tarea diaria marca facturas vencidas y envía recordatorios.
