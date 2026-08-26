# AutoEra AI ERP 2026 — Live Role Test Matrix & Verification

**Audit Date**: 2026-08-26  
**Status**: `[VERIFIED]`

---

## 1. Role-Based Verification Results

| Test # | Role | Test User | Credentials | Target Module | Verified Result |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TEST 1** | General Manager | `gm_apex` | `Password@123` | Management Dashboard | **PASS** |
| **TEST 2** | Service Advisor | `sa_apex` | `Password@123` | Service Operations & 360 | **PASS** |
| **TEST 3** | Technician | `tech_apex` | `Password@123` | Workshop Bays & Job Cards | **PASS** |
| **TEST 4** | Sales Manager | `salesm_apex` | `Password@123` | Sales Leads & Showroom | **PASS** |
| **TEST 5** | Finance Officer | `fin_apex` | `Password@123` | Invoices & Ledger | **PASS** |
| **TEST 6** | Insurance Officer | `ins_apex` | `Password@123` | Policies & Claims | **PASS** |

---

## 2. Session Resilience Verification

- **Browser Page Refresh (CTRL + R)**: User stays authenticated, `initAuth()` restores session from `authToken` via `/auth/me/` without dropping to login screen.
- **Token Expiry Simulation**: Axios interceptor silently refreshes `authToken` via `/auth/refresh/` and retries pending request.
- **Sign Out**: `logout()` clears tokens from `localStorage` and transitions state to `UNAUTHENTICATED`.
