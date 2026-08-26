# AutoEra AI ERP 2026 — Frontend & Backend Integration Architecture

**Audit Date**: 2026-08-26  
**Status**: `[VERIFIED]`

---

## 1. Network Communication & API Contracts

- **Frontend Host**: Vercel Edge (`https://autoera-ai-erp.vercel.app`)
- **Backend Host**: Render Managed Django Web Service (`https://<service>.onrender.com`)
- **Environment Variable**: `VITE_API_BASE_URL`
- **Authentication**: `Authorization: Bearer <access_token>`
- **Token Storage**: `localStorage` (`authToken`, `refreshToken`)
- **Transport Security**: TLS 1.3, HSTS, Restricted CORS Whitelist, Proxy SSL Headers

---

## 2. Real-Time Endpoints

| Domain | Method | Endpoint | Purpose |
| :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/login/` | Issues access (30m) and refresh (7d) JWT tokens |
| **Auth** | `POST` | `/api/v1/auth/refresh/` | Rotates access token seamlessly |
| **Auth** | `GET` | `/api/v1/auth/me/` | Retrieves authenticated user profile & tenant scope |
| **Customers** | `GET` | `/api/v1/customers/{id}/360/` | Customer 360 multi-domain ledger |
| **Vehicles** | `GET` | `/api/v1/vehicles/{id}/360/` | Vehicle 360 specs, history & recall notices |
| **AI Platform** | `POST` | `/api/v1/ai/copilot/chat/` | Server-side Gemini AI Copilot |
| **RAG** | `POST` | `/api/v1/ai/knowledge/search/` | Dense pgvector semantic search |
| **Probes** | `GET` | `/api/v1/health/` | Service health status check |
