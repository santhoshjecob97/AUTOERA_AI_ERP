# AutoEra AI ERP — Stage 7.1 Tenant-Scoped Feature Flags

**Document ID**: `STAGE7.1-FLAGS-001`  
**Classification**: Granular Feature Flag Architecture & Scoped Rollout Governance  
**Audit Date**: August 22, 2026  
**Auditor**: Principal SaaS Systems Architect  

---

## 1. Feature Flag Configuration for Pilot Dealership

All experimental and production AI features are governed via tenant-specific feature flags:

| Feature Flag Identifier | Description | Scope Level | Status for Horizon Pilot | Default Global State |
| :--- | :--- | :---: | :---: | :---: |
| `AI_COPILOT` | AI Copilot Chat Drawer | Tenant / Role | **ENABLED (All Staff)** | Disabled |
| `AI_SERVICE_ADVISOR` | Grounded Repair Diagnosis | Service Dept | **ENABLED (SA / SM / GM)** | Disabled |
| `AI_SALES_AGENT` | Showroom Quotations & Stock | Sales Dept | **ENABLED (Sales Staff)** | Disabled |
| `AI_PARTS_AGENT` | Inventory & Reorder Intelligence| Parts Dept | **ENABLED (Parts Manager)**| Disabled |
| `AI_CRM_AGENT` | Retention & Follow-up Scheduling| CRM Dept | **ENABLED (CRM Team)** | Disabled |
| `AI_FINANCE_AGENT` | Invoice Reconciliation & Tax | Finance Dept | **ENABLED (Accountants)** | Disabled |
| `AI_INSURANCE_AGENT`| Cashless Claims & Surveyor SOPs | Insurance Dept | **ENABLED (Insurance)** | Disabled |
| `MANAGEMENT_COPILOT`| Executive KPI & Workshop Summary | Executive | **ENABLED (GM / DP)** | Disabled |
| `VOICE_AGENT` | 24/7 AI Inbound Telephony | Inbound PSTN | **ENABLED (Pilot DID)** | Disabled |
| `VOICE_OUTBOUND` | Automated Outbound Reminders | Scheduled Cron| **ENABLED (Whitelisted)** | Disabled |
| `RAG_KNOWLEDGE` | Hybrid Vector Knowledge Engine | All | **ENABLED (Org Scoped)** | Disabled |
| `CUSTOMER_360` | Full Customer 360 Aggregation | Sales / Service| **ENABLED (Org Scoped)** | Enabled |
| `VEHICLE_360` | Full Vehicle 360 Aggregation | Service / Sales| **ENABLED (Org Scoped)** | Enabled |
| `HIGH_RISK_ACTION_INTERCEPTION`| Mandatory ActionProposal | All Write Tools| **ENABLED (STRICT)** | **ENABLED (MANDATORY)** |
