# AutoEra AI — API Specification Map

## Overview
AutoEra AI backend exposes a unified REST API versioned under `/api/v1/`.

## Endpoints Summary

### Authentication & Identity (`/api/v1/auth/`)
- `POST /api/v1/auth/login/` — Authenticate user & issue tokens.
- `POST /api/v1/auth/logout/` — Invalidate session/token.
- `GET /api/v1/auth/me/` — Get currently authenticated user details & permissions.

### Organization Management (`/api/v1/organization/`)
- `GET /api/v1/organization/hierarchy/` — Get tenant structure.
- `GET /api/v1/organization/branches/` — List accessible branches.

### Customer 360 (`/api/v1/customers/`)
- `GET /api/v1/customers/` — Search and list customers.
- `POST /api/v1/customers/` — Create new customer profile.
- `GET /api/v1/customers/{id}/360/` — Complete 360 view (vehicles, service history, leads).

### Vehicle Registry (`/api/v1/vehicles/`)
- `GET /api/v1/vehicles/` — List registered vehicles.
- `GET /api/v1/vehicles/{id}/history/` — Full service and ownership history.

### Sales & Leads (`/api/v1/sales/`)
- `GET /api/v1/sales/leads/` — Pipeline leads listing.
- `POST /api/v1/sales/leads/` — Create new lead.
- `POST /api/v1/sales/leads/{id}/qualify/` — AI lead qualification trigger.

### Service & Workshop (`/api/v1/service/`)
- `GET /api/v1/service/job-cards/` — List active job cards.
- `POST /api/v1/service/job-cards/` — Create new job card.
- `GET /api/v1/service/bays/` — Live bay utilization status.

### AI Engine & Copilot (`/api/v1/ai/`)
- `POST /api/v1/ai/copilot/chat/` — Stream AI Copilot response.
- `POST /api/v1/ai/predict/` — Run specific ML model inference.
