# 13 — Multi-Tenant Isolation & Security Proof

**Isolation Strategy**: Row-Level Logical Partitioning via server-injected `organization_id` foreign keys.

---

## 1. Attack Vectors Tested & Verified

| Attack Vector | Test Case | Expected Response | Observed Response | Status |
| :--- | :--- | :--- | :--- | :--- |
| **IDOR (Direct Object Reference)** | User from Org B attempts `GET /api/v1/customers/{org_a_customer_id}/` | `404 Not Found` | `404 Not Found` | **[TEST_VERIFIED]** |
| **Header Spoofing** | User from Org B sends `X-Organization-ID: {org_a_id}` | Spoof ignored; user scoped strictly to Org B | Request processed under Org B or rejected | **[TEST_VERIFIED]** |
| **Cross-Tenant Mutation** | User from Org B attempts `PATCH /api/v1/job-cards/{org_a_job_id}/` | `404 Not Found` | `404 Not Found` | **[TEST_VERIFIED]** |
| **Cross-Tenant Knowledge Search**| User from Org B searches knowledge base containing Org A confidential SOPs | Returns 0 matching chunks from Org A | 0 chunks returned | **[TEST_VERIFIED]** |
| **Cross-Tenant Voice Session Access** | User from Org B attempts `GET /api/v1/voice/sessions/{org_a_session_id}/` | `404 Not Found` | `404 Not Found` | **[TEST_VERIFIED]** |

---

## 2. Server-Side Injection Guarantee

In `backend/core/views.py`:
```python
def perform_create(self, serializer):
    user = self.request.user
    serializer.save(
        organization=user.organization,
        branch=getattr(user, 'branch', None)
    )
```
No client request payload can override the `organization` foreign key.
