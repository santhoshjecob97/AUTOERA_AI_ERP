# AutoEra AI ERP — Stage 6A AI Service Advisor Context Foundation

## 1. Context Object Specification

The AI Service Advisor consumes a structured, permission-aware, tenant-isolated context object. The AI engine is strictly prohibited from executing arbitrary SQL queries or direct unrestricted ORM access.

### Structured JSON Schema (`AIServiceAdvisorContext`)

```json
{
  "organization_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customer": {
    "id": "c7a84e91-1122-42d8-935e-04df47849405",
    "name": "Rohan Verma",
    "phone": "9876543210",
    "customer_type": "INDIVIDUAL"
  },
  "vehicle": {
    "id": "v9a84e91-3344-42d8-935e-04df47849405",
    "vin": "VIN12345678901234",
    "registration_number": "KA-01-AB-1234",
    "make": "Hyundai",
    "model": "Creta",
    "odometer": 24500,
    "warranty_valid": true
  },
  "recent_service_history": [
    {
      "job_card_number": "JC-2026-001",
      "status": "DELIVERED",
      "complaints": "15,000 km periodic service & brake noise",
      "date": "2026-02-15"
    }
  ],
  "open_job_cards": [],
  "fast_moving_parts_available": []
}
```

---

## 2. API Endpoint Verification

- **Endpoint**: `GET /api/v1/ai/service-advisor/context/?vehicle_id=<uuid>&customer_id=<uuid>`
- **RBAC**: `IsAuthenticated` with automatic tenant scoping to `request.organization_id`.
- **Security**: Foreign tenant customer or vehicle queries return empty results (`404` / `null`).
