import React, { useState } from 'react';
import {
  Layers, Globe, Server, Database, Shield, Activity, Code, Zap,
  Network, CheckCircle2, ArrowRight, Search, Filter, ChevronDown,
  ChevronRight, AlertTriangle, Star, Cpu, Cloud, Lock, Radio
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface StackLayer {
  layer: string;
  technology: string;
  version: string;
  whyChosen: string;
  alternatives: string;
  category: string;
  criticality: string;
  status: string;
  pros: string[];
  cons: string[];
}

const STACK_MATRIX: StackLayer[] = [
  {
    layer: 'Frontend Web', technology: 'Next.js', version: '15 (App Router)',
    whyChosen: 'Server Components + streaming + SEO. Best DX for complex dashboards. Largest React ecosystem.',
    alternatives: 'Remix (smaller ecosystem), SvelteKit (less India talent pool)',
    category: 'Frontend', criticality: 'P0 — Core Client', status: 'ADOPTED',
    pros: ['React Server Components', 'Instant streaming hydration', 'Universal Node.js ecosystem'],
    cons: ['Vercel vendor-tie incentives (mitigated by standalone Docker builds)'],
  },
  {
    layer: 'Frontend State', technology: 'Zustand + React Query', version: 'Latest',
    whyChosen: 'Zustand for UI state (tiny, simple). React Query for server state (cache, background refresh, optimistic updates).',
    alternatives: 'Redux (excessive boilerplate), Jotai (viable alternative)',
    category: 'Frontend', criticality: 'P0 — Core Client', status: 'ADOPTED',
    pros: ['Zero boilerplate', 'Built-in stale-while-revalidate', 'Microscopic bundle size'],
    cons: ['Requires discipline separating server cache from client UI state'],
  },
  {
    layer: 'Frontend UI', technology: 'TailwindCSS + ShadCN UI', version: 'Latest',
    whyChosen: 'Utility-first for speed. ShadCN for accessible, composable base components. Native dark mode.',
    alternatives: 'Material UI (too opinionated), Ant Design (too heavy for dark-mode-first)',
    category: 'Frontend', criticality: 'P0 — Design System', status: 'ADOPTED',
    pros: ['Radix UI accessibility primitives', 'Unbundled source code ownership', 'Native dark/light token design'],
    cons: ['Initial component copy-paste setup overhead'],
  },
  {
    layer: 'Frontend Charts', technology: 'Recharts + D3.js', version: 'Latest',
    whyChosen: 'Recharts for standard charts (fast, React-native). D3 for custom fleet heatmaps and complex visualisations.',
    alternatives: 'Chart.js (less React-native), Highcharts (licensing cost)',
    category: 'Frontend', criticality: 'P1 — Analytics', status: 'ADOPTED',
    pros: ['Declarative SVG rendering', 'Infinite flexibility for telemetry heatmaps with D3', 'Zero recurring licensing fees'],
    cons: ['D3 steep learning curve for junior frontend engineers'],
  },
  {
    layer: 'Mobile App', technology: 'React Native + Expo', version: 'Latest',
    whyChosen: 'Share business logic with web. Expo EAS for OTA updates. One team builds 5 apps simultaneously.',
    alternatives: 'Flutter (separate codebase), Native iOS+Android (double the cost)',
    category: 'Mobile', criticality: 'P0 — Field Operations', status: 'ADOPTED',
    pros: ['90% TypeScript code reuse with web models', 'Expo EAS OTA updates', 'Fast turnaround for 5 role apps'],
    cons: ['Native bridge overhead for high-frequency Bluetooth OBD-II peripherals'],
  },
  {
    layer: 'Backend Primary', technology: 'FastAPI + Python 3.12', version: 'Latest',
    whyChosen: 'Async, fastest Python framework, excellent AI/ML integration, type-safe Pydantic, auto-generates API docs.',
    alternatives: 'Django REST (slower async), Express.js (less type safety)',
    category: 'Backend', criticality: 'P0 — Core API', status: 'ADOPTED',
    pros: ['Starlette async event loop', 'Pydantic v2 Rust-backed validation', 'Native OpenAPI / Swagger autodoc'],
    cons: ['ORM requires deliberate choice (SQLAlchemy / asyncpg)'],
  },
  {
    layer: 'Notification Service', technology: 'Node.js + Bull + Redis', version: 'Latest',
    whyChosen: 'WhatsApp queue processing. Bull for job queuing with retry + DLQ. Node for I/O-bound performance.',
    alternatives: 'Python Celery (viable, considered)',
    category: 'Backend', criticality: 'P0 — Messaging', status: 'ADOPTED',
    pros: ['High event loop concurrency for webhook bursts', 'Bull Redis-backed DLQs', 'Sub-millisecond queue latency'],
    cons: ['Polyglot operational footprint (Node + Python)'],
  },
  {
    layer: 'Primary Database', technology: 'PostgreSQL 16 + TimescaleDB', version: '16',
    whyChosen: 'Battle-tested, JSONB, Row-Level Security for multi-tenancy, TimescaleDB for time-series without separate DB.',
    alternatives: 'MySQL (weaker JSONB, no RLS), MongoDB (ACID required for financial data)',
    category: 'Database & Storage', criticality: 'P0 — Persistence', status: 'ADOPTED',
    pros: ['Hardware-grade Row-Level Security (RLS)', 'TimescaleDB hypertables for OBD/battery pings', 'Rich JSONB querying & indexing'],
    cons: ['Requires deliberate indexing discipline at 500M+ rows'],
  },
  {
    layer: 'Cache + Sessions', technology: 'Redis 7 Cluster', version: '7',
    whyChosen: 'Session store, API cache, Bull queue backend, real-time pub/sub for WebSocket fan-out.',
    alternatives: 'Memcached (no pub/sub), Valkey (monitored as future alternative)',
    category: 'Database & Storage', criticality: 'P0 — Real-Time', status: 'ADOPTED',
    pros: ['In-memory sub-millisecond lookups', 'Cluster sharding across multiple nodes', 'Pub/Sub channels for live telemetry feeds'],
    cons: ['RAM capacity cost planning required'],
  },
  {
    layer: 'Graph Database', technology: 'Neo4j AuraDB', version: 'Latest',
    whyChosen: 'Customer-Vehicle-Service knowledge graph. Relationship traversal queries impossible in relational DB.',
    alternatives: 'AWS Neptune (viable), TigerGraph (expensive)',
    category: 'Database & Storage', criticality: 'P1 — AI Knowledge Graph', status: 'ADOPTED',
    pros: ['Index-free adjacency graph traversals', 'Cypher query language simplicity', 'Deep Customer 360 & churn risk discovery'],
    cons: ['Managed AuraDB hosting overhead'],
  },
  {
    layer: 'Vector Database', technology: 'Pinecone + Qdrant', version: 'Latest',
    whyChosen: 'Pinecone for production RAG (managed, fast, reliable). Qdrant self-hosted for high-volume batch embeddings (cost).',
    alternatives: 'Weaviate (viable), pgvector (MVP only — migrated to Pinecone at scale)',
    category: 'AI Infrastructure', criticality: 'P0 — RAG Pipeline', status: 'ADOPTED',
    pros: ['Pinecone serverless tenant namespaces (org_id)', 'Qdrant cost-efficiency for bulk batch embeddings', 'Sub-50ms top-k cosine similarity'],
    cons: ['Dual vector store operational sync logic'],
  },
  {
    layer: 'Message Bus', technology: 'Apache Kafka on AWS MSK', version: '3.x',
    whyChosen: 'Durable event log, ordered delivery, exactly-once semantics. MSK removes operational overhead.',
    alternatives: 'RabbitMQ (no log retention), AWS SQS (viable for simpler queuing needs)',
    category: 'Backend Messaging', criticality: 'P0 — Event Streaming', status: 'ADOPTED',
    pros: ['Multi-tenant partitioned log storage', 'High-throughput telemetry ingestion', 'Managed multi-AZ replication on AWS MSK'],
    cons: ['Consumer rebalance latency if partition consumer dies'],
  },
  {
    layer: 'Cloud Primary', technology: 'AWS Mumbai (ap-south-1)', version: 'Latest',
    whyChosen: 'DPDP Act data sovereignty. Widest India service coverage. RDS, ECS, EKS, SageMaker all available.',
    alternatives: 'GCP (viable for AI services), Azure (viable for enterprise Microsoft clients)',
    category: 'Cloud & Infrastructure', criticality: 'P0 — Hosting', status: 'ADOPTED',
    pros: ['Statutory Indian DPDP Act 2023 compliance', 'Sub-25ms latency across Indian metros', 'Rich managed service portfolio'],
    cons: ['Egress bandwidth charges between regions'],
  },
  {
    layer: 'Containers + Orch.', technology: 'Docker + Kubernetes (EKS)', version: 'Latest',
    whyChosen: 'Service isolation, horizontal autoscaling, rolling deploys, GitOps. EKS removes control plane management.',
    alternatives: 'ECS Fargate (simpler, viable for MVP), Nomad (smaller community)',
    category: 'Cloud & Infrastructure', criticality: 'P0 — Runtime', status: 'ADOPTED',
    pros: ['Horizontal Pod Autoscaling (HPA) driven by CPU/Kafka queue depth', 'Declarative GitOps deployments', 'Multi-AZ pod distribution'],
    cons: ['Kubernetes cluster operational complexity'],
  },
  {
    layer: 'IaC', technology: 'Terraform + Terragrunt', version: 'Latest',
    whyChosen: 'Reproducible infrastructure. Terragrunt for DRY multi-environment (dev/staging/prod) configuration.',
    alternatives: 'AWS CDK (viable), Pulumi (viable, TypeScript IaC)',
    category: 'DevOps', criticality: 'P1 — Infrastructure as Code', status: 'ADOPTED',
    pros: ['Declarative cloud blueprint', 'Terragrunt DRY environment inheritance', 'State locking via AWS DynamoDB'],
    cons: ['Terraform state drift reconciliation if manual changes occur'],
  },
  {
    layer: 'CI/CD', technology: 'GitHub Actions + ArgoCD', version: 'Latest',
    whyChosen: 'GitHub Actions for build + test + image push. ArgoCD for GitOps deployment to Kubernetes — declarative.',
    alternatives: 'Jenkins (maintenance overhead), CircleCI (viable)',
    category: 'DevOps', criticality: 'P1 — Automation', status: 'ADOPTED',
    pros: ['Zero self-hosted CI maintenance', 'ArgoCD automated sync from Git to EKS', 'Instant rollback to prior commit hash'],
    cons: ['GitHub Actions runner minutes quota management'],
  },
  {
    layer: 'Observability', technology: 'Datadog (APM + Logs + Metrics)', version: 'Latest',
    whyChosen: 'Full stack observability. AI anomaly detection. RUM for frontend. Worth cost at scale.',
    alternatives: 'Grafana + Prometheus (open-source, Phase 1 MVP), New Relic (viable)',
    category: 'Observability', criticality: 'P1 — Reliability', status: 'ADOPTED',
    pros: ['Unified APM traces + logs correlation', 'Frontend Real User Monitoring (RUM)', 'Automated anomaly alerts on error spikes'],
    cons: ['High SaaS invoice cost if log ingestion is unindexed/unfiltered'],
  },
  {
    layer: 'Security', technology: 'AWS WAF + Snyk + HashiCorp Vault', version: 'Latest',
    whyChosen: 'WAF for API protection. Snyk for dependency scanning on every PR. Vault for secrets with auto-rotation.',
    alternatives: 'Cloudflare (viable WAF + CDN), Doppler (viable for secrets management)',
    category: 'Security & Compliance', criticality: 'P0 — Security', status: 'ADOPTED',
    pros: ['Layer 7 DDoS & OWASP Top 10 mitigation via WAF', 'Continuous PR dependency vulnerability scanning', 'Dynamic short-lived DB credentials via Vault'],
    cons: ['Vault unseal and key-management ceremonies'],
  },
];

const CATEGORIES = ['All', 'Frontend', 'Mobile', 'Backend', 'Backend Messaging', 'Database & Storage', 'AI Infrastructure', 'Cloud & Infrastructure', 'DevOps', 'Observability', 'Security & Compliance'];

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  'Frontend': <Code size={14} />,
  'Mobile': <Zap size={14} />,
  'Backend': <Server size={14} />,
  'Backend Messaging': <Radio size={14} />,
  'Database & Storage': <Database size={14} />,
  'AI Infrastructure': <Cpu size={14} />,
  'Cloud & Infrastructure': <Cloud size={14} />,
  'DevOps': <Activity size={14} />,
  'Observability': <Activity size={14} />,
  'Security & Compliance': <Shield size={14} />,
};

const CATEGORY_COLOR: Record<string, string> = {
  'Frontend': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Mobile': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'Backend': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'Backend Messaging': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Database & Storage': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'AI Infrastructure': 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  'Cloud & Infrastructure': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'DevOps': 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  'Observability': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  'Security & Compliance': 'text-red-400 bg-red-500/10 border-red-500/30',
};

const P0_COLOR = 'text-red-400 bg-red-500/10';
const P1_COLOR = 'text-amber-400 bg-amber-500/10';

// ─── Sub-components ──────────────────────────────────────────────────────────

const LayerCard: React.FC<{ layer: StackLayer; isExpanded: boolean; onClick: () => void }> = ({ layer, isExpanded, onClick }) => {
  const catColor = CATEGORY_COLOR[layer.category] || 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  const critColor = layer.criticality.startsWith('P0') ? P0_COLOR : P1_COLOR;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 cursor-pointer ${
        isExpanded
          ? 'border-orange-500/50 bg-[#12172a] shadow-[0_0_20px_rgba(249,115,22,0.08)]'
          : 'border-slate-800/70 bg-[#0d1117] hover:border-slate-600/50 hover:bg-[#111827]'
      }`}
      onClick={onClick}
    >
      {/* Row header */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${catColor}`}>
              {CATEGORY_ICON[layer.category]}
              {layer.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${critColor}`}>
              {layer.criticality}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs font-semibold text-slate-500 w-32 shrink-0 truncate">{layer.layer}</span>
            <span className="text-sm font-bold text-white truncate">{layer.technology}</span>
            <span className="text-xs text-slate-500 font-mono shrink-0">v{layer.version}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            <CheckCircle2 size={10} /> {layer.status}
          </span>
          {isExpanded ? <ChevronDown size={16} className="text-orange-400" /> : <ChevronRight size={16} className="text-slate-500" />}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-800/60 pt-3 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Why Chosen</p>
            <p className="text-xs text-slate-300 leading-relaxed">{layer.whyChosen}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Alternatives Evaluated</p>
            <p className="text-xs text-slate-400">{layer.alternatives}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5">Pros</p>
              <ul className="space-y-1">
                {layer.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1.5">Cons / Watch-outs</p>
              <ul className="space-y-1">
                {layer.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                    <AlertTriangle size={11} className="text-amber-400 mt-0.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Trade-off scorecards tab
const SCORECARDS = [
  { layer: 'Next.js 15', vs: 'Remix / SvelteKit', score: 95, dimensions: ['SEO & SSR', 'DX & Ecosystem', 'India Talent', 'React Compat'], scores: [96, 95, 95, 99] },
  { layer: 'PostgreSQL 16 + TimescaleDB', vs: 'MySQL / MongoDB', score: 97, dimensions: ['ACID / Financials', 'Multi-Tenancy RLS', 'Time-Series', 'JSONB Queries'], scores: [99, 98, 94, 95] },
  { layer: 'Apache Kafka (AWS MSK)', vs: 'RabbitMQ / SQS', score: 93, dimensions: ['Durability', 'Throughput', 'Ordering', 'Managed Ops'], scores: [99, 97, 96, 85] },
  { layer: 'AWS Mumbai (ap-south-1)', vs: 'GCP / Azure', score: 96, dimensions: ['DPDP Act', 'Latency IN', 'Managed SVCs', 'Cost'], scores: [100, 98, 95, 91] },
  { layer: 'FastAPI + Python 3.12', vs: 'Django REST / Express', score: 94, dimensions: ['Async Perf', 'AI/ML Integration', 'Auto-Docs', 'Type Safety'], scores: [96, 99, 96, 90] },
  { layer: 'Pinecone + Qdrant', vs: 'pgvector / Weaviate', score: 91, dimensions: ['Prod Reliability', 'Cost Efficiency', 'RAG Latency', 'Scale'], scores: [96, 88, 94, 91] },
];

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px]">
      <span className="text-slate-400">{label}</span>
      <span className="text-orange-400 font-bold">{score}</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const TradeOffTab: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {SCORECARDS.map((sc, i) => (
      <div key={i} className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-white">{sc.layer}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">vs. {sc.vs}</p>
        </div>
        {/* Overall score */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9155" fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="3"
                strokeDasharray={`${sc.score}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-white">{sc.score}</span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {sc.dimensions.map((d, j) => (
              <ScoreBar key={j} label={d} score={sc.scores[j]} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// DPDP / Sovereignty tab
const SovereigntyTab: React.FC = () => (
  <div className="space-y-5">
    <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/30 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Shield size={20} className="text-orange-400" />
        <div>
          <p className="text-sm font-bold text-white">India DPDP Act 2023 — Full Data Sovereignty</p>
          <p className="text-xs text-slate-400">Digital Personal Data Protection Act · AWS Mumbai (ap-south-1) · 100% IN-COUNTRY</p>
        </div>
        <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          COMPLIANT
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          { label: 'Data Residency', value: 'ap-south-1 only', ok: true },
          { label: 'PII Encryption', value: 'AES-256-GCM', ok: true },
          { label: 'Consent Records', value: 'Granular per-purpose', ok: true },
          { label: 'Erasure SLA', value: '72 hours', ok: true },
        ].map((item, i) => (
          <div key={i} className="bg-[#0d1117] border border-slate-800 rounded-lg p-3 text-center">
            <CheckCircle2 size={16} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{item.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Cloud size={14} className="text-orange-400" /> AWS Services Used (ap-south-1)
        </p>
        <div className="space-y-2">
          {[
            ['RDS PostgreSQL 16', 'Primary data store — DPDP PII'],
            ['AWS MSK (Kafka)', 'Event streaming — multi-AZ'],
            ['EKS (Kubernetes)', 'Container orchestration — auto-scaling'],
            ['AWS KMS', 'Key management — 90-day auto-rotation'],
            ['S3 (ap-south-1)', 'Audit logs — immutable write-once'],
            ['SageMaker', 'ML model hosting — GPU inference'],
            ['AWS WAF', 'Layer 7 OWASP protection'],
            ['CloudTrail', 'Governance audit trail — tamper-evident'],
          ].map(([svc, desc], i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-orange-300 font-mono">{svc}</span>
              <span className="text-slate-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Lock size={14} className="text-red-400" /> Security Layers Applied
        </p>
        <div className="space-y-2.5">
          {[
            { layer: 'Network', control: 'AWS WAF + VPC private subnets', std: 'SOC2 A.13' },
            { layer: 'Auth', control: 'JWT RS256 + TOTP MFA', std: 'NIST 800-63B' },
            { layer: 'Data at Rest', control: 'AES-256-GCM + AWS KMS', std: 'ISO 27001 A.10' },
            { layer: 'Data in Transit', control: 'TLS 1.3 + mTLS (Istio)', std: 'SOC2 A.13.2' },
            { layer: 'Secrets', control: 'HashiCorp Vault auto-rotation', std: 'SOC2 CC6.1' },
            { layer: 'Auditing', control: 'Immutable append-only log (S3)', std: 'DPDP Section 7' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <CheckCircle2 size={11} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-slate-300 font-semibold">{item.layer}: </span>
                <span className="text-slate-400">{item.control}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 shrink-0">{item.std}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Stack health summary tab
const CATEGORY_SUMMARY = [
  { cat: 'Frontend', count: 4, icon: <Code size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { cat: 'Mobile', count: 1, icon: <Zap size={16} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { cat: 'Backend', count: 2, icon: <Server size={16} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { cat: 'Database & Storage', count: 4, icon: <Database size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { cat: 'AI Infrastructure', count: 1, icon: <Cpu size={16} />, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { cat: 'Messaging', count: 1, icon: <Radio size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { cat: 'Cloud & Infra', count: 2, icon: <Cloud size={16} />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { cat: 'DevOps', count: 2, icon: <Activity size={16} />, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { cat: 'Observability', count: 1, icon: <Activity size={16} />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { cat: 'Security', count: 1, icon: <Shield size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const HealthTab: React.FC = () => (
  <div className="space-y-5">
    {/* KPI row */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total Stack Layers', value: '18', sub: '100% specified', color: 'text-orange-400' },
        { label: 'P0 Critical Layers', value: '12', sub: 'Must-have for MVP', color: 'text-red-400' },
        { label: 'P1 Important Layers', value: '6', sub: 'Post-MVP enhancement', color: 'text-amber-400' },
        { label: 'All ADOPTED', value: '18/18', sub: 'No pending decisions', color: 'text-emerald-400' },
      ].map((k, i) => (
        <div key={i} className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
          <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
          <p className="text-xs font-semibold text-white mt-1">{k.label}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{k.sub}</p>
        </div>
      ))}
    </div>

    {/* Category breakdown */}
    <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-300 mb-4">Stack Coverage by Category</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CATEGORY_SUMMARY.map((c, i) => (
          <div key={i} className={`${c.bg} rounded-xl p-3 text-center border border-slate-800/40`}>
            <div className={`${c.color} mb-1 flex justify-center`}>{c.icon}</div>
            <p className={`text-lg font-black ${c.color}`}>{c.count}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{c.cat}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Alternatives evaluated */}
    <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-300 mb-3">Alternatives Formally Evaluated</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STACK_MATRIX.map((l, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <ArrowRight size={12} className="text-slate-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-semibold">{l.layer}: </span>
              <span className="text-slate-500 italic">{l.alternatives}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'matrix', label: '18-Layer Decision Matrix', icon: <Layers size={14} /> },
  { id: 'tradeoff', label: 'Trade-Off Scorecards', icon: <Star size={14} /> },
  { id: 'sovereignty', label: 'India DPDP Sovereignty', icon: <Globe size={14} /> },
  { id: 'health', label: 'Stack Health Summary', icon: <Activity size={14} /> },
];

const Section14TechStackWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('matrix');
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const filtered = STACK_MATRIX.filter(l => {
    const matchCat = filterCat === 'All' || l.category === filterCat;
    const q = search.toLowerCase();
    const matchSearch = !q || l.layer.toLowerCase().includes(q) || l.technology.toLowerCase().includes(q) || l.whyChosen.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-[#0a0d16] border border-slate-800/70 rounded-xl p-1.5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-52">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search layer or technology…"
                className="w-full bg-[#0d1117] border border-slate-800/70 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="bg-[#0d1117] border border-slate-800/70 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500/50 appearance-none"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <CheckCircle2 size={13} /> {filtered.length}/{STACK_MATRIX.length} layers
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map(l => (
              <LayerCard
                key={l.layer}
                layer={l}
                isExpanded={expandedLayer === l.layer}
                onClick={() => setExpandedLayer(expandedLayer === l.layer ? null : l.layer)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-sm">No layers match your search.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tradeoff' && <TradeOffTab />}
      {activeTab === 'sovereignty' && <SovereigntyTab />}
      {activeTab === 'health' && <HealthTab />}
    </div>
  );
};

export default Section14TechStackWorkspace;
