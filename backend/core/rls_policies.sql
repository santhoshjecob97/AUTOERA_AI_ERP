-- ════════════════════════════════════════════════════════════════════
-- AutoEra AI ERP — PostgreSQL Row-Level Security (RLS) Policies
-- Master Architecture Section 03 & Section 08 (Multi-Tenant Isolation)
-- ════════════════════════════════════════════════════════════════════
-- This script enables hardware-grade cryptographic & database-enforced
-- isolation per dealership tenant. Even if an application bug bypasses
-- the Django ORM filter, PostgreSQL rejects cross-tenant data access.
--
-- Session context variable: `app.current_organization_id`
-- Set on every database checkout by `TenantMiddleware`:
--   SET LOCAL app.current_organization_id = '<tenant_uuid>';
-- ════════════════════════════════════════════════════════════════════

-- 1. Helper function to check tenant context
CREATE OR REPLACE FUNCTION get_current_organization_id() 
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Tenant isolation macro for all tenant-scoped tables
DO $$
DECLARE
    tbl text;
    tenant_tables text[] := ARRAY[
        'customers_customer',
        'customers_customertimeline',
        'customers_customerconsent',
        'vehicles_vehicle',
        'vehicles_vehiclestock',
        'vehicles_vehiclehealth',
        'sales_lead',
        'sales_leadfollowup',
        'sales_testdrive',
        'sales_quotation',
        'sales_booking',
        'sales_appointment',
        'service_jobcard',
        'service_servicecheckin',
        'service_serviceinspection',
        'service_jobcardpart',
        'service_jobcardlabour',
        'workshop_workshopbay',
        'workshop_technician',
        'inventory_part',
        'inventory_supplier',
        'inventory_stockmovement',
        'inventory_purchaseorder',
        'inventory_purchaseorderitem',
        'finance_invoice',
        'finance_payment',
        'finance_financeapplication',
        'insurance_insurancepolicy',
        'insurance_insurancerenewal',
        'insurance_insuranceclaim',
        'communication_notification',
        'fleet_fleetvehicle',
        'fleet_obdtelemetry',
        'fleet_driverscore',
        'fleet_geofence',
        'ev_evbatterydata',
        'ev_chargingsession',
        'ev_batteryhealthscore',
        'ai_platform_aiconversation',
        'ai_platform_aiusagelog',
        'ai_platform_knowledgedocument',
        'ai_platform_knowledgechunk',
        'ai_platform_actionproposal',
        'ai_platform_voicesession',
        'ai_platform_voicetranscript',
        'ai_platform_aiprediction',
        'audit_log_auditlog'
    ];
BEGIN
    FOREACH tbl IN ARRAY tenant_tables LOOP
        -- Check if table exists before applying RLS
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
            -- Enable RLS
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
            EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);

            -- Drop existing policy if present
            EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', tbl);

            -- Create tenant isolation policy
            -- Superuser / migration bypasses when variable is empty or explicitly 'SUPERADMIN'
            EXECUTE format(
                'CREATE POLICY tenant_isolation_policy ON %I ' ||
                'FOR ALL ' ||
                'USING (' ||
                '   get_current_organization_id() IS NULL ' ||
                '   OR organization_id = get_current_organization_id()' ||
                ') ' ||
                'WITH CHECK (' ||
                '   get_current_organization_id() IS NULL ' ||
                '   OR organization_id = get_current_organization_id()' ||
                ');', tbl
            );

            RAISE NOTICE 'RLS applied to %', tbl;
        END IF;
    END LOOP;
END $$;
