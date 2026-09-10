import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Activity, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Server, 
  Hash, 
  FileCode, 
  Zap, 
  Sliders, 
  RefreshCw,
  GitFork,
  ExternalLink
} from 'lucide-react';

interface MasterTable {
  tableName: string;
  primaryKey: string;
  keyColumns: string[];
  foreignKeys: string[];
  indexStrategy: string;
  module: string;
  storageEngine: string;
  tenancyMode: string;
  rowCount: string;
}

const MASTER_TABLES: MasterTable[] = [
  {
    tableName: 'tenants',
    primaryKey: 'tenant_id UUID',
    keyColumns: ['name', 'type', 'plan_tier', 'status', 'billing_email', 'created_at'],
    foreignKeys: [],
    indexStrategy: 'idx_tenants_status (B-tree on status), idx_tenants_tier (B-tree on plan_tier)',
    module: 'Core Multi-Tenancy',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Global Master',
    rowCount: '1.25K'
  },
  {
    tableName: 'organizations',
    primaryKey: 'org_id UUID',
    keyColumns: ['tenant_id', 'name', 'gstin', 'pan', 'registered_address', 'org_type'],
    foreignKeys: ['tenant_id -> tenants(tenant_id)'],
    indexStrategy: 'idx_org_tenant (B-tree on tenant_id)',
    module: 'Organization',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.85K'
  },
  {
    tableName: 'dealerships',
    primaryKey: 'dealership_id UUID',
    keyColumns: ['org_id', 'name', 'oem_code', 'location', 'state', 'tier', 'status'],
    foreignKeys: ['org_id -> organizations(org_id)'],
    indexStrategy: 'idx_dealer_org (B-tree), idx_dealer_state (B-tree on state)',
    module: 'Organization',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '2.4K'
  },
  {
    tableName: 'branches',
    primaryKey: 'branch_id UUID',
    keyColumns: ['dealership_id', 'name', 'address', 'pin', 'lat', 'lng', 'type', 'status'],
    foreignKeys: ['dealership_id -> dealerships(dealership_id)'],
    indexStrategy: 'idx_branch_dealer (B-tree), idx_branch_pin (B-tree)',
    module: 'Organization',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '4.8K'
  },
  {
    tableName: 'employees',
    primaryKey: 'employee_id UUID',
    keyColumns: ['branch_id', 'name', 'role_id', 'phone', 'email', 'status', 'skill_level', 'hire_date'],
    foreignKeys: ['branch_id -> branches(branch_id)', 'role_id -> roles(role_id)'],
    indexStrategy: 'idx_emp_branch (B-tree), idx_emp_role (B-tree), idx_emp_status (B-tree)',
    module: 'Identity & RBAC',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '35K'
  },
  {
    tableName: 'roles',
    primaryKey: 'role_id UUID',
    keyColumns: ['name', 'level', 'permissions JSONB', 'is_system_role', 'created_by'],
    foreignKeys: [],
    indexStrategy: 'idx_roles_level (B-tree on level L0-L7)',
    module: 'Identity & RBAC',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Shared Master',
    rowCount: '32'
  },
  {
    tableName: 'customers',
    primaryKey: 'customer_id UUID',
    keyColumns: ['tenant_id', 'name', 'phone', 'email', 'city', 'segment', 'lifecycle_stage', 'created_at'],
    foreignKeys: ['tenant_id -> tenants(tenant_id)'],
    indexStrategy: 'idx_cust_phone (GIN trgm), idx_cust_email (B-tree), idx_cust_tenant, pg_trgm on name',
    module: 'CRM & Customers',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.45M'
  },
  {
    tableName: 'vehicles',
    primaryKey: 'vehicle_id UUID',
    keyColumns: ['customer_id', 'reg_number', 'vin', 'make', 'model', 'year', 'fuel_type', 'colour', 'current_mileage'],
    foreignKeys: ['customer_id -> customers(customer_id)'],
    indexStrategy: 'idx_veh_reg (UNIQUE B-tree), idx_veh_vin (B-tree), idx_veh_customer, idx_veh_make_model',
    module: 'Vehicles',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.82M'
  },
  {
    tableName: 'vehicle_health',
    primaryKey: 'health_id UUID',
    keyColumns: ['vehicle_id', 'health_score', 'soh_pct', 'last_service_km', 'next_service_km', 'battery_status', 'recorded_at'],
    foreignKeys: ['vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_health_vehicle (B-tree), idx_health_score (B-tree), idx_health_recorded (BRIN)',
    module: 'Vehicles',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '2.5M'
  },
  {
    tableName: 'leads',
    primaryKey: 'lead_id UUID',
    keyColumns: ['branch_id', 'customer_id', 'vehicle_interest JSONB', 'source', 'ai_score', 'status', 'assigned_to', 'created_at'],
    foreignKeys: ['branch_id -> branches', 'customer_id -> customers', 'assigned_to -> employees'],
    indexStrategy: 'idx_lead_branch_status_score (composite), idx_lead_created (B-tree)',
    module: 'Sales',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '820K'
  },
  {
    tableName: 'test_drives',
    primaryKey: 'td_id UUID',
    keyColumns: ['lead_id', 'vehicle_id', 'scheduled_at', 'completed_at', 'status', 'feedback_score', 'executive_id'],
    foreignKeys: ['lead_id -> leads(lead_id)', 'vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_td_lead (B-tree), idx_td_scheduled (B-tree)',
    module: 'Sales',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '310K'
  },
  {
    tableName: 'quotations',
    primaryKey: 'quote_id UUID',
    keyColumns: ['lead_id', 'vehicle_id', 'base_price', 'discount_approved', 'net_price', 'emi_options JSONB', 'status'],
    foreignKeys: ['lead_id -> leads(lead_id)', 'vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_quote_lead (B-tree), idx_quote_status (B-tree)',
    module: 'Sales',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '450K'
  },
  {
    tableName: 'bookings',
    primaryKey: 'booking_id UUID',
    keyColumns: ['lead_id', 'quote_id', 'booking_amount', 'delivery_date', 'status', 'finance_id', 'insurance_id'],
    foreignKeys: ['lead_id -> leads(lead_id)', 'quote_id -> quotations(quote_id)'],
    indexStrategy: 'idx_booking_lead (B-tree), idx_booking_delivery (B-tree)',
    module: 'Sales',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '165K'
  },
  {
    tableName: 'job_cards',
    primaryKey: 'job_id UUID',
    keyColumns: ['branch_id', 'vehicle_id', 'customer_id', 'advisor_id', 'tech_id', 'bay_id', 'status', 'complaint', 'ai_diagnosis JSONB', 'invoice_amount'],
    foreignKeys: ['branch_id -> branches', 'vehicle_id -> vehicles', 'customer_id -> customers', 'advisor_id -> employees'],
    indexStrategy: 'idx_job_status, idx_job_vehicle, idx_job_branch_status (partial: WHERE status NOT IN (\'DELIVERED\', \'CANCELLED\'))',
    module: 'Service & Workshop',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '980K'
  },
  {
    tableName: 'appointments',
    primaryKey: 'appt_id UUID',
    keyColumns: ['branch_id', 'vehicle_id', 'customer_id', 'type', 'scheduled_at', 'status', 'reminder_sent_at'],
    foreignKeys: ['branch_id -> branches', 'vehicle_id -> vehicles', 'customer_id -> customers'],
    indexStrategy: 'idx_appt_date (B-tree), idx_appt_branch (B-tree), idx_appt_vehicle (B-tree)',
    module: 'Service & Workshop',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '620K'
  },
  {
    tableName: 'service_records',
    primaryKey: 'record_id UUID',
    keyColumns: ['job_id', 'vehicle_id', 'service_type', 'parts_used JSONB', 'labour_hours', 'cost', 'technician_id', 'completed_at'],
    foreignKeys: ['job_id -> job_cards(job_id)', 'vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_service_vehicle (B-tree), idx_service_date (B-tree)',
    module: 'Service & Workshop',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.4M'
  },
  {
    tableName: 'parts_inventory',
    primaryKey: 'part_id UUID',
    keyColumns: ['branch_id', 'part_number', 'name', 'category', 'brand', 'qty_on_hand', 'reorder_point', 'unit_price', 'supplier_id'],
    foreignKeys: ['branch_id -> branches(branch_id)'],
    indexStrategy: 'idx_parts_number (UNIQUE per branch), idx_parts_qty (B-tree)',
    module: 'Inventory',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '780K'
  },
  {
    tableName: 'insurance_policies',
    primaryKey: 'policy_id UUID',
    keyColumns: ['vehicle_id', 'customer_id', 'insurer', 'policy_number', 'type', 'premium', 'ncb_pct', 'expiry_date', 'status'],
    foreignKeys: ['vehicle_id -> vehicles(vehicle_id)', 'customer_id -> customers(customer_id)'],
    indexStrategy: 'idx_policy_expiry (B-tree), idx_policy_vehicle (B-tree), partial idx WHERE status=\'active\'',
    module: 'Insurance',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '510K'
  },
  {
    tableName: 'claims',
    primaryKey: 'claim_id UUID',
    keyColumns: ['policy_id', 'vehicle_id', 'incident_date', 'type', 'ai_assessment JSONB', 'status', 'settlement_amount', 'insurer_ref'],
    foreignKeys: ['policy_id -> insurance_policies(policy_id)', 'vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_claim_policy (B-tree), idx_claim_status (B-tree)',
    module: 'Insurance',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '95K'
  },
  {
    tableName: 'finance_applications',
    primaryKey: 'app_id UUID',
    keyColumns: ['customer_id', 'vehicle_id', 'bank', 'loan_amount', 'tenure', 'status', 'documents JSONB', 'submitted_at', 'approved_at'],
    foreignKeys: ['customer_id -> customers(customer_id)', 'vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_finance_customer (B-tree), idx_finance_status (B-tree), idx_finance_bank (B-tree)',
    module: 'Finance',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '130K'
  },
  {
    tableName: 'fleet_vehicles',
    primaryKey: 'fleet_veh_id UUID',
    keyColumns: ['org_id', 'vehicle_id', 'obd_device_id', 'driver_id', 'health_score', 'fuel_level', 'last_lat', 'last_lng', 'last_seen_at'],
    foreignKeys: ['org_id -> organizations', 'vehicle_id -> vehicles'],
    indexStrategy: 'idx_fleet_org (B-tree), idx_fleet_driver (B-tree), idx_fleet_health (B-tree)',
    module: 'Fleet Telemetry',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '75K'
  },
  {
    tableName: 'obd_telemetry',
    primaryKey: 'telemetry_id BIGINT',
    keyColumns: ['fleet_veh_id', 'rpm', 'coolant_temp', 'oil_pressure', 'battery_v', 'fuel_level', 'speed', 'dtc_codes TEXT[]', 'recorded_at'],
    foreignKeys: ['fleet_veh_id -> fleet_vehicles(fleet_veh_id)'],
    indexStrategy: 'BRIN on recorded_at, B-tree on (fleet_veh_id, recorded_at DESC) — TimescaleDB hypertable',
    module: 'Fleet Telemetry',
    storageEngine: 'TimescaleDB Hypertable',
    tenancyMode: 'Time-Series Chunked',
    rowCount: '450M'
  },
  {
    tableName: 'ev_battery_data',
    primaryKey: 'batt_id UUID',
    keyColumns: ['vehicle_id', 'soc_pct', 'soh_pct', 'cell_voltages JSONB', 'max_temp', 'min_temp', 'cycle_count', 'charge_rate', 'health_score', 'recorded_at'],
    foreignKeys: ['vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'BRIN on recorded_at, B-tree on (vehicle_id, recorded_at DESC) — TimescaleDB continuous aggregates (daily SOH avg)',
    module: 'EV Intelligence',
    storageEngine: 'TimescaleDB Hypertable',
    tenancyMode: 'Time-Series Chunked',
    rowCount: '180M'
  },
  {
    tableName: 'ai_predictions',
    primaryKey: 'pred_id UUID',
    keyColumns: ['entity_type', 'entity_id', 'model_name', 'prediction_type', 'prediction_value JSONB', 'confidence_score', 'input_features JSONB', 'outcome JSONB', 'created_at'],
    foreignKeys: [],
    indexStrategy: 'idx_pred_entity, partial idx WHERE outcome IS NULL, JSON path idx on prediction_value',
    module: 'AI Platform',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '6.2M'
  },
  {
    tableName: 'notifications',
    primaryKey: 'notif_id UUID',
    keyColumns: ['recipient_id', 'recipient_type', 'channel ENUM', 'content JSONB', 'status', 'sent_at', 'read_at', 'retry_count'],
    foreignKeys: [],
    indexStrategy: 'idx_notif_recipient, partial idx WHERE status=\'pending\', idx_notif_channel',
    module: 'Communication',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '8.9M'
  },
  {
    tableName: 'audit_logs',
    primaryKey: 'audit_id BIGINT',
    keyColumns: ['tenant_id', 'user_id', 'action', 'entity_type', 'entity_id', 'old_value JSONB', 'new_value JSONB', 'ip_address', 'created_at'],
    foreignKeys: ['tenant_id -> tenants(tenant_id)'],
    indexStrategy: 'Partitioned by MONTH on created_at, BRIN within partition, 2yr hot / 5yr S3 archive',
    module: 'Audit & Compliance',
    storageEngine: 'PostgreSQL Partitioned',
    tenancyMode: 'Partition-by-Month',
    rowCount: '32M'
  },
  {
    tableName: 'subscriptions',
    primaryKey: 'sub_id UUID',
    keyColumns: ['tenant_id', 'plan_tier', 'status', 'mrr', 'billing_cycle', 'current_period_start', 'current_period_end'],
    foreignKeys: ['tenant_id -> tenants(tenant_id)'],
    indexStrategy: 'idx_sub_tenant (UNIQUE WHERE status=\'active\'), idx_sub_status',
    module: 'Billing & SaaS',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.4K'
  },
  {
    tableName: 'payments',
    primaryKey: 'payment_id UUID',
    keyColumns: ['subscription_id', 'amount', 'currency', 'status', 'gateway', 'gateway_txn_id', 'processed_at'],
    foreignKeys: ['subscription_id -> subscriptions(sub_id)'],
    indexStrategy: 'idx_payment_sub (B-tree), idx_payment_status (B-tree), idx_payment_processed (B-tree)',
    module: 'Billing & Finance',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '58K'
  },
  {
    tableName: 'workshop_bays',
    primaryKey: 'bay_id UUID',
    keyColumns: ['branch_id', 'bay_number', 'bay_type', 'is_active', 'current_job_id', 'status'],
    foreignKeys: ['branch_id -> branches(branch_id)', 'current_job_id -> job_cards(job_id)'],
    indexStrategy: 'idx_bay_branch_status (B-tree), idx_bay_active (B-tree)',
    module: 'Service & Workshop',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '24K'
  },
  {
    tableName: 'technicians',
    primaryKey: 'technician_id UUID',
    keyColumns: ['employee_id', 'branch_id', 'skill_level', 'hourly_rate', 'is_available', 'active_job_id'],
    foreignKeys: ['employee_id -> employees(employee_id)', 'branch_id -> branches(branch_id)'],
    indexStrategy: 'idx_tech_branch_skill (B-tree), idx_tech_available (B-tree)',
    module: 'Service & Workshop',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '18K'
  },
  {
    tableName: 'suppliers',
    primaryKey: 'supplier_id UUID',
    keyColumns: ['org_id', 'name', 'contact_person', 'phone', 'email', 'gstin', 'rating', 'status'],
    foreignKeys: ['org_id -> organizations(org_id)'],
    indexStrategy: 'idx_supplier_org (B-tree), idx_supplier_status (B-tree)',
    module: 'Inventory',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '8.5K'
  },
  {
    tableName: 'purchase_orders',
    primaryKey: 'po_id UUID',
    keyColumns: ['branch_id', 'supplier_id', 'order_number', 'total_amount', 'status', 'ordered_at', 'expected_delivery'],
    foreignKeys: ['branch_id -> branches(branch_id)', 'supplier_id -> suppliers(supplier_id)'],
    indexStrategy: 'idx_po_branch_status (B-tree), idx_po_order_num (UNIQUE B-tree)',
    module: 'Inventory',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '94K'
  },
  {
    tableName: 'invoices',
    primaryKey: 'invoice_id UUID',
    keyColumns: ['job_id', 'customer_id', 'branch_id', 'invoice_number', 'total_amount', 'gst_amount', 'status', 'due_date'],
    foreignKeys: ['job_id -> job_cards(job_id)', 'customer_id -> customers(customer_id)'],
    indexStrategy: 'idx_invoice_cust_status (B-tree), idx_invoice_num (UNIQUE B-tree)',
    module: 'Finance',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.15M'
  },
  {
    tableName: 'charging_sessions',
    primaryKey: 'session_id UUID',
    keyColumns: ['vehicle_id', 'start_time', 'end_time', 'energy_kwh', 'total_cost', 'peak_rate_applied', 'charger_id'],
    foreignKeys: ['vehicle_id -> vehicles(vehicle_id)'],
    indexStrategy: 'idx_session_veh_time (B-tree), idx_session_charger (B-tree)',
    module: 'EV Intelligence',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '420K'
  },
  {
    tableName: 'customer_consents',
    primaryKey: 'consent_id UUID',
    keyColumns: ['customer_id', 'tenant_id', 'purpose', 'channel', 'consent_given', 'ip_address', 'recorded_at'],
    foreignKeys: ['customer_id -> customers(customer_id)', 'tenant_id -> tenants(tenant_id)'],
    indexStrategy: 'idx_consent_cust_purpose (DPDP Act B-tree), idx_consent_recorded (BRIN)',
    module: 'Compliance & DPDP',
    storageEngine: 'PostgreSQL',
    tenancyMode: 'Tenant-Scoped RLS',
    rowCount: '1.9M'
  }
];

export const Section12DatabaseWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'TENANCY' | 'INDEXING' | 'TIMESCALEDB' | 'ER_GRAPH'>('CATALOG');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedTable, setSelectedTable] = useState<MasterTable | null>(MASTER_TABLES[0]);
  const [tenancyView, setTenancyView] = useState<'ENTERPRISE' | 'SMB'>('ENTERPRISE');
  const [benchmarkQuery, setBenchmarkQuery] = useState('CUSTOMER_PHONE_LOOKUP');

  // Filter modules
  const modules = ['ALL', ...Array.from(new Set(MASTER_TABLES.map(t => t.module)))];

  const filteredTables = MASTER_TABLES.filter(t => {
    const matchesSearch = t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.keyColumns.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesModule = selectedModule === 'ALL' || t.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const benchmarkDetails: Record<string, { table: string; indexed: string; unindexed: string; speedup: string; indexName: string }> = {
    CUSTOMER_PHONE_LOOKUP: {
      table: 'customers (1.45M rows)',
      indexed: '1.84 ms (Bitmap Index Scan using idx_cust_phone_gin)',
      unindexed: '184.20 ms (Sequential Table Scan)',
      speedup: '100.1x Faster',
      indexName: 'idx_cust_phone (GIN pg_trgm)'
    },
    ACTIVE_JOB_CARDS_BY_BRANCH: {
      table: 'job_cards (980K rows)',
      indexed: '0.72 ms (Partial Index Scan on active job cards)',
      unindexed: '122.50 ms (Sequential Scan over historical cards)',
      speedup: '170.1x Faster',
      indexName: 'idx_job_branch_status (WHERE status NOT IN (\'DELIVERED\', \'CANCELLED\'))'
    },
    OBD_TELEMETRY_RECENT_7D: {
      table: 'obd_telemetry (450M rows)',
      indexed: '8.90 ms (TimescaleDB Chunk Pruning + BRIN index)',
      unindexed: '4,210.00 ms (Full scan on raw 450M telemetry heap)',
      speedup: '473.0x Faster',
      indexName: 'TimescaleDB Hypertable + BRIN recorded_at'
    },
    EV_SOH_DEGRADATION_TIMESERIES: {
      table: 'ev_battery_data (180M rows)',
      indexed: '0.45 ms (Scan on pre-computed continuous aggregate)',
      unindexed: '2,850.00 ms (On-the-fly math across 180M series points)',
      speedup: '6,333.3x Faster',
      indexName: 'Continuous Aggregate Materialized View daily_soh_avg'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CATALOG'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Table size={15} />
            35 Master Tables
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">35/35</span>
          </button>

          <button
            onClick={() => setActiveTab('TENANCY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'TENANCY'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={15} />
            Multi-Tenant Strategy
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">Hybrid</span>
          </button>

          <button
            onClick={() => setActiveTab('INDEXING')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'INDEXING'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap size={15} />
            Indexing &amp; Benchmark
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">GIN / BRIN</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMESCALEDB')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'TIMESCALEDB'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity size={15} />
            TimescaleDB IoT
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">Hypertables</span>
          </button>

          <button
            onClick={() => setActiveTab('ER_GRAPH')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ER_GRAPH'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitFork size={15} />
            Relational ER Graph
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PostgreSQL 16 + TimescaleDB 2.14
          </span>
        </div>
      </div>

      {/* TAB 1: 35 MASTER TABLES CATALOGUE */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables or columns (e.g. vin, gstin, health_score, status)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module:</span>
              {modules.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModule(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedModule === m
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table List Column (2 Columns wide) */}
            <div className="lg:col-span-2 bg-[#0D1117] border border-slate-800 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <Database size={16} className="text-orange-400" />
                  AutoEra Automotive Master Tables
                  <span className="text-xs font-normal text-slate-400 font-mono">
                    ({filteredTables.length} of 35 shown)
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="py-2.5 px-3">Table Name</th>
                      <th className="py-2.5 px-3">Primary Key</th>
                      <th className="py-2.5 px-3">Module</th>
                      <th className="py-2.5 px-3">Storage Engine</th>
                      <th className="py-2.5 px-3">Est. Rows</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {filteredTables.map((t) => {
                      const isSelected = selectedTable?.tableName === t.tableName;
                      return (
                        <tr
                          key={t.tableName}
                          onClick={() => setSelectedTable(t)}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-orange-500/10 text-white'
                              : 'hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-white flex items-center gap-1.5">
                            <Table size={13} className={isSelected ? 'text-orange-400' : 'text-slate-500'} />
                            {t.tableName}
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-400">{t.primaryKey}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                              {t.module}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                              t.storageEngine.includes('TimescaleDB')
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold'
                                : t.storageEngine.includes('Partitioned')
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {t.storageEngine}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400">{t.rowCount}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTable(t);
                              }}
                              className="text-orange-400 hover:text-orange-300 font-semibold text-[11px]"
                            >
                              Inspect &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Details / DDL Inspector Drawer */}
            <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
              {selectedTable ? (
                <>
                  <div className="pb-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-bold">
                        {selectedTable.module}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                        {selectedTable.tenancyMode}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white font-mono mt-1">
                      {selectedTable.tableName}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      PK: <span className="text-cyan-400">{selectedTable.primaryKey}</span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Hash size={13} className="text-orange-400" />
                      Key Attributes &amp; Columns
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTable.keyColumns.map((c) => (
                        <span key={c} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[11px] font-mono text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <GitFork size={13} className="text-cyan-400" />
                      Foreign Key Relationships
                    </h4>
                    {selectedTable.foreignKeys.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedTable.foreignKeys.map((fk) => (
                          <div key={fk} className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
                            {fk}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No outward foreign keys (Root Master Entity)</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap size={13} className="text-amber-400" />
                      Indexing Strategy
                    </h4>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300 leading-relaxed">
                      {selectedTable.indexStrategy}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileCode size={13} className="text-emerald-400" />
                      DDL SQL Preview
                    </h4>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto max-h-48">
{`CREATE TABLE ${selectedTable.tableName} (
  ${selectedTable.primaryKey.replace(' ', ' ')} PRIMARY KEY,
  ${selectedTable.keyColumns.slice(0, 4).map(c => `${c} VARCHAR(...)`).join(',\n  ')},
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Select a table from the list to view schema and indexing details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-TENANT STRATEGY (HYBRID APPROACH) */}
      {activeTab === 'TENANCY' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <ShieldCheck size={20} className="text-orange-400" />
                Hybrid Multi-Tenant Strategy — Enterprise vs. SMB
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                AutoEra AI provides dual tenancy tiers: hardware-isolated dedicated schemas for enterprise OEMs, and hardware-grade Row-Level Security (RLS) for SMB dealerships.
              </p>
            </div>

            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setTenancyView('ENTERPRISE')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tenancyView === 'ENTERPRISE'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Enterprise Tier (Schema-per-Tenant)
              </button>
              <button
                onClick={() => setTenancyView('SMB')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tenancyView === 'SMB'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SMB Tier (Shared Schema + RLS)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase">Architecture Mode</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {tenancyView === 'ENTERPRISE' ? 'PHYSICAL SCHEMA ISOLATION' : 'POSTGRESQL ROW-LEVEL SECURITY'}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white">
                {tenancyView === 'ENTERPRISE'
                  ? 'Dedicated Schema-Per-Tenant (Max Performance & Isolation)'
                  : 'Shared Schema with Database-Enforced RLS (Cost Efficiency)'}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {tenancyView === 'ENTERPRISE'
                  ? 'For large OEM groups (e.g. Tata Motors South, Maruti Suzuki Regional) with over 50+ branches. Every tenant gets a dedicated PostgreSQL schema (org_tenant_id). Eliminates index bloat and query contention.'
                  : 'For independent workshops and SMB franchised dealers. All data resides in shared tables with PostgreSQL Row-Level Security (RLS) enforcing tenant isolation at the hardware/database level.'}
              </p>

              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase">Session Context Hook (DB Level):</h5>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400">
                  {tenancyView === 'ENTERPRISE'
                    ? 'SET search_path = org_enterprise_id, public;'
                    : 'SET LOCAL app.current_tenant_id = \'b18a287c-3f41-4cf1-a08b-e85df6498a44\';'}
                </pre>
              </div>

              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase">RLS SQL Policy Enforced on Every Table:</h5>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300">
{`CREATE POLICY rls_tenant_isolation ON customers
  FOR ALL
  USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());`}
                </pre>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Multi-Tenant Guarantee Comparison</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span>Data Leakage Risk</span>
                    <span className="text-emerald-400">0.00% (Cryptographic &amp; DB Enforced)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Even if an application developer omits the `WHERE tenant_id = ?` clause, PostgreSQL automatically rejects cross-tenant records at query execution.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span>Backup &amp; Restore Granularity</span>
                    <span className="text-cyan-400">{tenancyView === 'ENTERPRISE' ? 'Independent pg_dump' : 'Logical Tenant Filter'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enterprise tenants can export their dedicated schema or restore point-in-time independent of other tenants.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span>Noisy-Neighbor Mitigation</span>
                    <span className="text-purple-400">{tenancyView === 'ENTERPRISE' ? 'Dedicated Buffer Cache' : 'Statement Timeouts'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Heavy analytics jobs from high-volume dealers cannot starve latency-critical workshop job cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INDEXING STRATEGY & QUERY BENCHMARK SIMULATOR */}
      {activeTab === 'INDEXING' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Specialized Indexing Architecture &amp; Query Benchmark
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              AutoEra AI eliminates sequential table scans across 500M+ rows using Trigram GIN indexes, partial indexes, and Block Range Indexes (BRIN).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase">Sub-String / Vernacular Search</span>
              <h4 className="text-sm font-bold text-white mt-1">GIN + pg_trgm</h4>
              <p className="text-xs text-slate-400 mt-1">
                Applied on `customers.phone` and `customers.name`. Enables sub-2ms fuzzy telephone and customer name lookup across millions of records.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase">Operational Density</span>
              <h4 className="text-sm font-bold text-white mt-1">Partial Indexes (WHERE)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Applied on `job_cards` WHERE status NOT IN (\'DELIVERED\', \'CANCELLED\'). Index size reduced by 85% by indexing only active workshop repairs.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold font-mono text-purple-400 uppercase">High-Frequency Telemetry</span>
              <h4 className="text-sm font-bold text-white mt-1">BRIN (Block Range Index)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Applied on `obd_telemetry.recorded_at` and `ev_battery_data.recorded_at`. Consumes less than 1% disk space of a B-tree while offering instant range skips.
              </p>
            </div>
          </div>

          {/* Live Query Benchmark Simulator */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={15} className="text-orange-400" />
                Query Explain-Plan Benchmark Simulation
              </h4>

              <div className="flex flex-wrap gap-2">
                {Object.keys(benchmarkDetails).map((bKey) => (
                  <button
                    key={bKey}
                    onClick={() => setBenchmarkQuery(bKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      benchmarkQuery === bKey
                        ? 'bg-orange-500 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {bKey.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Target Entity</span>
                <p className="text-sm font-bold text-white font-mono">{benchmarkDetails[benchmarkQuery].table}</p>
                <span className="text-[10px] font-mono text-amber-400 block pt-1">Active Index</span>
                <p className="text-xs text-amber-300 font-mono">{benchmarkDetails[benchmarkQuery].indexName}</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-red-400 uppercase">Unindexed Seq Scan Execution</span>
                <p className="text-base font-black text-red-400 font-mono">{benchmarkDetails[benchmarkQuery].unindexed}</p>
                <p className="text-[11px] text-slate-500">Full heap table scan; high I/O lock overhead.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-500/30 bg-emerald-500/5 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Indexed Execution &amp; Speedup</span>
                <p className="text-base font-black text-emerald-400 font-mono">{benchmarkDetails[benchmarkQuery].indexed}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs font-mono">
                  {benchmarkDetails[benchmarkQuery].speedup}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIMESCALEDB HYPERTABLES & CONTINUOUS AGGREGATES */}
      {activeTab === 'TIMESCALEDB' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Activity size={20} className="text-purple-400" />
              TimescaleDB IoT &amp; Battery Telemetry Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automotive telemetry scales to 2,880 pings per vehicle per day. TimescaleDB hypertables partition data across dynamic time-series chunks with automated columnar compression.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">HYPERTABLE #1</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  450M ROWS ACTIVE
                </span>
              </div>
              <h4 className="text-base font-black text-white font-mono">obd_telemetry</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stores engine RPM, coolant temperature, oil pressure, battery voltage, speed, and active Diagnostic Trouble Codes (DTCs).
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Chunk Interval:</span>
                  <span className="font-bold text-white font-mono">7 Days / Chunk</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Compression Ratio:</span>
                  <span className="font-bold text-emerald-400 font-mono">4.8x (80% disk saving)</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Partition Key:</span>
                  <span className="font-bold text-cyan-400 font-mono">fleet_veh_id (8 slices)</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Compression Policy:</span>
                  <span className="font-bold text-amber-400 font-mono">After 14 Days</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">HYPERTABLE #2</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  180M ROWS ACTIVE
                </span>
              </div>
              <h4 className="text-base font-black text-white font-mono">ev_battery_data</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Captures high-voltage battery state-of-charge (SOC), state-of-health (SOH), 96-cell individual voltages, and pack thermal sensors.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Chunk Interval:</span>
                  <span className="font-bold text-white font-mono">1 Day / Chunk</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Compression Ratio:</span>
                  <span className="font-bold text-emerald-400 font-mono">5.6x (82% disk saving)</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Continuous Aggregate:</span>
                  <span className="font-bold text-cyan-400 font-mono">daily_soh_avg</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Compression Policy:</span>
                  <span className="font-bold text-amber-400 font-mono">After 30 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RELATIONAL ER GRAPH EXPLORER */}
      {activeTab === 'ER_GRAPH' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <GitFork size={20} className="text-cyan-400" />
              Automotive Entity-Relationship (ER) Topology
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete relational graph connecting multi-tenant dealer hierarchies, customer lifecycle hubs, workshop operations, and financial transactions.
            </p>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
            {/* Visual Hierarchy Tiers */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono text-xs font-bold w-36 text-center">
                  LEVEL 1: TENANCY
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">tenants</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">organizations</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">dealerships</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">branches</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold w-36 text-center">
                  LEVEL 2: CUSTOMER
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-cyan-300 font-bold">customers</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-cyan-300 font-bold">vehicles</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">vehicle_health</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold w-36 text-center">
                  LEVEL 3: SALES HUB
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">leads</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">test_drives</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">quotations</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">bookings</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold w-36 text-center">
                  LEVEL 4: SERVICE HUB
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-amber-300 font-bold">job_cards</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">service_records</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">invoices</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">payments</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono text-xs font-bold w-36 text-center">
                  LEVEL 5: TELEMETRY
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-purple-300 font-bold">fleet_vehicles</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-purple-300 font-bold">obd_telemetry</span>
                  <span>|</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-purple-300 font-bold">ev_battery_data</span>
                  <span>&rarr;</span>
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg">charging_sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section12DatabaseWorkspace;
