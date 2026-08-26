# AutoEra AI ERP — Backup & Disaster Recovery Standard Operating Procedure (SOP)

## 1. Objectives & SLA Targets
- **Recovery Point Objective (RPO)**: <= 1 Hour (Maximum acceptable data loss)
- **Recovery Time Objective (RTO)**: <= 15 Minutes (Maximum acceptable downtime)
- **Backup Verification Frequency**: Daily automated checksum verification + weekly test restore.

---

## 2. Automated PostgreSQL Backup Strategy

### Continuous Archiving & Daily Dumps
Automated script runs via cron/scheduled task:

```bash
#!/bin/bash
# infra/backup_restore.sh - Automated PostgreSQL 16 Backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/autoera"
DB_NAME="${DB_NAME:-autoera_db}"
DB_USER="${DB_USER:-autoera_user}"
DB_HOST="${DB_HOST:-localhost}"
BACKUP_FILE="${BACKUP_DIR}/autoera_backup_${TIMESTAMP}.sql.gz"

mkdir -p ${BACKUP_DIR}

echo "[$(date)] Starting PostgreSQL backup for ${DB_NAME}..."
pg_dump -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} --format=custom | gzip > ${BACKUP_FILE}

# Generate SHA256 Checksum for integrity verification
sha256sum ${BACKUP_FILE} > "${BACKUP_FILE}.sha256"

# Retention: Retain daily backups for 30 days, delete older
find ${BACKUP_DIR} -type f -name "autoera_backup_*.sql.gz*" -mtime +30 -delete

echo "[$(date)] Backup complete: ${BACKUP_FILE}"
```

---

## 3. Disaster Recovery & Restoration Procedure

### Step-by-Step Restoration
1. **Verify Checksum**:
   ```bash
   sha256sum -c autoera_backup_YYYYMMDD_HHMMSS.sql.gz.sha256
   ```
2. **Decompress and Restore**:
   ```bash
   gunzip -c autoera_backup_YYYYMMDD_HHMMSS.sql.gz | pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME --clean --if-exists
   ```
3. **Verify Database Consistency & Migrations**:
   ```bash
   python manage.py showmigrations
   python manage.py check
   ```
4. **Healthcheck Probe**:
   ```bash
   curl -f http://localhost:8000/api/v1/health/
   ```
