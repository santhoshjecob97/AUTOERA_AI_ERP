"""
Section 12: Database Architecture Verification Test Suite
35 Tables · ER Design · Multi-Tenant · Indexing · TimescaleDB
"""

import os
import sys
import django

# Setup Django Environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.database_service import DatabaseArchitectureService, MASTER_TABLES_CATALOGUE
from rest_framework.test import APIRequestFactory
from core.database_views import (
    DatabaseSchemaAPIView, DatabaseTenancyStrategyAPIView,
    TimescaleDBStatusAPIView, DatabaseBenchmarkAPIView
)

def run_tests():
    print("=" * 70)
    print("RUNNING SECTION 12: DATABASE ARCHITECTURE TEST SUITE")
    print("=" * 70)
    passed_count = 0

    # -------------------------------------------------------------
    # TEST 1: Verify All 35 Master Tables Catalogue Completeness
    # -------------------------------------------------------------
    print("\n[TEST 1] Verifying 35 Master Tables Catalogue Completeness...")
    catalog = DatabaseArchitectureService.get_catalog()
    assert len(catalog) == 35, f"Expected 35 tables, found {len(catalog)}"
    table_names = [t["table_name"] for t in catalog]
    expected_sample = [
        "tenants", "organizations", "dealerships", "branches", "employees",
        "roles", "customers", "vehicles", "vehicle_health", "leads",
        "test_drives", "quotations", "bookings", "job_cards", "appointments",
        "service_records", "parts_inventory", "insurance_policies", "claims",
        "finance_applications", "fleet_vehicles", "obd_telemetry", "ev_battery_data",
        "ai_predictions", "notifications", "audit_logs", "subscriptions", "payments",
        "workshop_bays", "technicians", "suppliers", "purchase_orders", "invoices",
        "charging_sessions", "customer_consents"
    ]
    for exp in expected_sample:
        assert exp in table_names, f"Missing table in catalogue: {exp}"
    print(f" -> Successfully catalogued all 35 Master Tables across {len(expected_sample)} domains.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 2: Verify Primary Keys, Key Columns & Data Types
    # -------------------------------------------------------------
    print("\n[TEST 2] Verifying Primary Keys & Core Key Columns...")
    for t in catalog:
        assert "primary_key" in t and len(t["primary_key"]) > 0
        assert "key_columns" in t and len(t["key_columns"]) >= 4
        assert "storage_engine" in t
    
    tenants_table = DatabaseArchitectureService.get_table_details("tenants")
    assert tenants_table["primary_key"] == "tenant_id UUID"
    assert "plan_tier" in tenants_table["key_columns"]

    vehicles_table = DatabaseArchitectureService.get_table_details("vehicles")
    assert vehicles_table["primary_key"] == "vehicle_id UUID"
    assert "vin" in vehicles_table["key_columns"]
    print(f" -> Verified primary keys and schema contracts for all {len(catalog)} tables.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 3: Verify Indexing Strategy Coverage (GIN, B-Tree, BRIN, Partial)
    # -------------------------------------------------------------
    print("\n[TEST 3] Verifying Specialized Indexing Strategy...")
    customers_table = DatabaseArchitectureService.get_table_details("customers")
    assert "GIN" in customers_table["index_strategy"] or "trgm" in customers_table["index_strategy"]

    job_cards_table = DatabaseArchitectureService.get_table_details("job_cards")
    assert "partial" in job_cards_table["index_strategy"].lower()

    obd_table = DatabaseArchitectureService.get_table_details("obd_telemetry")
    assert "BRIN" in obd_table["index_strategy"]

    ev_table = DatabaseArchitectureService.get_table_details("ev_battery_data")
    assert "BRIN" in ev_table["index_strategy"]
    print(" -> Verified GIN (trgm), Partial WHERE filters, and BRIN time-series index policies.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 4: Verify TimescaleDB Hypertables & Continuous Aggregates
    # -------------------------------------------------------------
    print("\n[TEST 4] Verifying TimescaleDB IoT & Battery Telemetry...")
    ts_data = DatabaseArchitectureService.get_timescaledb_status()
    assert len(ts_data["hypertables"]) == 2
    hypertable_names = [h["hypertable"] for h in ts_data["hypertables"]]
    assert "obd_telemetry" in hypertable_names
    assert "ev_battery_data" in hypertable_names
    for h in ts_data["hypertables"]:
        assert h["compression_enabled"] is True
        print(f" -> Hypertable: {h['hypertable']} (Chunk: {h['chunk_time_interval']}, Compression: {h['compression_policy']})")

    assert len(ts_data["continuous_aggregates"]) == 2
    cagg_names = [c["view_name"] for c in ts_data["continuous_aggregates"]]
    assert "daily_soh_avg" in cagg_names
    print(f" -> Continuous Aggregates: {cagg_names}")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 5: Verify Hybrid Multi-Tenancy Architecture
    # -------------------------------------------------------------
    print("\n[TEST 5] Testing Hybrid Multi-Tenancy Strategy (Enterprise vs SMB)...")
    ent_strategy = DatabaseArchitectureService.get_tenancy_strategy("ENTERPRISE")
    assert ent_strategy["strategy"] == "SCHEMA_PER_TENANT"
    assert "search_path" in ent_strategy["database_session_hook"]

    smb_strategy = DatabaseArchitectureService.get_tenancy_strategy("SMB")
    assert smb_strategy["strategy"] == "SHARED_SCHEMA_RLS"
    assert "current_tenant_id" in smb_strategy["database_session_hook"]
    print(f" -> Enterprise Mode: {ent_strategy['strategy']} ({ent_strategy['isolation_level']})")
    print(f" -> SMB Mode: {smb_strategy['strategy']} ({smb_strategy['isolation_level']})")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 6: Verify Monthly Partitioning for Audit Logs
    # -------------------------------------------------------------
    print("\n[TEST 6] Verifying Table Partitioning for audit_logs...")
    audit_table = DatabaseArchitectureService.get_table_details("audit_logs")
    assert audit_table["storage_engine"] == "PostgreSQL Partitioned"
    assert "Partitioned by MONTH" in audit_table["index_strategy"]
    assert audit_table["primary_key"] == "audit_id BIGINT"
    print(f" -> Storage: {audit_table['storage_engine']} with BRIN partition indexes.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 7: Verify DDL SQL Script Completeness
    # -------------------------------------------------------------
    print("\n[TEST 7] Verifying database_architecture.sql File Completeness...")
    sql_path = os.path.join(os.path.dirname(__file__), "core", "database_architecture.sql")
    assert os.path.exists(sql_path), f"File not found: {sql_path}"
    with open(sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()
    
    assert "CREATE TABLE IF NOT EXISTS tenants" in sql_content
    assert "CREATE TABLE IF NOT EXISTS job_cards" in sql_content
    assert "CREATE TABLE IF NOT EXISTS customer_consents" in sql_content
    assert "PARTITION BY RANGE (created_at)" in sql_content
    assert "ENABLE ROW LEVEL SECURITY" in sql_content
    assert len(sql_content) > 10000
    print(f" -> Validated {len(sql_content.splitlines())} lines of production DDL SQL.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 8: Testing Query Explain-Plan Simulation & Speedup Benchmark
    # -------------------------------------------------------------
    print("\n[TEST 8] Testing Query Explain-Plan Simulation & Index Benchmarks...")
    benchmarks = [
        "CUSTOMER_PHONE_LOOKUP",
        "ACTIVE_JOB_CARDS_BY_BRANCH",
        "OBD_TELEMETRY_RECENT_7D",
        "EV_SOH_DEGRADATION_TIMESERIES"
    ]
    for b_type in benchmarks:
        bench_result = DatabaseArchitectureService.simulate_query_benchmark(b_type)
        assert "speedup_factor" in bench_result
        assert "index_used" in bench_result
        print(f" -> {b_type}: {bench_result['index_used']} -> {bench_result['speedup_factor']}")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 9: Testing REST API Endpoints
    # -------------------------------------------------------------
    print("\n[TEST 9] Testing Database Architecture REST API Endpoints...")
    factory = APIRequestFactory()

    # GET /api/v1/database/schema/
    request = factory.get('/api/v1/database/schema/')
    response = DatabaseSchemaAPIView.as_view()(request)
    assert response.status_code == 200
    assert response.data["count"] == 35
    assert response.data["summary"]["total_tables"] == 35

    # GET /api/v1/database/schema/?table=job_cards
    request = factory.get('/api/v1/database/schema/?table=job_cards')
    response = DatabaseSchemaAPIView.as_view()(request)
    assert response.status_code == 200
    assert response.data["table_name"] == "job_cards"

    # GET /api/v1/database/tenancy/strategy/?type=ENTERPRISE
    request = factory.get('/api/v1/database/tenancy/strategy/?type=ENTERPRISE')
    response = DatabaseTenancyStrategyAPIView.as_view()(request)
    assert response.status_code == 200
    assert response.data["strategy"] == "SCHEMA_PER_TENANT"

    # GET /api/v1/database/timescaledb/status/
    request = factory.get('/api/v1/database/timescaledb/status/')
    response = TimescaleDBStatusAPIView.as_view()(request)
    assert response.status_code == 200
    assert len(response.data["hypertables"]) == 2

    # POST /api/v1/database/benchmark/
    request = factory.post('/api/v1/database/benchmark/', {'query_type': 'CUSTOMER_PHONE_LOOKUP'}, format='json')
    response = DatabaseBenchmarkAPIView.as_view()(request)
    assert response.status_code == 200
    assert "100.1x" in response.data["speedup_factor"]
    print(" -> All 4 REST endpoints verified with HTTP 200 OK.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 10: Verify Foreign Key ER Network Connectivity
    # -------------------------------------------------------------
    print("\n[TEST 10] Verifying Relational ER Graph & Foreign Key Integrity...")
    tables_with_fks = [t for t in catalog if len(t["foreign_keys"]) > 0]
    assert len(tables_with_fks) >= 28
    print(f" -> Verified relational foreign key linkages across {len(tables_with_fks)} tables.")
    passed_count += 1

    print("\n" + "=" * 70)
    print(f"SECTION 12 DATABASE ARCHITECTURE TEST RESULT: {passed_count}/10 PASSED (100%)")
    print("=" * 70)
    return True

if __name__ == "__main__":
    success = run_tests()
    if not success:
        sys.exit(1)
