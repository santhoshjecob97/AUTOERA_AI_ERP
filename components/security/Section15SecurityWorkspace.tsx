import React, { useState } from 'react';
import {
  Shield, Lock, Eye, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
  Globe, Server, Database, Key, Activity, FileText, AlertOctagon, Search,
  ArrowRight, Zap, RefreshCw
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface SecurityLayer {
  id: string;
  layer: string;
  control: string;
  implementation: string;
  standards: string[];
  threats: string[];
  severity: 'CRITICAL' | 'HIGH';
  automation: string;
}

interface DPDPRequirement {
  reqId: string;
  section: string;
  requirement: string;
  implementation: string;
  mechanism: string;
  sla: string;
}

interface ComplianceControl {
  standard: string;
  controlId: string;
  category: string;
  description: string;
  mechanism: string;
  status: string;
}

const LAYERS: SecurityLayer[] = [
  { id: 'SL-01', layer: 'Network Perimeter', control: 'AWS WAF + VPC isolation', implementation: 'All traffic through WAF (OWASP Top 10 rules). Services in private subnets — no direct internet exposure.', standards: ['SOC2', 'ISO 27001 A.13'], threats: ['DDoS', 'SQLi', 'XSS', 'OWASP Top 10'], severity: 'CRITICAL', automation: 'AWS WAF rule set auto-updated, VPC Security Groups managed by Terraform' },
  { id: 'SL-02', layer: 'Authentication', control: 'JWT (RS256) + MFA', implementation: '15-minute access tokens + 7-day refresh (Redis stored). TOTP MFA mandatory for L0–L3 roles.', standards: ['SOC2 CC6.1', 'NIST 800-63B'], threats: ['Credential stuffing', 'Token hijack', 'Session replay'], severity: 'CRITICAL', automation: 'Token rotation via Auth Service. MFA via backend/identity/mfa.py' },
  { id: 'SL-03', layer: 'Authorisation', control: 'RBAC + PostgreSQL RLS', implementation: 'Role permissions in JWT claims. RLS policy enforces tenant isolation on every table — zero application-layer filtering.', standards: ['SOC2 CC6.3', 'DPDP Section 11'], threats: ['Privilege escalation', 'Cross-tenant data leak', 'Insider threat'], severity: 'CRITICAL', automation: 'RLS policies in rls_policies.sql applied at DB level. 16-role RBAC matrix enforced.' },
  { id: 'SL-04', layer: 'Data at Rest', control: 'AES-256-GCM field encryption', implementation: 'Restricted fields (Aadhaar, PAN, bank data) encrypted with per-tenant keys. AWS KMS + 90-day auto-rotation.', standards: ['GDPR', 'DPDP', 'ISO 27001 A.10'], threats: ['DB breach exposure', 'Insider data theft', 'Regulatory non-compliance'], severity: 'CRITICAL', automation: 'EncryptedCharField in backend/core/crypto.py. AWS KMS 90-day rotation enforced.' },
  { id: 'SL-05', layer: 'Data in Transit', control: 'TLS 1.3 end-to-end', implementation: 'All external and internal connections TLS 1.3. mTLS between microservices via service mesh (Istio).', standards: ['SOC2', 'ISO 27001 A.13.2'], threats: ['MITM attack', 'Packet sniffing', 'Downgrade attack'], severity: 'CRITICAL', automation: 'Istio service mesh enforces mTLS. AWS ALB + ACM for TLS termination.' },
  { id: 'SL-06', layer: 'Secrets Management', control: 'AWS Secrets Manager + Vault', implementation: 'No secrets in code, env vars, or container images. Auto-rotation every 90 days. Break-glass procedure for emergencies.', standards: ['SOC2 CC6.1', 'ISO 27001 A.9'], threats: ['Secrets sprawl', 'Hardcoded credential leak', 'Privilege abuse'], severity: 'HIGH', automation: 'HashiCorp Vault with dynamic DB credentials. Snyk detects secrets in PRs.' },
  { id: 'SL-07', layer: 'API Security', control: 'Rate limiting + Kong gateway', implementation: 'Per-tenant rate limits by plan tier. API key hashing (bcrypt). IP allowlisting for OEM and bank APIs.', standards: ['OWASP API Security Top 10'], threats: ['API abuse', 'Credential brute-force', 'Data exfiltration via bulk API'], severity: 'HIGH', automation: 'Kong rate limit plugin: Free 100/min, Professional 500/min, Enterprise 2000/min.' },
  { id: 'SL-08', layer: 'Vulnerability Management', control: 'Snyk + AWS Inspector + Trivy', implementation: 'Dependency scanning on every PR. Container scanning on every image build. Annual external penetration test.', standards: ['SOC2 CC7.1', 'ISO 27001 A.12'], threats: ['Supply chain attack', 'CVE exploitation', 'Container escape'], severity: 'HIGH', automation: 'Snyk runs in GitHub Actions on every PR. Trivy scans Docker images in CI pipeline.' },
  { id: 'SL-09', layer: 'Audit Logging', control: 'Immutable append-only logs', implementation: 'Every data read/write: user_id, timestamp, IP, entity, old_value, new_value. Stored S3 + CloudTrail with tamper detection.', standards: ['SOC2 CC7.2', 'DPDP Section 7'], threats: ['Insider threat detection', 'Forensic gaps', 'Regulatory non-compliance'], severity: 'HIGH', automation: 'AuditLog model (append-only). AWS S3 Object Lock (WORM). CloudTrail enabled account-wide.' },
  { id: 'SL-10', layer: 'Incident Response', control: 'PagerDuty + pre-approved runbooks', implementation: 'P1 SLA: acknowledge 5 min, resolve 60 min. 20 pre-approved runbooks. BCP tested quarterly.', standards: ['SOC2 A1.2', 'ISO 27001 A.16'], threats: ['Extended breach exposure', 'Regulatory delay', 'Operational downtime'], severity: 'HIGH', automation: 'PagerDuty on-call escalation. P1 triggers auto-runbook suggestions in incident channel.' },
];

const DPDP_REQS: DPDPRequirement[] = [
  { reqId: 'DPDP-06a', section: 'Section 6', requirement: 'Explicit Consent', implementation: 'Consent collected before any data processing. Granular per use case — service, insurance, marketing separately.', mechanism: 'Consent table: (customer_id, purpose, granted_at, ip_address, consent_text). Middleware blocks without record.', sla: 'Real-time' },
  { reqId: 'DPDP-06b', section: 'Section 6', requirement: 'Purpose Limitation', implementation: 'Data used only for stated purpose. Cross-purpose use technically blocked — not just policy.', mechanism: 'Purpose tag on every data access log. AI agent guardrails prevent cross-purpose inference.', sla: 'Every access' },
  { reqId: 'DPDP-06c', section: 'Section 6', requirement: 'Data Minimisation', implementation: 'Only required data collected. Excess fields blocked at schema level.', mechanism: 'Schema review process. Sensitive fields encrypted with separate access control layer.', sla: 'Design-time' },
  { reqId: 'DPDP-06d', section: 'Section 6', requirement: 'Consent Withdrawal', implementation: 'Withdrawal processed within 24 hours. All AI processing stops on withdrawal.', mechanism: 'Consent withdrawal API. Batch job removes customer from all AI sequences within 24 hours.', sla: '24 hours' },
  { reqId: 'DPDP-07', section: 'Section 7', requirement: 'Audit Logging', implementation: 'Every data read/write logged with user_id, timestamp, IP, entity, old/new values. Immutable S3.', mechanism: 'AuditLog model (append-only). S3 Object Lock (WORM). CloudTrail for infrastructure.', sla: 'Real-time' },
  { reqId: 'DPDP-08', section: 'Section 8', requirement: 'Breach Notification', implementation: 'Regulatory notification within 72 hours of confirmed P1 breach.', mechanism: 'PagerDuty runbook with legal steps. Pre-approved notification template reviewed by Legal Counsel.', sla: '72 hours' },
  { reqId: 'DPDP-11', section: 'Section 11', requirement: 'Right to Access', implementation: 'Customer can request all data. Provided within 72 hours in portable CSV format.', mechanism: 'Data export API: pulls all records for customer_id. PII decrypted for export. Secure link delivery.', sla: '72 hours' },
  { reqId: 'DPDP-12', section: 'Section 12', requirement: 'Right to Correction', implementation: 'Customer corrects inaccurate data. Correction tracked with history preserved.', mechanism: 'PATCH API updates record. Old value preserved in audit_logs with correction_reason.', sla: 'Immediate' },
  { reqId: 'DPDP-13', section: 'Section 13', requirement: 'Right to Erasure', implementation: 'PII deleted within 72 hours on request. Anonymised service records retained for warranty.', mechanism: 'Erasure workflow: PII → NULL, customer_id → anon_id, confirmation sent, audit entry created.', sla: '72 hours' },
];

const CONTROLS: ComplianceControl[] = [
  { standard: 'SOC2 Type II', controlId: 'CC6.1', category: 'Logical & Physical Access', description: 'Restrict logical access to authorized users', mechanism: 'JWT RS256 + TOTP MFA + RBAC + PostgreSQL RLS', status: 'COMPLIANT' },
  { standard: 'SOC2 Type II', controlId: 'CC6.3', category: 'Logical & Physical Access', description: 'Role-based access control with least privilege', mechanism: '16-role RBAC matrix, per-module permission checks, JWT claims', status: 'COMPLIANT' },
  { standard: 'SOC2 Type II', controlId: 'CC7.1', category: 'System Operations', description: 'Monitor components to detect anomalies', mechanism: 'Datadog APM + Snyk CVE scanning + AWS Inspector', status: 'COMPLIANT' },
  { standard: 'SOC2 Type II', controlId: 'CC7.2', category: 'System Operations', description: 'Evaluate security events for failure determination', mechanism: 'PagerDuty incident logs, CloudTrail forensics, AuditLog model', status: 'COMPLIANT' },
  { standard: 'SOC2 Type II', controlId: 'A1.2', category: 'Availability', description: 'Develop and maintain an incident response plan', mechanism: '20 pre-approved runbooks, BCP tested quarterly, PagerDuty', status: 'COMPLIANT' },
  { standard: 'ISO 27001', controlId: 'A.9', category: 'Access Control', description: 'Least privilege, need-to-know access policy', mechanism: 'RBAC + RLS + HashiCorp Vault dynamic credentials', status: 'COMPLIANT' },
  { standard: 'ISO 27001', controlId: 'A.10', category: 'Cryptography', description: 'Cryptographic controls for data confidentiality', mechanism: 'AES-256-GCM + AWS KMS 90-day rotation + TLS 1.3', status: 'COMPLIANT' },
  { standard: 'ISO 27001', controlId: 'A.12', category: 'Operations Security', description: 'Protection from malware — detect, prevent, recover', mechanism: 'Trivy container scanning, Snyk CVE, AWS Inspector', status: 'COMPLIANT' },
  { standard: 'ISO 27001', controlId: 'A.13', category: 'Communications Security', description: 'Network controls for information in networks', mechanism: 'AWS WAF + VPC + Security Groups + Istio mTLS', status: 'COMPLIANT' },
  { standard: 'ISO 27001', controlId: 'A.16', category: 'Incident Management', description: 'Manage information security incidents', mechanism: 'PagerDuty on-call, 20 runbooks, breach notification SLA', status: 'COMPLIANT' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const LAYER_ICONS: Record<string, React.ReactNode> = {
  'SL-01': <Globe size={16} />, 'SL-02': <Key size={16} />, 'SL-03': <Shield size={16} />,
  'SL-04': <Lock size={16} />, 'SL-05': <Zap size={16} />, 'SL-06': <Key size={16} />,
  'SL-07': <Server size={16} />, 'SL-08': <Search size={16} />, 'SL-09': <FileText size={16} />, 'SL-10': <AlertOctagon size={16} />,
};

const LayerRow: React.FC<{ layer: SecurityLayer; expanded: boolean; onClick: () => void }> = ({ layer, expanded, onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-xl border transition-all cursor-pointer ${expanded ? 'border-red-500/40 bg-[#12172a]' : 'border-slate-800/70 bg-[#0d1117] hover:border-slate-600/50'}`}
  >
    <div className="flex items-center gap-3 px-4 py-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${layer.severity === 'CRITICAL' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
        {LAYER_ICONS[layer.id]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500">{layer.id}</span>
          <span className="text-sm font-bold text-white">{layer.layer}</span>
          <span className="text-xs text-slate-400">— {layer.control}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {layer.standards.map((s, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${layer.severity === 'CRITICAL' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
          {layer.severity}
        </span>
        {expanded ? <ChevronDown size={14} className="text-red-400" /> : <ChevronRight size={14} className="text-slate-500" />}
      </div>
    </div>
    {expanded && (
      <div className="px-4 pb-4 border-t border-slate-800/50 pt-3 space-y-3">
        <p className="text-xs text-slate-300 leading-relaxed">{layer.implementation}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1.5">Threats Mitigated</p>
            <ul className="space-y-1">
              {layer.threats.map((t, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <AlertTriangle size={10} className="text-amber-400 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1.5">Automation</p>
            <p className="text-xs text-slate-400">{layer.automation}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const DPDPTab: React.FC = () => (
  <div className="space-y-3">
    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4">
      <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
      <div>
        <p className="text-sm font-bold text-white">India DPDP Act 2023 — 9/9 Requirements: COMPLIANT</p>
        <p className="text-xs text-slate-400 mt-0.5">Digital Personal Data Protection Act · AWS Mumbai ap-south-1 · 100% In-Country Data Residency</p>
      </div>
    </div>
    <div className="space-y-2">
      {DPDP_REQS.map((req, i) => (
        <div key={i} className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
          <div className="flex flex-wrap items-start gap-2 mb-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{req.reqId}</span>
            <span className="text-[10px] text-slate-500">{req.section}</span>
            <span className="font-bold text-sm text-white">{req.requirement}</span>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              COMPLIANT · SLA: {req.sla}
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-1.5">{req.implementation}</p>
          <div className="flex items-start gap-1.5 text-xs text-slate-500">
            <ArrowRight size={11} className="shrink-0 mt-0.5 text-cyan-600" />
            <span className="italic">{req.mechanism}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ComplianceTab: React.FC = () => {
  const soc2 = CONTROLS.filter(c => c.standard === 'SOC2 Type II');
  const iso = CONTROLS.filter(c => c.standard === 'ISO 27001');

  const StandardGroup: React.FC<{ title: string; controls: ComplianceControl[]; color: string }> = ({ title, controls, color }) => (
    <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 size={16} className={color} />
        <span className="text-sm font-bold text-white">{title}</span>
        <span className="ml-auto text-xs font-bold text-emerald-400">{controls.length}/{controls.length} COMPLIANT</span>
      </div>
      {controls.map((ctrl, i) => (
        <div key={i} className="border-t border-slate-800/40 pt-3 first:border-0 first:pt-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">{ctrl.controlId}</span>
            <span className="text-xs font-semibold text-slate-300">{ctrl.category}</span>
            <CheckCircle2 size={11} className="text-emerald-400 ml-auto" />
          </div>
          <p className="text-[11px] text-slate-500 mb-1">{ctrl.description}</p>
          <p className="text-[11px] text-cyan-400/80">{ctrl.mechanism}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StandardGroup title="SOC2 Type II" controls={soc2} color="text-blue-400" />
      <StandardGroup title="ISO 27001" controls={iso} color="text-purple-400" />
    </div>
  );
};

const BreachSimulatorTab: React.FC = () => {
  const steps = [
    { step: 'T+0', action: 'PagerDuty alert fires — on-call engineer notified', severity: 'P1' },
    { step: 'T+5 min', action: 'Incident war room opened, scope assessed, runbook triggered', severity: 'ACTIVE' },
    { step: 'T+15 min', action: 'Containment actions executed — affected services isolated', severity: 'ACTIVE' },
    { step: 'T+2 hrs', action: 'DPDP Section 8 regulatory notification drafted by Legal Counsel', severity: 'LEGAL' },
    { step: 'T+72 hrs', action: 'Regulatory authority notified (CERT-In / MeitY DPDP Board)', severity: 'LEGAL' },
    { step: 'T+7 days', action: 'Post-incident review — root cause analysis + preventive action', severity: 'REVIEW' },
  ];

  const stepColor: Record<string, string> = {
    P1: 'border-red-500/50 bg-red-500/10 text-red-400',
    ACTIVE: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    LEGAL: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    REVIEW: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#0d1117] border border-red-500/20 rounded-xl p-4">
        <p className="text-xs font-bold text-red-400 mb-1 flex items-center gap-2">
          <AlertOctagon size={14} /> P1 Breach Notification Workflow — DPDP Act Section 8
        </p>
        <p className="text-xs text-slate-400">SLA: Acknowledge in 5 min · Resolve in 60 min · Regulatory notify in 72 hours</p>
      </div>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${stepColor[s.severity]}`}>
            <span className="font-mono text-xs font-bold shrink-0 w-16">{s.step}</span>
            <p className="text-xs">{s.action}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-300 mb-2">Regulatory Notification Channels</p>
        <div className="flex flex-wrap gap-2">
          {['CERT-In', 'MeitY DPDP Board', 'Affected customers via WhatsApp', 'Affected customers via Email'].map((ch, i) => (
            <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{ch}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'layers', label: 'Defense in Depth (10 Layers)', icon: <Shield size={14} /> },
  { id: 'dpdp', label: 'DPDP Act 2023 (9 Requirements)', icon: <Globe size={14} /> },
  { id: 'compliance', label: 'SOC2 + ISO 27001', icon: <CheckCircle2 size={14} /> },
  { id: 'breach', label: 'Breach Response Workflow', icon: <AlertOctagon size={14} /> },
];

const Section15SecurityWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('layers');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Security Layers', value: '10', sub: '5 CRITICAL + 5 HIGH', color: 'text-red-400' },
          { label: 'DPDP Requirements', value: '9/9', sub: '100% COMPLIANT', color: 'text-emerald-400' },
          { label: 'Compliance Standards', value: '2', sub: 'SOC2 Type II + ISO 27001', color: 'text-blue-400' },
          { label: 'Breach Notify SLA', value: '72h', sub: 'DPDP Act Section 8', color: 'text-amber-400' },
        ].map((k, i) => (
          <div key={i} className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs font-semibold text-white mt-1">{k.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-[#0a0d16] border border-slate-800/70 rounded-xl p-1.5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-red-500/15 text-red-400 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Defense in Depth */}
      {activeTab === 'layers' && (
        <div className="space-y-2">
          {LAYERS.map(l => (
            <LayerRow
              key={l.id}
              layer={l}
              expanded={expanded === l.id}
              onClick={() => setExpanded(expanded === l.id ? null : l.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'dpdp' && <DPDPTab />}
      {activeTab === 'compliance' && <ComplianceTab />}
      {activeTab === 'breach' && <BreachSimulatorTab />}
    </div>
  );
};

export default Section15SecurityWorkspace;
