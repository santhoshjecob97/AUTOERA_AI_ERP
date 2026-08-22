# AutoEra AI ERP — Stage 7.2 Authentication & RBAC Verification

**Document ID**: `STAGE7.2-RBAC-001`  
**Classification**: Identity Management & Role-Based Access Controls  
**Date**: August 22, 2026  

---

## 1. Verified Role Hierarchy

- `SUPER_ADMIN`: Global platform administration
- `GENERAL_MANAGER`: Full dealership read/write & high-risk action approval
- `SERVICE_MANAGER`: Workshop operations, estimate approval
- `SERVICE_ADVISOR`: Customer 360, vehicle check-in, job cards
- `TECHNICIAN`: Work order viewing, inspection notes (financial operations blocked)
- `SALES_EXECUTIVE`: Leads, quotations, vehicle booking
- `PARTS_MANAGER`: Inventory management, stock movements, POs
- `FINANCE_OFFICER`: Invoices, payments, financial reconciliation
