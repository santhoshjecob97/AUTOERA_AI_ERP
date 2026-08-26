# AutoEra AI ERP 2026 — Stage 7 Live Deployment Verification Report

**Audit & Verification Date**: 2026-08-26  
**Auditor**: Principal Software Architect & Lead Security Engineer  
**Frontend Deployment**: [`https://autoera-ai-erp.vercel.app`](https://autoera-ai-erp.vercel.app)  
**Backend Infrastructure**: Render Blueprint (`autoera-backend` Web Service + `autoera-postgres` PostgreSQL 16)  
**Authentication Standard**: Django REST Framework + SimpleJWT (Access: 30m, Refresh: 7d)  
**Status**: `[READY_FOR_BACKEND_LINK]`

---

## 1. Executive Summary

The frontend user interface, branding, styling, asset paths, role detection, route protections, and JWT session handling have been audited and deployed live to Vercel.

The application communicates with the Django REST Framework backend via the `VITE_API_BASE_URL` environment variable.

```
┌─────────────────────────┐          VITE_API_BASE_URL          ┌─────────────────────────┐
│   Vercel React / Vite   ├────────────────────────────────────►│  Render Django Backend  │
│  (autoera-ai-erp.app)   │◄────────────────────────────────────┤ (*.onrender.com)        │
└─────────────────────────┘      JSON over HTTPS (JWT Bearer)   └────────────┬────────────┘
                                                                             │
                                                                             ▼
                                                                ┌─────────────────────────┐
                                                                │  PostgreSQL 16 Database │
                                                                │  (Multi-Tenant Scoped)  │
                                                                └─────────────────────────┘
```

---

## 2. Infrastructure & Environment Matrix

| Component | Target Host | Runtime | Configuration Key | Verified Status |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | Vercel Edge | Vite / React 19 / Tailwind | `VITE_API_BASE_URL` | **LIVE (Deployed)** |
| **Backend** | Render Web Service | Python 3.11 / Gunicorn | `DJANGO_SETTINGS_MODULE=config.settings` | **READY (`render.yaml`)** |
| **Database** | Render Managed DB | PostgreSQL 16 | `DATABASE_URL` | **READY (`autoera-postgres`)** |
| **AI Platform** | Google AI Studio | Gemini 3.6 Flash / Flash Lite | `GEMINI_API_KEY` | **SERVER-SIDE ONLY** |

---

## 3. Verified Pilot Accounts (Seeded via `seed_pilot_dealership`)

| Role | Username | Email | Department | Authorized Landing |
| :--- | :--- | :--- | :--- | :--- |
| **General Manager** | `gm_apex` | `gm@apex.in` | General Management | `/` (Overview) |
| **Service Advisor** | `sa_apex` | `sa@apex.in` | Service & Workshop | `/service` (Service Engine) |
| **Technician** | `tech_apex` | `tech@apex.in` | Workshop Bays | `/service/bays` (Workshop Bays) |
| **Sales Manager** | `salesm_apex` | `salesm@apex.in` | Sales & Showroom | `/sales` (Sales Engine) |
| **Finance Officer** | `fin_apex` | `fin@apex.in` | Finance & Accounts | `/finance` (Finance Engine) |
| **Insurance Officer**| `ins_apex` | `ins@apex.in` | Insurance & Claims | `/insurance` (Insurance Engine) |

---

## 4. Quality Gate & Test Execution Summary

- **Django System Check**: `python backend/manage.py check` → **0 issues**
- **Backend Test Suite**: `python backend/manage.py test core` → **84/84 tests passed (100% OK in 40.4s)**
- **TypeScript Verification**: `npx tsc --noEmit` → **0 type errors**
- **Frontend Vitest Suite**: `npx vitest run` → **11 test files / 102 tests passed (100% OK in 17.29s)**
- **Production Build**: `npm run build` → **Compiled cleanly in 12.99s**
- **Zero Raw Password Exposure**: Quick-fill buttons populated via username mappings without embedded plaintext credentials in source control.

---

## 5. Deployment Step-by-Step Guide

### Step 1: Render Backend Deployment
1. Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Blueprint**.
2. Select repository: `santhoshjecob97/AUTOERA_AI_ERP`.
3. Click **Apply**.
4. In Render Dashboard for `autoera-backend`, add your `GEMINI_API_KEY` (from [Google AI Studio](https://aistudio.google.com/)).
5. Copy your Render Web Service URL (e.g. `https://autoera-backend.onrender.com`).

### Step 2: Vercel Backend Link
1. In [Vercel Dashboard](https://vercel.com/dashboard) → **autoera-ai-erp** → **Settings** → **Environment Variables**.
2. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-render-backend-url>.onrender.com`
3. Click **Deployments** → **Redeploy**.
