# AutoEra AI ERP 2026 — Stage 7.1/7.2 Authentication Repair & Architecture Verification

**Audit Date**: 2026-08-26  
**Auditor**: Principal Software Architect & Lead Security Engineer  
**Status**: `[VERIFIED]`

---

## 1. Root Cause Analysis

| Issue | Root Cause | Failure Mode | Fix Implemented |
| :--- | :--- | :--- | :--- |
| **Login Error Reload Loop** | `api.ts` response interceptor performed `window.location.href = '/'` on any 401 error | When user entered incorrect credentials, login failed with 401, triggering immediate window reload instead of displaying error | Interceptor ignores 401 on `/auth/login/` and `/auth/refresh/` endpoints, allowing the UI to handle errors |
| **Session Drop on Expiry** | Missing automatic JWT refresh in Axios interceptor | When access token expired (30m), API returned 401 and wiped session | Added automatic silent refresh queue via `POST /api/v1/auth/refresh/` with retry of failed requests |
| **Infinite Loading on Init** | `initAuth()` had no timeout safeguard and hung on offline/cold start backends | If API was slow or unreachable, UI remained permanently in blank `Loading...` | Implemented 5s timeout safeguard, structured `AuthStatus` state machine (`INITIALIZING`, `AUTHENTICATED`, `UNAUTHENTICATED`), and UI recovery controls |
| **Case/Email Login Failure** | `LoginSerializer` only checked exact Django `username` | Users entering email address instead of username failed `authenticate()` | Enhanced `LoginSerializer` with automatic email-to-username resolution and case-insensitive matching |

---

## 2. Authentication State Machine

```
               ┌────────────────────────┐
               │      INITIALIZING      │
               └───────────┬────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│     AUTHENTICATED       │ │     UNAUTHENTICATED     │
│ (User Context Loaded)   │ │ (Login Screen Active)   │
└────────────┬────────────┘ └────────────┬────────────┘
             │                           │
             │ JWT Expiry (30m)          │ Valid Credentials
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│   SILENT REFRESH QUEUE  │ │   POST /auth/login/     │
│  (/auth/refresh/)       │ │   (Token Issued)        │
└─────────────────────────┘ └─────────────────────────┘
```

---

## 3. Verified Credentials Matrix

| Role | Username | Email | Password | Allowed Dashboards |
| :--- | :--- | :--- | :--- | :--- |
| **General Manager** | `gm_apex` | `gm@apex.in` | `Password@123` | All ERP Modules & Management |
| **Service Advisor** | `sa_apex` | `sa@apex.in` | `Password@123` | Service, Job Cards, 360, AI Copilot |
| **Technician** | `tech_apex` | `tech@apex.in` | `Password@123` | Workshop Bays, Job Cards, AI Assistant |
| **Sales Manager** | `salesm_apex` | `salesm@apex.in` | `Password@123` | Sales Leads, Showroom, Pricing |
| **Finance Officer** | `fin_apex` | `fin@apex.in` | `Password@123` | Invoices, Payments, Ledger |
| **Insurance Officer** | `ins_apex` | `ins@apex.in` | `Password@123` | Policies, Claims, Damage Reports |
