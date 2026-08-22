# AutoEra AI — Database Schema Reference

## Overview
PostgreSQL Database Schema design supporting multi-tenancy, RLS, and domain isolation.

## Core Schema Domains

### 1. Identity & Permissions
- `users`: Primary user accounts table.
- `roles`: RBAC Role definitions (e.g., General Manager, Service Advisor).
- `permissions`: Fine-grained permission nodes.

### 2. Multi-Tenancy
- `organizations`: Root enterprise accounts.
- `dealerships`: Dealership groups.
- `branches`: Physical locations/branches.

### 3. Customer & Vehicle Domains
- `customers`: Customer profiles & contact info.
- `vehicles`: VIN, model details, odometer, ownership mapping.

### 4. Service Domain
- `job_cards`: Core service tickets.
- `bays`: Workshop bays.
- `technicians`: Technician skill profiles and bay assignments.
