# AutoEra AI ERP — Stage 7.1 Master Data CSV Import SOP

**Document ID**: `STAGE7.1-IMPORT-001`  
**Classification**: Master Data Ingestion SOP, Schema Validation & Dry-Run Rollback  
**Audit Date**: August 22, 2026  
**Auditor**: Principal Data Engineer  

---

## 1. Supported Master Data CSV Formats

AutoEra AI ERP provides dedicated transactional import pipelines for dealership data:

1. **`customers.csv`**: `first_name,last_name,phone,email,address,city,state,pincode,gstin`
2. **`vehicles.csv`**: `vin,registration_number,make,model,variant,year,fuel_type,odometer_reading,customer_phone`
3. **`parts_catalog.csv`**: `part_number,name,category,oem_brand,cost_price,selling_price,safety_stock,bin_location`
4. **`service_history.csv`**: `vin,job_card_number,service_date,service_type,odometer,parts_cost,labour_cost,complaints`

---

## 2. Safety Rules & Rollback Protocol

- **Validation Phase**: Every row is strictly validated against regex rules for phone (`^[6-9]\d{9}$`), VIN (17-char alphanumeric), and Indian registration (`^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$`).
- **Dry-Run Preview**: Executes schema checks and duplicate detections in a simulated memory pass.
- **Atomic Transaction Rollback**: If more than $5\%$ of rows in a batch fail validation, the entire transaction is automatically rolled back with zero database mutations.
