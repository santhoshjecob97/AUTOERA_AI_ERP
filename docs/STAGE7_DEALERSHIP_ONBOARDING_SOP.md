# AutoEra AI ERP — Stage 7 Real Dealership Pilot Onboarding SOP

**Document ID**: `STAGE7-SOP-001`  
**Classification**: Enterprise Dealership Onboarding, Master Data Ingestion & Go-Live SOP  
**Audit Date**: August 22, 2026  
**Auditor**: Enterprise Pilot Implementation Lead  

---

## 1. 10-Step Dealership Onboarding Sequence

```
[1. Organization & Dealer Group Registration]
                    │
                    ▼
[2. Branch & Workshop Bay Infrastructure Setup]
                    │
                    ▼
[3. User Provisioning & 10-Role RBAC Assignment]
                    │
                    ▼
[4. Customer & Vehicle Master Data CSV/Excel Import]
                    │
                    ▼
[5. Spare Parts Catalog & OEM Price List Ingestion]
                    │
                    ▼
[6. Dealership SOPs & Knowledge Documents RAG Indexing]
                    │
                    ▼
[7. Twilio Inbound/Outbound Phone Number Binding & Webhooks]
                    │
                    ▼
[8. Speech-to-Text & Text-to-Speech Language Calibration]
                    │
                    ▼
[9. End-to-End Pilot Smoke Test (Voice + ERP + 360)]
                    │
                    ▼
[10. Go-Live & 24/7 AI Reception Activation]
```

---

## 2. Master Data CSV/Excel Safe Import Pipeline

- **Supported Entities**: `Customers`, `Vehicles`, `Service History`, `Parts Catalog`, `Vehicle Stock`.
- **Validation Engine**: Pre-validates mandatory fields (Phone, VIN, Registration format).
- **Duplicate Prevention**: Detects existing VINs and mobile numbers; merges timeline events safely.
- **Rollback Guarantee**: Imports execute in transactional batches with dry-run preview and rollback capability.
