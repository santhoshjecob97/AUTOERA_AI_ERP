# 10 — Customer 360 Architecture

**Endpoint**: `GET /api/v1/customers/{id}/360/`

---

## 1. Aggregated Domain Context

The Customer 360 endpoint aggregates all historical dealership interactions for a given customer record:
- **Identity & Contact**: Full name, email, phone, secondary contact, address, KYC verification status.
- **Owned Vehicles**: Linked vehicles with VIN, registration number, make, model, current mileage.
- **Sales History**: Inquiries, leads, test drive logs, active bookings, quotations.
- **Service History**: Historical job cards, scheduled service appointments, inspection reports.
- **Financial Status**: Invoices, total spent, outstanding payments, credit line.
- **Insurance & Warranty**: Active policies, renewal due dates, past claims.
- **AI Interactions & Timeline**: Logged customer communications, voice call transcripts, AI recommendations.

---

## 2. Multi-Tenant Authorization

- Requesting user must belong to the same `organization_id` as the customer.
- Access attempts by unauthorized tenants return `404 Not Found`.
