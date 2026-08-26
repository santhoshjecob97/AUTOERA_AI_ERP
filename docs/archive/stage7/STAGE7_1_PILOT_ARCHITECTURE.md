# AutoEra AI ERP — Stage 7.1 Pilot Dealership Architecture

**Document ID**: `STAGE7.1-PILOT-001`  
**Classification**: Pilot Dealership Topology, Tenant Hierarchy & Environmental Configuration  
**Audit Date**: August 22, 2026  
**Auditor**: Lead Enterprise Pilot Implementation Architect  

---

## 1. First Live Pilot Dealership Profile

- **Organization (SaaS Subscriber)**: Horizon Automotive Group India Pvt Ltd
- **Dealer Group**: Horizon Group Chennai
- **Dealership**: Horizon Hyundai 3S Dealership
- **Facility / Branch**: Anna Nagar 3S Facility (Sales, Service & Spare Parts)
- **Facility Capacity**: 16 Service Bays, 4 Express Service Bays, 2 EV High-Voltage Bays
- **Dealership Throughput**: 45–60 Repair Orders / day, ~1,500 Customer Inbound Calls / month
- **Pilot Status**: `LIVE` (Evidence Collection in Progress)
- **Timezone**: `Asia/Kolkata` (`IST` / `UTC+05:30`)

---

## 2. Dealership Tenant Hierarchy Configuration

```
[Organization: Horizon Automotive Group (Org ID: org_horizon_001)]
                           │
                           ▼
[DealerGroup: Horizon Chennai (Group ID: grp_chn_01)]
                           │
                           ▼
[Dealership: Horizon Hyundai (Dealership ID: deal_hh_01)]
                           │
                           ▼
[Branch: Anna Nagar 3S Facility (Branch ID: br_an_01)]
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
[Dept: Service]     [Dept: Sales]      [Dept: Parts]
(12 Bays, 8 Techs)  (Showroom Floor)   (Warehouse)
```
