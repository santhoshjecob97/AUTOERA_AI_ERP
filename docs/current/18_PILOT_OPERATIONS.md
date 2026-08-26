# 18 — Pilot Operations & Dealership Onboarding Guide

**Operational Standard Operating Procedure (SOP)** for Technical Onboarding of Pilot Dealerships.

---

## 1. Initial Tenant Setup (SuperAdmin / CLI)

To provision a new dealership tenant:
```bash
# 1. Access backend shell on Render
python manage.py shell

# 2. Create Organization & Default Branch
from organization.models import Organization, Branch, BusinessSettings
from identity.models import User

org = Organization.objects.create(name="AutoEra Motors Pilot Dealership", code="PILOT01")
branch = Branch.objects.create(organization=org, name="Main Flagship Branch", code="BRANCH01")
settings = BusinessSettings.objects.create(organization=org, currency="INR", tax_rate_percent=18.0)

# 3. Create General Manager / Admin User
admin_user = User.objects.create_user(
    username="manager@autoerapilot.com",
    email="manager@autoerapilot.com",
    password="<SecureInitialPassword123!>",
    role="General Manager",
    organization=org,
    branch=branch,
    first_name="Pilot",
    last_name="Manager"
)
```

---

## 2. Dealership Operations Workflow Checklist

1. **Staff Onboarding**: General Manager logs in at `https://autoera-ai-erp.vercel.app` and creates Service Advisors, Sales Executives, and Technicians via User Management.
2. **Vehicle & Inventory Import**: Bulk upload or record vehicle models and initial spare parts catalog.
3. **Daily Routine**:
   - Security gate checks in arriving vehicles.
   - Service Advisor generates inspection & job card.
   - Technicians log parts & labour.
   - Billing department generates invoice & collects payment.
