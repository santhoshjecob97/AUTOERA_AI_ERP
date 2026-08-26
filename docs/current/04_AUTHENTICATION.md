# 04 — Authentication & Authorization

**Authentication Mechanism**: Django REST Framework SimpleJWT  
**Token Format**: RFC 7519 JSON Web Token (JWT) with HMAC-SHA256 signature

---

## 1. Authentication Architecture

```
[ Frontend: React Login Screen ]
               │
               │ POST /api/v1/auth/login/ { username: email, password }
               ▼
[ Backend: identity.views.LoginView ]
               │
               │ Validates User Credentials & Generates SimpleJWT Tokens
               ▼
  Response: {
    "access": "<JWT Access Token (30 min lifetime)>",
    "refresh": "<JWT Refresh Token (7 days lifetime)>",
    "user": {
      "id": "uuid",
      "username": "...",
      "email": "...",
      "role": "General Manager",
      "organization": "uuid",
      "branch": "uuid"
    }
  }
```

---

## 2. Session Management & Refresh Cycle

- **Access Token Lifetime**: 30 minutes (`ACCESS_TOKEN_LIFETIME = timedelta(minutes=30)`).
- **Refresh Token Lifetime**: 7 days (`REFRESH_TOKEN_LIFETIME = timedelta(days=7)`).
- **Rotation**: `ROTATE_REFRESH_TOKENS = True` and `BLACKLIST_AFTER_ROTATION = True`.
- **401 Handling**: Handled in `services/api.ts`. Interceptor traps `401 Unauthorized`, purges tokens from `localStorage`, and safely redirects to login screen.

---

## 3. Role-Based Access Control (RBAC)

Supported Roles:
1. `General Manager` / `Dealer Principal` — Full administrative control across Sales, Service, Finance, Insurance, Inventory.
2. `Sales Manager` / `Sales Executive` — Leads, Test Drives, Quotations, Bookings, Customer records.
3. `Service Manager` / `Service Advisor` — Service Appointments, Job Cards, Inspections, Check-Ins, Customer 360, Vehicle 360.
4. `Technician` — Assigned Job Cards, Parts Requisitions, Labour Records.
5. `Inventory Manager` — Parts Catalog, Suppliers, Stock Movements, Purchase Orders.
6. `Finance / Insurance Manager` — Invoices, Payments, Policy Renewals, Claims.
