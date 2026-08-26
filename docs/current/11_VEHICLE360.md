# 11 — Vehicle 360 Architecture

**Endpoint**: `GET /api/v1/vehicles/{id}/360/`

---

## 1. Aggregated Domain Context

The Vehicle 360 view provides a complete digital passport for any vehicle in the dealership system:
- **Specifications**: VIN, registration plate number, make, model, variant, year, transmission, fuel type.
- **Ownership**: Current registered owner details, ownership transfer history.
- **Service Ledger**: Chronological list of completed job cards, service check-ins, replaced parts, labour hours.
- **Active Appointments**: Upcoming scheduled maintenance visits.
- **OEM Maintenance & Recalls**: Factory recommended service intervals, overdue services, active recall notices.
- **Insurance & Warranty Status**: Policy provider, policy number, expiry date, claim history.
- **AI Health Insights**: Predicted upcoming component failures based on mileage, age, and historical diagnostic trouble codes.

---

## 2. Multi-Tenant Authorization

- Scoped strictly to the authenticated organization. Cross-tenant queries return `404 Not Found`.
