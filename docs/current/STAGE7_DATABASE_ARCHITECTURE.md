# AutoEra AI ERP — Stage 7 Database Architecture & Production Readiness

**Target Engine**: PostgreSQL 16+ (Render Managed Database)  
**ORM**: Django ORM with `django-environ` connection parsing  
**Multi-Tenant Strategy**: Shared Database, Row-Level Partitioning via `organization_id` ForeignKey on all business models.

---

## 1. Database Connection Handling

In `backend/config/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3' if DEBUG else 'django.db.backends.postgresql'),
        'NAME': BASE_DIR / 'db.sqlite3' if os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3' if DEBUG else 'django.db.backends.postgresql') == 'django.db.backends.sqlite3' else os.environ.get('DB_NAME', 'autoera_db'),
        'USER': os.environ.get('DB_USER', 'autoera_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'OPTIONS': {'connect_timeout': 10} if not DEBUG else {},
    }
}

if os.environ.get('DATABASE_URL'):
    import environ
    env = environ.Env()
    DATABASES['default'] = env.db_url_config(os.environ['DATABASE_URL'])
    DATABASES['default']['CONN_MAX_AGE'] = 600
```

---

## 2. Core Domain Schema & Migration Graph

The system is partitioned into 14 domain apps:
1. `core` — Tenant middleware, audit logging, base abstract models (`TenantAwareModel`, `AuditModel`)
2. `identity` — Custom `User` model, SimpleJWT authentication, roles & permissions (RBAC)
3. `organization` — Hierarchy: `Organization` → `DealerGroup` → `Branch` → `Department` → `BusinessSettings`
4. `customers` — `Customer`, `CustomerTimeline`, Customer 360 aggregate
5. `vehicles` — `Vehicle`, `VehicleStock`, Vehicle 360 aggregate
6. `sales` — `Lead`, `LeadFollowUp`, `TestDrive`, `Quotation`, `Booking`, `Appointment`
7. `service` — `JobCard`, `ServiceCheckIn`, `ServiceInspection`, `JobCardPart`, `JobCardLabour`
8. `workshop` — `WorkshopBay`, `Technician`
9. `inventory` — `Part`, `Supplier`, `StockMovement`, `PurchaseOrder`, `PurchaseOrderItem`
10. `finance` — `Invoice`, `Payment`, `FinanceApplication`
11. `billing` — `SaaSPlan`, `Subscription`, `RazorpayWebhook`
12. `communication` — `Notification`
13. `audit_log` — `AuditLog`
14. `ai_platform` — `KnowledgeDocument`, `KnowledgeChunk`, `ActionProposal`, `PromptTemplate`, `VoiceSession`, `VoiceTranscript`

---

## 3. Multi-Tenant Integrity & Foreign Key Constraints

Every business table enforces:
- `organization = models.ForeignKey('organization.Organization', on_delete=models.CASCADE, related_name='+')`
- `created_at = models.DateTimeField(auto_now_add=True, db_index=True)`
- `updated_at = models.DateTimeField(auto_now=True)`

### Database Indexes:
- Compound index on `(organization_id, created_at)` on high-volume tables (`customers`, `leads`, `job_cards`, `invoices`, `notifications`).
- Unique constraint on `(organization_id, phone)` for `Customer`.
- Unique constraint on `(organization_id, vin)` and `(organization_id, registration_number)` for `Vehicle`.
- Unique constraint on `(organization_id, job_card_number)` for `JobCard`.
