"""
AutoEra AI — Security & Compliance Module (Section 15)
Defense in Depth · DPDP Act 2023 · RBAC+RLS · SOC2 · ISO 27001
10 Security Layers · 9 DPDP Requirements · Full Audit Coverage
"""

from typing import Dict, List, Any, Optional
from datetime import datetime

# ─── Defense in Depth: 10 Security Control Layers ────────────────────────────

SECURITY_LAYERS: List[Dict[str, Any]] = [
    {
        "layer_id": "SL-01",
        "layer": "Network Perimeter",
        "control": "AWS WAF + VPC isolation",
        "implementation": "All traffic through WAF (OWASP Top 10 rules). Services in private subnets — no direct internet exposure.",
        "compliance_standards": ["SOC2", "ISO 27001 A.13"],
        "threat_mitigated": ["DDoS", "SQLi", "XSS", "OWASP Top 10"],
        "status": "ACTIVE",
        "severity_if_bypassed": "CRITICAL",
        "automation": "AWS WAF rule set auto-updated, VPC Security Groups managed by Terraform",
    },
    {
        "layer_id": "SL-02",
        "layer": "Authentication",
        "control": "JWT (RS256) + MFA",
        "implementation": "15-minute access tokens + 7-day refresh (Redis stored). TOTP MFA mandatory for L0–L3 roles.",
        "compliance_standards": ["SOC2 CC6.1", "NIST 800-63B"],
        "threat_mitigated": ["Credential stuffing", "Token hijack", "Session replay"],
        "status": "ACTIVE",
        "severity_if_bypassed": "CRITICAL",
        "automation": "Token rotation handled by Auth Service (FastAPI + Redis). MFA via backend/identity/mfa.py",
    },
    {
        "layer_id": "SL-03",
        "layer": "Authorisation",
        "control": "RBAC + PostgreSQL RLS",
        "implementation": "Role permissions in JWT claims. RLS policy enforces tenant isolation on every table — zero application-layer filtering.",
        "compliance_standards": ["SOC2 CC6.3", "DPDP Section 11"],
        "threat_mitigated": ["Privilege escalation", "Cross-tenant data leak", "Insider threat"],
        "status": "ACTIVE",
        "severity_if_bypassed": "CRITICAL",
        "automation": "RLS policies in backend/core/rls_policies.sql applied at DB level. 16-role RBAC matrix enforced.",
    },
    {
        "layer_id": "SL-04",
        "layer": "Data at Rest",
        "control": "AES-256-GCM field encryption",
        "implementation": "Restricted fields (Aadhaar, PAN, bank data) encrypted with per-tenant keys. Key management via AWS KMS + automatic 90-day rotation.",
        "compliance_standards": ["GDPR", "DPDP", "ISO 27001 A.10"],
        "threat_mitigated": ["DB breach exposure", "Insider data theft", "Regulatory non-compliance"],
        "status": "ACTIVE",
        "severity_if_bypassed": "CRITICAL",
        "automation": "EncryptedCharField in backend/core/crypto.py. AWS KMS 90-day key rotation enforced.",
    },
    {
        "layer_id": "SL-05",
        "layer": "Data in Transit",
        "control": "TLS 1.3 end-to-end",
        "implementation": "All external and internal connections TLS 1.3. mTLS between microservices via service mesh (Istio).",
        "compliance_standards": ["SOC2", "ISO 27001 A.13.2"],
        "threat_mitigated": ["MITM attack", "Packet sniffing", "Downgrade attack"],
        "status": "ACTIVE",
        "severity_if_bypassed": "CRITICAL",
        "automation": "Istio service mesh enforces mTLS. AWS ALB + ACM for TLS termination.",
    },
    {
        "layer_id": "SL-06",
        "layer": "Secrets Management",
        "control": "AWS Secrets Manager + Vault",
        "implementation": "No secrets in code, environment variables, or container images. Auto-rotation every 90 days. Break-glass procedure for emergency access.",
        "compliance_standards": ["SOC2 CC6.1", "ISO 27001 A.9"],
        "threat_mitigated": ["Secrets sprawl", "Hardcoded credential leak", "Privilege abuse"],
        "status": "ACTIVE",
        "severity_if_bypassed": "HIGH",
        "automation": "HashiCorp Vault with dynamic DB credentials. Snyk detects secrets in PRs.",
    },
    {
        "layer_id": "SL-07",
        "layer": "API Security",
        "control": "Rate limiting + Kong gateway",
        "implementation": "Per-tenant rate limits by plan tier. API key hashing (bcrypt). IP allowlisting for OEM and bank APIs.",
        "compliance_standards": ["OWASP API Security Top 10"],
        "threat_mitigated": ["API abuse", "Credential brute-force", "Data exfiltration via bulk API"],
        "status": "ACTIVE",
        "severity_if_bypassed": "HIGH",
        "automation": "Kong Gateway rate limit plugin. Limits: Free 100/min, Professional 500/min, Enterprise 2000/min.",
    },
    {
        "layer_id": "SL-08",
        "layer": "Vulnerability Management",
        "control": "Snyk + AWS Inspector + Trivy",
        "implementation": "Dependency scanning on every pull request. Container scanning on every image build. Annual external penetration test.",
        "compliance_standards": ["SOC2 CC7.1", "ISO 27001 A.12"],
        "threat_mitigated": ["Supply chain attack", "CVE exploitation", "Container escape"],
        "status": "ACTIVE",
        "severity_if_bypassed": "HIGH",
        "automation": "Snyk runs in GitHub Actions on every PR. Trivy scans Docker images in CI pipeline.",
    },
    {
        "layer_id": "SL-09",
        "layer": "Audit Logging",
        "control": "Immutable append-only logs",
        "implementation": "Every data read and write: user_id, timestamp, IP, entity, old_value, new_value. Stored S3 + CloudTrail with tamper detection.",
        "compliance_standards": ["SOC2 CC7.2", "DPDP Section 7"],
        "threat_mitigated": ["Insider threat detection", "Forensic gaps", "Regulatory non-compliance"],
        "status": "ACTIVE",
        "severity_if_bypassed": "HIGH",
        "automation": "AuditLog model (append-only). AWS S3 Object Lock (WORM). CloudTrail enabled account-wide.",
    },
    {
        "layer_id": "SL-10",
        "layer": "Incident Response",
        "control": "PagerDuty + pre-approved runbooks",
        "implementation": "P1 SLA: acknowledge 5 min, resolve 60 min. 20 pre-approved runbooks for top incident types. BCP tested quarterly.",
        "compliance_standards": ["SOC2 A1.2", "ISO 27001 A.16"],
        "threat_mitigated": ["Extended breach exposure", "Regulatory breach notification delay", "Operational downtime"],
        "status": "ACTIVE",
        "severity_if_bypassed": "HIGH",
        "automation": "PagerDuty on-call escalation. P1 triggers auto-runbook suggestions in incident channel.",
    },
]

# ─── DPDP Act 2023: 9 Compliance Requirements ────────────────────────────────

DPDP_REQUIREMENTS: List[Dict[str, Any]] = [
    {
        "req_id": "DPDP-06a",
        "dpdp_section": "Section 6",
        "requirement": "Explicit Consent",
        "autoera_implementation": "Consent collected before any data processing. Granular consent per use case — service, insurance, marketing separately.",
        "technical_mechanism": "Consent table: (customer_id, purpose, granted_at, ip_address, consent_text). API middleware blocks processing without consent record.",
        "status": "COMPLIANT",
        "sla": "Real-time — processing blocked without consent",
        "enforcement": "API middleware",
    },
    {
        "req_id": "DPDP-06b",
        "dpdp_section": "Section 6",
        "requirement": "Purpose Limitation",
        "autoera_implementation": "Data used only for stated purpose. Cross-purpose use technically blocked — not just policy.",
        "technical_mechanism": "Purpose tag on every data access log. AI cannot use insurance data for sales targeting without separate consent record.",
        "status": "COMPLIANT",
        "sla": "Enforced at every data access",
        "enforcement": "Audit log purpose tags + AI agent guardrails",
    },
    {
        "req_id": "DPDP-06c",
        "dpdp_section": "Section 6",
        "requirement": "Data Minimisation",
        "autoera_implementation": "Only data required for stated purpose collected. Excess fields blocked at schema level.",
        "technical_mechanism": "Schema review process requires justification for every PII field. Sensitive fields are encrypted with separate access control layer.",
        "status": "COMPLIANT",
        "sla": "Design-time enforcement",
        "enforcement": "Schema governance + EncryptedCharField access control",
    },
    {
        "req_id": "DPDP-06d",
        "dpdp_section": "Section 6",
        "requirement": "Consent Withdrawal",
        "autoera_implementation": "Withdrawal processed within 24 hours. All AI processing stops on withdrawal.",
        "technical_mechanism": "Consent withdrawal API updates consent table. Batch job removes customer from all active AI sequences within 24 hours.",
        "status": "COMPLIANT",
        "sla": "24 hours",
        "enforcement": "Consent withdrawal API + nightly batch job",
    },
    {
        "req_id": "DPDP-07",
        "dpdp_section": "Section 7",
        "requirement": "Audit Logging",
        "autoera_implementation": "Every data read/write logged with user_id, timestamp, IP, entity, old/new values. Immutable S3 storage.",
        "technical_mechanism": "AuditLog model with append-only enforcement. S3 Object Lock (WORM). CloudTrail for infrastructure events.",
        "status": "COMPLIANT",
        "sla": "Real-time — synchronous on every mutation",
        "enforcement": "Django signal-based AuditLog model",
    },
    {
        "req_id": "DPDP-08",
        "dpdp_section": "Section 8",
        "requirement": "Breach Notification",
        "autoera_implementation": "Regulatory notification within 72 hours of confirmed P1 breach.",
        "technical_mechanism": "Incident response runbook with legal notification steps. Pre-approved notification template reviewed by Legal Counsel.",
        "status": "COMPLIANT",
        "sla": "72 hours",
        "enforcement": "PagerDuty runbook automation + Legal contact list",
    },
    {
        "req_id": "DPDP-11",
        "dpdp_section": "Section 11",
        "requirement": "Right to Access",
        "autoera_implementation": "Customer can request all data. Provided within 72 hours in portable CSV format.",
        "technical_mechanism": "Data export API: pulls all records across all tables for customer_id. PII decrypted for export. Delivered via secure link.",
        "status": "COMPLIANT",
        "sla": "72 hours",
        "enforcement": "Data Portability Export API (backend/customers/compliance.py)",
    },
    {
        "req_id": "DPDP-12",
        "dpdp_section": "Section 12",
        "requirement": "Right to Correction",
        "autoera_implementation": "Customer corrects inaccurate data. Correction tracked with history preserved.",
        "technical_mechanism": "PATCH API updates customer record. Old value preserved in audit_logs with correction_reason field.",
        "status": "COMPLIANT",
        "sla": "Immediate",
        "enforcement": "Customer PATCH API + AuditLog old_value capture",
    },
    {
        "req_id": "DPDP-13",
        "dpdp_section": "Section 13",
        "requirement": "Right to Erasure",
        "autoera_implementation": "PII deleted within 72 hours on request. Anonymised service records retained for warranty.",
        "technical_mechanism": "Erasure workflow: PII fields set to NULL, customer_id replaced with anon_id, confirmation message sent, audit entry created.",
        "status": "COMPLIANT",
        "sla": "72 hours",
        "enforcement": "Right to Erasure anonymisation (backend/customers/compliance.py)",
    },
]

# ─── SOC2 / ISO 27001 Controls Mapping ──────────────────────────────────────

COMPLIANCE_CONTROLS: List[Dict[str, Any]] = [
    {
        "standard": "SOC2 Type II",
        "control_id": "CC6.1",
        "category": "Logical & Physical Access",
        "description": "Implement controls to restrict logical access to the system to authorized users",
        "autoera_mechanism": "JWT RS256 + TOTP MFA + RBAC + PostgreSQL RLS",
        "evidence": "Auth service logs, MFA enrollment records, RLS policy DDL",
        "status": "COMPLIANT",
    },
    {
        "standard": "SOC2 Type II",
        "control_id": "CC6.3",
        "category": "Logical & Physical Access",
        "description": "Role-based access control with least privilege principle",
        "autoera_mechanism": "16-role RBAC matrix, per-module permission checks, JWT claims",
        "evidence": "RBAC matrix documentation, JWT token claims audit log",
        "status": "COMPLIANT",
    },
    {
        "standard": "SOC2 Type II",
        "control_id": "CC7.1",
        "category": "System Operations",
        "description": "Monitor components of the system to detect anomalies",
        "autoera_mechanism": "Datadog APM + Snyk CVE scanning + AWS Inspector",
        "evidence": "Datadog alert history, Snyk PR scan reports",
        "status": "COMPLIANT",
    },
    {
        "standard": "SOC2 Type II",
        "control_id": "CC7.2",
        "category": "System Operations",
        "description": "Evaluate security events to determine whether they could or have resulted in a failure",
        "autoera_mechanism": "PagerDuty incident logs, CloudTrail forensics, AuditLog model",
        "evidence": "Incident P1/P2 resolution logs, audit trail exports",
        "status": "COMPLIANT",
    },
    {
        "standard": "SOC2 Type II",
        "control_id": "A1.2",
        "category": "Availability",
        "description": "Develop and maintain an incident response plan",
        "autoera_mechanism": "20 pre-approved runbooks, BCP tested quarterly, PagerDuty integration",
        "evidence": "Runbook registry, quarterly BCP test reports",
        "status": "COMPLIANT",
    },
    {
        "standard": "ISO 27001",
        "control_id": "A.9",
        "category": "Access Control",
        "description": "Implement access control policy — least privilege, need-to-know",
        "autoera_mechanism": "RBAC + RLS + HashiCorp Vault dynamic credentials",
        "evidence": "Access control policy document, Vault audit log",
        "status": "COMPLIANT",
    },
    {
        "standard": "ISO 27001",
        "control_id": "A.10",
        "category": "Cryptography",
        "description": "Use cryptographic controls to protect data confidentiality and integrity",
        "autoera_mechanism": "AES-256-GCM field encryption + AWS KMS 90-day key rotation + TLS 1.3",
        "evidence": "KMS key rotation logs, EncryptedCharField implementation",
        "status": "COMPLIANT",
    },
    {
        "standard": "ISO 27001",
        "control_id": "A.12",
        "category": "Operations Security",
        "description": "Protection from malware — implement detection, prevention and recovery controls",
        "autoera_mechanism": "Trivy container scanning, Snyk dependency CVE detection, AWS Inspector",
        "evidence": "CI/CD Snyk scan results, Trivy image scan logs",
        "status": "COMPLIANT",
    },
    {
        "standard": "ISO 27001",
        "control_id": "A.13",
        "category": "Communications Security",
        "description": "Network controls to protect information in networks",
        "autoera_mechanism": "AWS WAF + VPC private subnets + Security Groups + Istio mTLS",
        "evidence": "AWS WAF rule logs, VPC flow logs, Istio mesh telemetry",
        "status": "COMPLIANT",
    },
    {
        "standard": "ISO 27001",
        "control_id": "A.16",
        "category": "Incident Management",
        "description": "Manage information security incidents — report, assess, respond",
        "autoera_mechanism": "PagerDuty on-call, 20 runbooks, legal breach notification template",
        "evidence": "PagerDuty incident history, breach notification SLA tracking",
        "status": "COMPLIANT",
    },
]


# ─── Security Service ─────────────────────────────────────────────────────────

class SecurityComplianceService:
    """
    AutoEra AI Security & Compliance Service
    Manages: Defense in Depth layers, DPDP Act 2023, SOC2, ISO 27001
    """

    @classmethod
    def get_security_layers(cls) -> List[Dict[str, Any]]:
        return SECURITY_LAYERS

    @classmethod
    def get_layer_by_id(cls, layer_id: str) -> Optional[Dict[str, Any]]:
        for layer in SECURITY_LAYERS:
            if layer["layer_id"].lower() == layer_id.lower():
                return layer
        return None

    @classmethod
    def get_dpdp_requirements(cls) -> List[Dict[str, Any]]:
        return DPDP_REQUIREMENTS

    @classmethod
    def get_compliance_controls(
        cls, standard: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if standard:
            return [c for c in COMPLIANCE_CONTROLS if c["standard"].lower() == standard.lower()]
        return COMPLIANCE_CONTROLS

    @classmethod
    def get_security_summary(cls) -> Dict[str, Any]:
        critical_layers = [l for l in SECURITY_LAYERS if l["severity_if_bypassed"] == "CRITICAL"]
        compliant_dpdp = [d for d in DPDP_REQUIREMENTS if d["status"] == "COMPLIANT"]
        compliant_controls = [c for c in COMPLIANCE_CONTROLS if c["status"] == "COMPLIANT"]

        standards_covered = list({c["standard"] for c in COMPLIANCE_CONTROLS})

        return {
            "total_security_layers": len(SECURITY_LAYERS),
            "critical_layers": len(critical_layers),
            "high_severity_layers": len(SECURITY_LAYERS) - len(critical_layers),
            "all_layers_active": all(l["status"] == "ACTIVE" for l in SECURITY_LAYERS),
            "dpdp_act_2023": {
                "total_requirements": len(DPDP_REQUIREMENTS),
                "compliant_count": len(compliant_dpdp),
                "compliance_percentage": round(len(compliant_dpdp) / len(DPDP_REQUIREMENTS) * 100, 1),
                "data_residency": "AWS Mumbai (ap-south-1) — 100% in-country",
            },
            "compliance_standards": {
                "standards_covered": standards_covered,
                "total_controls": len(COMPLIANCE_CONTROLS),
                "compliant_controls": len(compliant_controls),
            },
            "security_posture": "DEFENSE_IN_DEPTH",
            "last_audit": "Annual external penetration test — ISO 27001 cycle",
            "encryption": {
                "at_rest": "AES-256-GCM + AWS KMS (90-day rotation)",
                "in_transit": "TLS 1.3 + mTLS (Istio service mesh)",
                "key_management": "HashiCorp Vault + AWS Secrets Manager",
            },
        }

    @classmethod
    def simulate_breach_notification(cls, breach_type: str = "P1") -> Dict[str, Any]:
        """Simulate the DPDP Act Section 8 breach notification workflow."""
        return {
            "breach_type": breach_type,
            "dpdp_act_section": "Section 8 — Breach Notification",
            "sla_acknowledge_minutes": 5 if breach_type == "P1" else 30,
            "sla_resolve_hours": 60 if breach_type == "P1" else 240,
            "regulatory_notification_hours": 72,
            "steps": [
                {"step": 1, "action": "PagerDuty alert fires — on-call engineer notified", "timeline": "T+0"},
                {"step": 2, "action": "Incident war room opened, scope assessed", "timeline": "T+5 min"},
                {"step": 3, "action": "Runbook executed — containment actions triggered", "timeline": "T+15 min"},
                {"step": 4, "action": "DPDP regulatory notification drafted by Legal", "timeline": "T+2 hours"},
                {"step": 5, "action": "Regulatory authority notified (CERT-In / MeitY)", "timeline": "T+72 hours"},
                {"step": 6, "action": "Post-incident review — root cause + preventive action", "timeline": "T+7 days"},
            ],
            "notification_channels": ["CERT-In", "MeitY DPDP Board", "Affected customers via WhatsApp/email"],
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }
