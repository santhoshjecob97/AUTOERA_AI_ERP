-- ══════════════════════════════════════════════════════════════════════════
-- AUTOERA AI ERP — COMPLETE DATABASE ARCHITECTURE DDL (35 MASTER TABLES)
-- Section 12 Specification: 35 Tables · ER Design · Multi-Tenant · Indexing · TimescaleDB
-- ══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =========================================================================
-- 1. MULTI-TENANT CONTEXT FUNCTION FOR ROW-LEVEL SECURITY (RLS)
-- Hybrid Approach: Schema-per-Tenant (Enterprise) / Shared Schema RLS (SMB)
-- =========================================================================
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- =========================================================================
-- MASTER TABLE 1: tenants
-- =========================================================================
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'DEALER', -- DEALER, OEM, FLEET, ENTERPRISE
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'PROFESSIONAL', -- STARTER, PROFESSIONAL, ENTERPRISE
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, TRIAL
    billing_email VARCHAR(255) NOT NULL,
    storage_strategy VARCHAR(50) NOT NULL DEFAULT 'SHARED_RLS', -- SHARED_RLS, SCHEMA_PER_TENANT
    dedicated_schema_name VARCHAR(63),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_tier ON tenants(plan_tier);

-- =========================================================================
-- MASTER TABLE 2: organizations
-- =========================================================================
CREATE TABLE IF NOT EXISTS organizations (
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    pan VARCHAR(10),
    registered_address TEXT,
    org_type VARCHAR(50) NOT NULL DEFAULT 'DEALER_GROUP',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_org_tenant ON organizations(tenant_id);

-- =========================================================================
-- MASTER TABLE 3: dealerships
-- =========================================================================
CREATE TABLE IF NOT EXISTS dealerships (
    dealership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    oem_code VARCHAR(50),
    location VARCHAR(150),
    state VARCHAR(100),
    tier VARCHAR(50) DEFAULT 'TIER_1',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dealer_org ON dealerships(org_id);
CREATE INDEX IF NOT EXISTS idx_dealer_state ON dealerships(state);

-- =========================================================================
-- MASTER TABLE 4: branches
-- =========================================================================
CREATE TABLE IF NOT EXISTS branches (
    branch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealership_id UUID NOT NULL REFERENCES dealerships(dealership_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    pin VARCHAR(10),
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    type VARCHAR(50) DEFAULT '3S', -- 3S (Sales, Service, Spares), 1S, WORKSHOP
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_branch_dealer ON branches(dealership_id);
CREATE INDEX IF NOT EXISTS idx_branch_pin ON branches(pin);

-- =========================================================================
-- MASTER TABLE 5: employees
-- =========================================================================
CREATE TABLE IF NOT EXISTS employees (
    employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role_id UUID,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    skill_level VARCHAR(10) DEFAULT 'L2', -- L1, L2, L3, MASTER
    hire_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_emp_branch ON employees(branch_id);
CREATE INDEX IF NOT EXISTS idx_emp_role ON employees(role_id);
CREATE INDEX IF NOT EXISTS idx_emp_status ON employees(status);

-- =========================================================================
-- MASTER TABLE 6: roles
-- =========================================================================
CREATE TABLE IF NOT EXISTS roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    level VARCHAR(10) NOT NULL, -- L0, L1, L2, L3, L4, L5, L6, L7
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_system_role BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_roles_level ON roles(level);

-- =========================================================================
-- MASTER TABLE 7: customers
-- =========================================================================
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    segment VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, CORPORATE, FLEET, VIP
    lifecycle_stage VARCHAR(50) DEFAULT 'ACTIVE_SERVICE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cust_phone_gin ON customers USING gin (phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cust_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_cust_tenant ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cust_name_trgm ON customers USING gin (name gin_trgm_ops);

-- =========================================================================
-- MASTER TABLE 8: vehicles
-- =========================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    reg_number VARCHAR(30) UNIQUE NOT NULL,
    vin VARCHAR(17) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    fuel_type VARCHAR(30) NOT NULL, -- EV, PETROL, DIESEL, HYBRID, CNG
    colour VARCHAR(50),
    current_mileage INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_veh_reg ON vehicles(reg_number);
CREATE INDEX IF NOT EXISTS idx_veh_vin ON vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_veh_customer ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_veh_make_model ON vehicles(make, model);

-- =========================================================================
-- MASTER TABLE 9: vehicle_health
-- =========================================================================
CREATE TABLE IF NOT EXISTS vehicle_health (
    health_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    health_score NUMERIC(5,2) NOT NULL DEFAULT 100.0,
    soh_pct NUMERIC(5,2) DEFAULT 100.0,
    last_service_km INT DEFAULT 0,
    next_service_km INT DEFAULT 10000,
    battery_status VARCHAR(50) DEFAULT 'OPTIMAL',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_health_vehicle ON vehicle_health(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_health_score ON vehicle_health(health_score);
CREATE INDEX IF NOT EXISTS idx_health_recorded ON vehicle_health(recorded_at);

-- =========================================================================
-- MASTER TABLE 10: leads
-- =========================================================================
CREATE TABLE IF NOT EXISTS leads (
    lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
    vehicle_interest JSONB DEFAULT '{}'::jsonb,
    source VARCHAR(50) DEFAULT 'WALK_IN',
    ai_score INT DEFAULT 50, -- 1-100
    status VARCHAR(50) DEFAULT 'NEW',
    assigned_to UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_branch_status_score ON leads(branch_id, status, ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_lead_created ON leads(created_at);

-- =========================================================================
-- MASTER TABLE 11: test_drives
-- =========================================================================
CREATE TABLE IF NOT EXISTS test_drives (
    td_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(lead_id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    feedback_score INT,
    executive_id UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_td_lead ON test_drives(lead_id);
CREATE INDEX IF NOT EXISTS idx_td_scheduled ON test_drives(scheduled_at);

-- =========================================================================
-- MASTER TABLE 12: quotations
-- =========================================================================
CREATE TABLE IF NOT EXISTS quotations (
    quote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(lead_id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
    base_price NUMERIC(12, 2) NOT NULL,
    discount_approved NUMERIC(12, 2) DEFAULT 0.0,
    net_price NUMERIC(12, 2) NOT NULL,
    emi_options JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'ISSUED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quote_lead ON quotations(lead_id);
CREATE INDEX IF NOT EXISTS idx_quote_status ON quotations(status);

-- =========================================================================
-- MASTER TABLE 13: bookings
-- =========================================================================
CREATE TABLE IF NOT EXISTS bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(lead_id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotations(quote_id) ON DELETE SET NULL,
    booking_amount NUMERIC(12, 2) NOT NULL,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'BOOKED',
    finance_id UUID,
    insurance_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_booking_lead ON bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_booking_delivery ON bookings(delivery_date);

-- =========================================================================
-- MASTER TABLE 14: job_cards
-- =========================================================================
CREATE TABLE IF NOT EXISTS job_cards (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
    tech_id UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
    bay_id UUID,
    status VARCHAR(50) DEFAULT 'CHECKED_IN',
    complaint TEXT NOT NULL,
    ai_diagnosis JSONB DEFAULT '{}'::jsonb,
    invoice_amount NUMERIC(12, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_job_status ON job_cards(status);
CREATE INDEX IF NOT EXISTS idx_job_vehicle ON job_cards(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_job_branch_status ON job_cards(branch_id, status) WHERE status NOT IN ('DELIVERED', 'CANCELLED');

-- =========================================================================
-- MASTER TABLE 15: appointments
-- =========================================================================
CREATE TABLE IF NOT EXISTS appointments (
    appt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'PERIODIC_MAINTENANCE',
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_appt_date ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appt_branch ON appointments(branch_id);
CREATE INDEX IF NOT EXISTS idx_appt_vehicle ON appointments(vehicle_id);

-- =========================================================================
-- MASTER TABLE 16: service_records
-- =========================================================================
CREATE TABLE IF NOT EXISTS service_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_cards(job_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    parts_used JSONB DEFAULT '[]'::jsonb,
    labour_hours NUMERIC(5, 2) DEFAULT 1.0,
    cost NUMERIC(12, 2) NOT NULL,
    technician_id UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_service_vehicle ON service_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_date ON service_records(completed_at);

-- =========================================================================
-- MASTER TABLE 17: parts_inventory
-- =========================================================================
CREATE TABLE IF NOT EXISTS parts_inventory (
    part_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    part_number VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    qty_on_hand INT NOT NULL DEFAULT 0,
    reorder_point INT NOT NULL DEFAULT 5,
    unit_price NUMERIC(12, 2) NOT NULL,
    supplier_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_parts_number_branch ON parts_inventory(branch_id, part_number);
CREATE INDEX IF NOT EXISTS idx_parts_qty ON parts_inventory(qty_on_hand);

-- =========================================================================
-- MASTER TABLE 18: insurance_policies
-- =========================================================================
CREATE TABLE IF NOT EXISTS insurance_policies (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    insurer VARCHAR(100) NOT NULL,
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'COMPREHENSIVE',
    premium NUMERIC(12, 2) NOT NULL,
    ncb_pct INT DEFAULT 20,
    expiry_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_policy_expiry ON insurance_policies(expiry_date);
CREATE INDEX IF NOT EXISTS idx_policy_vehicle ON insurance_policies(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_policy_active ON insurance_policies(status) WHERE status = 'ACTIVE';

-- =========================================================================
-- MASTER TABLE 19: claims
-- =========================================================================
CREATE TABLE IF NOT EXISTS claims (
    claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES insurance_policies(policy_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    incident_date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'ACCIDENTAL',
    ai_assessment JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    settlement_amount NUMERIC(12, 2),
    insurer_ref VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_claim_policy ON claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_claim_status ON claims(status);

-- =========================================================================
-- MASTER TABLE 20: finance_applications
-- =========================================================================
CREATE TABLE IF NOT EXISTS finance_applications (
    app_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    bank VARCHAR(100) NOT NULL,
    loan_amount NUMERIC(12, 2) NOT NULL,
    tenure INT NOT NULL, -- months
    status VARCHAR(50) DEFAULT 'APPLIED',
    documents JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_finance_customer ON finance_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_status ON finance_applications(status);
CREATE INDEX IF NOT EXISTS idx_finance_bank ON finance_applications(bank);

-- =========================================================================
-- MASTER TABLE 21: fleet_vehicles
-- =========================================================================
CREATE TABLE IF NOT EXISTS fleet_vehicles (
    fleet_veh_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    obd_device_id VARCHAR(100),
    driver_id UUID,
    health_score NUMERIC(5, 2) DEFAULT 95.0,
    fuel_level NUMERIC(5, 2) DEFAULT 80.0,
    last_lat NUMERIC(9, 6),
    last_lng NUMERIC(9, 6),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fleet_org ON fleet_vehicles(org_id);
CREATE INDEX IF NOT EXISTS idx_fleet_driver ON fleet_vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_fleet_health ON fleet_vehicles(health_score);

-- =========================================================================
-- MASTER TABLE 22: obd_telemetry (TimescaleDB Hypertable)
-- =========================================================================
CREATE TABLE IF NOT EXISTS obd_telemetry (
    telemetry_id BIGSERIAL,
    fleet_veh_id UUID NOT NULL REFERENCES fleet_vehicles(fleet_veh_id) ON DELETE CASCADE,
    rpm INT,
    coolant_temp NUMERIC(5, 2),
    oil_pressure NUMERIC(5, 2),
    battery_v NUMERIC(4, 2),
    fuel_level NUMERIC(5, 2),
    speed NUMERIC(5, 2),
    dtc_codes TEXT[],
    recorded_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (fleet_veh_id, recorded_at)
);
CREATE INDEX IF NOT EXISTS idx_obd_brin_time ON obd_telemetry USING brin (recorded_at);
CREATE INDEX IF NOT EXISTS idx_obd_fleet_veh ON obd_telemetry (fleet_veh_id, recorded_at DESC);

-- Enable TimescaleDB hypertable if TimescaleDB extension is active
-- SELECT create_hypertable('obd_telemetry', 'recorded_at', if_not_exists => TRUE);

-- =========================================================================
-- MASTER TABLE 23: ev_battery_data (TimescaleDB Hypertable)
-- =========================================================================
CREATE TABLE IF NOT EXISTS ev_battery_data (
    batt_id UUID DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    soc_pct NUMERIC(5, 2) NOT NULL,
    soh_pct NUMERIC(5, 2) NOT NULL,
    cell_voltages JSONB,
    max_temp NUMERIC(5, 2),
    min_temp NUMERIC(5, 2),
    cycle_count INT,
    charge_rate NUMERIC(6, 2),
    health_score NUMERIC(5, 2),
    recorded_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (vehicle_id, recorded_at)
);
CREATE INDEX IF NOT EXISTS idx_ev_batt_brin ON ev_battery_data USING brin (recorded_at);
CREATE INDEX IF NOT EXISTS idx_ev_batt_veh ON ev_battery_data (vehicle_id, recorded_at DESC);

-- Enable TimescaleDB continuous aggregate:
-- CREATE MATERIALIZED VIEW daily_soh_avg
-- WITH (timescaledb.continuous) AS
-- SELECT vehicle_id, time_bucket('1 day', recorded_at) AS day,
--        AVG(soh_pct) AS avg_soh, MIN(soh_pct) AS min_soh
-- FROM ev_battery_data GROUP BY vehicle_id, day;

-- =========================================================================
-- MASTER TABLE 24: ai_predictions
-- =========================================================================
CREATE TABLE IF NOT EXISTS ai_predictions (
    pred_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prediction_type VARCHAR(100) NOT NULL,
    prediction_value JSONB NOT NULL,
    confidence_score NUMERIC(5, 4),
    input_features JSONB,
    outcome JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pred_entity ON ai_predictions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_pred_pending_outcome ON ai_predictions(created_at) WHERE outcome IS NULL;
CREATE INDEX IF NOT EXISTS idx_pred_val_gin ON ai_predictions USING gin (prediction_value);

-- =========================================================================
-- MASTER TABLE 25: notifications
-- =========================================================================
CREATE TABLE IF NOT EXISTS notifications (
    notif_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    channel VARCHAR(30) NOT NULL, -- WHATSAPP, SMS, EMAIL, PUSH, VOICE
    content JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notif_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notif_pending ON notifications(created_at) WHERE status = 'PENDING';
CREATE INDEX IF NOT EXISTS idx_notif_channel ON notifications(channel);

-- =========================================================================
-- MASTER TABLE 26: audit_logs (Partitioned by Month)
-- =========================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id BIGSERIAL,
    tenant_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (audit_id, created_at)
) PARTITION BY RANGE (created_at);

-- Partition creation example:
CREATE TABLE IF NOT EXISTS audit_logs_2026_09 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE INDEX IF NOT EXISTS idx_audit_brin_time ON audit_logs USING brin (created_at);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_user ON audit_logs(tenant_id, user_id);

-- =========================================================================
-- MASTER TABLE 27: subscriptions
-- =========================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    sub_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    mrr NUMERIC(12, 2) NOT NULL,
    billing_cycle VARCHAR(30) DEFAULT 'MONTHLY',
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sub_tenant_active ON subscriptions(tenant_id) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_sub_status ON subscriptions(status);

-- =========================================================================
-- MASTER TABLE 28: payments
-- =========================================================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(sub_id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'PAID',
    gateway VARCHAR(50) DEFAULT 'RAZORPAY',
    gateway_txn_id VARCHAR(150),
    processed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payment_sub ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_processed ON payments(processed_at);

-- =========================================================================
-- MASTER TABLE 29: workshop_bays
-- =========================================================================
CREATE TABLE IF NOT EXISTS workshop_bays (
    bay_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    bay_number VARCHAR(50) NOT NULL,
    bay_type VARCHAR(50) DEFAULT 'EXPRESS', -- EXPRESS, GENERAL_REPAIR, BODY_PAINT, EV_SPECIALIST
    is_active BOOLEAN DEFAULT TRUE,
    current_job_id UUID REFERENCES job_cards(job_id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'VACANT', -- VACANT, OCCUPIED, MAINTENANCE
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bay_branch_status ON workshop_bays(branch_id, status);
CREATE INDEX IF NOT EXISTS idx_bay_active ON workshop_bays(is_active);

-- =========================================================================
-- MASTER TABLE 30: technicians
-- =========================================================================
CREATE TABLE IF NOT EXISTS technicians (
    technician_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    skill_level VARCHAR(10) NOT NULL DEFAULT 'L2', -- L1, L2, L3
    hourly_rate NUMERIC(8, 2) DEFAULT 850.00,
    is_available BOOLEAN DEFAULT TRUE,
    active_job_id UUID REFERENCES job_cards(job_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tech_branch_skill ON technicians(branch_id, skill_level);
CREATE INDEX IF NOT EXISTS idx_tech_available ON technicians(is_available);

-- =========================================================================
-- MASTER TABLE 31: suppliers
-- =========================================================================
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(20),
    email VARCHAR(255),
    gstin VARCHAR(15),
    rating NUMERIC(3, 2) DEFAULT 4.5,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_supplier_org ON suppliers(org_id);
CREATE INDEX IF NOT EXISTS idx_supplier_status ON suppliers(status);

-- =========================================================================
-- MASTER TABLE 32: purchase_orders
-- =========================================================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    po_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    ordered_at TIMESTAMPTZ DEFAULT NOW(),
    expected_delivery DATE
);
CREATE INDEX IF NOT EXISTS idx_po_branch_status ON purchase_orders(branch_id, status);
CREATE INDEX IF NOT EXISTS idx_po_order_num ON purchase_orders(order_number);

-- =========================================================================
-- MASTER TABLE 33: invoices
-- =========================================================================
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES job_cards(job_id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    gst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'ISSUED',
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_invoice_cust_status ON invoices(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_invoice_num ON invoices(invoice_number);

-- =========================================================================
-- MASTER TABLE 34: charging_sessions
-- =========================================================================
CREATE TABLE IF NOT EXISTS charging_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    energy_kwh NUMERIC(8, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    peak_rate_applied BOOLEAN DEFAULT FALSE,
    charger_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_session_veh_time ON charging_sessions(vehicle_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_session_charger ON charging_sessions(charger_id);

-- =========================================================================
-- MASTER TABLE 35: customer_consents (DPDP Act Compliance)
-- =========================================================================
CREATE TABLE IF NOT EXISTS customer_consents (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    purpose VARCHAR(100) NOT NULL, -- SERVICE_REMINDER, PROMOTIONAL, TELEMETRY_AI, LOAN_OFFERS
    channel VARCHAR(50) NOT NULL, -- WHATSAPP, SMS, CALL, EMAIL
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address VARCHAR(45),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_consent_cust_purpose ON customer_consents(customer_id, purpose);
CREATE INDEX IF NOT EXISTS idx_consent_recorded ON customer_consents(recorded_at);

-- =========================================================================
-- ROW-LEVEL SECURITY (RLS) ACTIVATION ON ALL TENANT-SCOPED TABLES
-- =========================================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_tenant_customers ON customers
    FOR ALL USING (get_current_tenant_id() IS NULL OR tenant_id = get_current_tenant_id())
    WITH CHECK (get_current_tenant_id() IS NULL OR tenant_id = get_current_tenant_id());
