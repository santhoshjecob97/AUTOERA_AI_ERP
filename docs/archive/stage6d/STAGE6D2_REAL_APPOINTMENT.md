# AutoEra AI ERP — Stage 6D.2 Real Appointment Booking & Idempotency Audit

**Document ID**: `STAGE6D2-APPT-AUDIT-010`  
**Classification**: ERP Transaction & Idempotency Verification  

---

## 1. Appointment Creation Verification

### Database Record Verification

- **Table**: `sales_appointment`
- **Created Record ID**: `6a22c477-7415-4de2-a4a5-71083481993a`
- **Customer**: `Karthik Subbaraj` (`cust_a`)
- **Vehicle**: `Hyundai Creta` (`veh_a`, `TN09AB1234`)
- **Appointment Type**: `SERVICE_CHECKUP`
- **Scheduled Time**: `2026-08-23 22:00` (Next day slot)
- **Status**: `CONFIRMED`
- **Notes**: `"Service booking via Voice AI: PERIODIC"`

---

## 2. Idempotency & Duplicate Protection

To protect against network retries or duplicate webhook signals:
1. The `VoiceGateway` checks for an existing active appointment for the customer/vehicle within the target time window.
2. Replayed confirmation events return the existing `appointment_id` without creating duplicate rows.
3. In verification testing, simulated webhook replays resulted in exactly **ONE appointment** record in the database.
