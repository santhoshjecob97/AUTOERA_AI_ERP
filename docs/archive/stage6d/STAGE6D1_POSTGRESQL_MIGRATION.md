# AutoEra AI ERP — Stage 6D.1 PostgreSQL 16+ Production Migration Guide

**Document ID**: `STAGE6D1-PG-MIGRATION-001`  
**Classification**: Enterprise Production Hardening  
**Target Database**: PostgreSQL 16.4+ with `pgvector` extension  
**Author**: Principal Software Architect & DBA Lead  

---

## 1. Executive Summary

This document establishes the authoritative production database architecture and zero-downtime migration strategy for AutoEra AI ERP. AutoEra transitions from development SQLite/PostgreSQL hybrid instances to an enterprise-grade **PostgreSQL 16+** cluster equipped with the **`pgvector`** extension for sub-millisecond semantic search and RAG knowledge retrieval.

---

## 2. Infrastructure & Connection Topology

```
┌──────────────────────────────────────────────────────────┐
│                   AutoEra Django Backend                 │
│         (Gunicorn Workers + Celery Async Workers)         │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
             ▼ (Write Operations)          ▼ (Read Operations)
┌───────────────────────────┐ ┌───────────────────────────┐
│ PostgreSQL 16 Primary     │ │ PostgreSQL 16 Replica     │
│ - pgvector extension      │ │ - Read-only queries       │
│ - Connection pool (PgB)   │ │ - Streaming replication   │
│ - WAL Archiving to S3/GCS │ │ - Hot Standby failover    │
└───────────────────────────┘ └───────────────────────────┘
```

### Production Connection Parameters (`backend/config/settings.py`)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'autoera_production'),
        'USER': os.environ.get('DB_USER', 'autoera_app'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'postgres-primary.internal'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'connect_timeout': 10,
            'sslmode': 'require',
            'application_name': 'autoera_backend_api',
        },
    }
}
```

---

## 3. Database Preparation & pgvector Initialization

### Step 1: Install & Verify `pgvector`

```sql
-- Connect as postgres superuser
CREATE DATABASE autoera_production WITH ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';

\c autoera_production

-- Enable required enterprise extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify pgvector version (must be >= 0.7.0)
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

---

## 4. Migration Execution Plan (Zero Data Loss)

### Step 2: Django Schema Migration

```bash
# Set production environment
export DJANGO_SETTINGS_MODULE="config.settings"
export DB_ENGINE="django.db.backends.postgresql"
export DB_HOST="postgres-primary.internal"

# Check migration status
python manage.py showmigrations

# Apply all database migrations
python manage.py migrate --noinput
```

### Step 3: Vector Column & Index Verification

```sql
-- Verify KnowledgeChunk table structure in PostgreSQL
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'ai_platform_knowledgechunk';

-- Create IVFFlat Index for sub-millisecond approximate nearest neighbor (ANN) retrieval
CREATE INDEX IF NOT EXISTS idx_knowledgechunk_embedding_cosine 
ON ai_platform_knowledgechunk 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Enforce Multi-tenant compound index
CREATE INDEX IF NOT EXISTS idx_knowledgechunk_tenant_doc
ON ai_platform_knowledgechunk (organization_id, document_id);
```

---

## 5. Backup & Disaster Recovery Architecture

### Continuous Archiving & Point-In-Time Recovery (PITR)

1. **Daily Full Backups**: Automated snapshot via `pg_dump` with gzip compression at 02:00 UTC.
2. **Continuous WAL Archiving**: Write-Ahead Logs streamed to encrypted Cloud Storage with 30-day retention.
3. **Recovery Time Objective (RTO)**: $< 15\text{ minutes}$.
4. **Recovery Point Objective (RPO)**: $< 1\text{ minute}$.

```bash
# Automated Daily Backup Command
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f "/backups/autoera_$(date +%Y%m%d_%H%M%S).dump"
```

---

## 6. Migration Rollback Procedure

If schema anomalies or database connectivity failures occur during production switchover:
1. Revert connection string in Secret Manager to the previous replica.
2. Terminate rogue connections using `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='autoera_production';`.
3. Roll back migrations to previous stable release tag: `python manage.py migrate core <previous_migration_number>`.
