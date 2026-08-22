# AutoEra AI ERP — Stage 7 Data Privacy, Compliance & Retention Audit

**Document ID**: `STAGE7-PRIVACY-001`  
**Classification**: PII Protection, Telephony Audio Masking & Data Governance  
**Audit Date**: August 22, 2026  
**Auditor**: Enterprise Data Protection Officer & Compliance Lead  

---

## 1. PII Classification & Data Protection Controls

| Data Element | Sensitivity Level | Storage Mechanism | Access Control | Masking / Redaction |
| :--- | :---: | :--- | :--- | :--- |
| **Customer Full Name** | PII | PostgreSQL `customers_customer` | RBAC Role Scoped | Displayed to authorized staff |
| **Mobile Number / Phone** | High PII | PostgreSQL `customers_customer` | Sales / Service / GM | Masked (`XXXXXX1234`) on logs |
| **Customer Email** | PII | PostgreSQL `customers_customer` | Scoped by Tenant | Redacted in AI Telemetry |
| **Vehicle VIN / Chassis** | Automotive PII | PostgreSQL `vehicles_vehicle` | Dealership Staff | Full in 360, hashed in logs |
| **Voice Audio Recordings**| High PII | Encrypted Cloud Storage | Compliance Officer | 90-day retention with deletion |
| **Voice Transcripts** | PII / Business | `ai_platform_voicetranscript` | Tenant Isolated | PII auto-scrubbed before RAG |
| **Payment / Card Data** | PCI-DSS Scope | Handled via Razorpay Tokens | Zero card data stored | Only Razorpay payment ID saved |

---

## 2. Retention & Deletion Lifecycle

- **Voice Session Logs**: Retained for 90 days for operational audit, then automatically archived.
- **AI Prompt Telemetry**: Stored without raw PII; prompt inputs sanitized to retain only automotive intent.
- **Customer Right-to-be-Forgotten**: Soft deletion cascade with automated anonymization of completed invoice records.
