"""
AutoEra AI — Technology Stack Decision Matrix (Section 14)
Full 18-Layer Decision Matrix · Rationale · Alternatives Evaluated
"""

from typing import Dict, List, Any, Optional

TECH_STACK_DECISION_MATRIX: List[Dict[str, Any]] = [
    {
        "layer": "Frontend Web",
        "technology": "Next.js",
        "version": "15 (App Router)",
        "why_chosen": "Server Components + streaming + SEO. Best DX for complex dashboards. Largest React ecosystem.",
        "alternatives_considered": "Remix (smaller ecosystem), SvelteKit (less India talent pool)",
        "category": "Frontend",
        "criticality": "P0 — Core Client",
        "status": "ADOPTED",
        "pros": ["React Server Components", "Instant streaming hydration", "Universal Node.js ecosystem"],
        "cons": ["Vercel vendor-tie incentives (mitigated by standalone Docker builds)"]
    },
    {
        "layer": "Frontend State",
        "technology": "Zustand + React Query",
        "version": "Latest",
        "why_chosen": "Zustand for UI state (tiny, simple). React Query for server state (cache, background refresh, optimistic updates).",
        "alternatives_considered": "Redux (excessive boilerplate), Jotai (viable alternative)",
        "category": "Frontend",
        "criticality": "P0 — Core Client",
        "status": "ADOPTED",
        "pros": ["Zero boilerplate", "Built-in stale-while-revalidate", "Microscopic bundle size"],
        "cons": ["Requires discipline separating server cache from client UI state"]
    },
    {
        "layer": "Frontend UI",
        "technology": "TailwindCSS + ShadCN UI",
        "version": "Latest",
        "why_chosen": "Utility-first for speed. ShadCN for accessible, composable base components. Native dark mode.",
        "alternatives_considered": "Material UI (too opinionated), Ant Design (too heavy for dark-mode-first)",
        "category": "Frontend",
        "criticality": "P0 — Design System",
        "status": "ADOPTED",
        "pros": ["Radix UI accessibility primitives", "Unbundled source code ownership", "Native dark/light token design"],
        "cons": ["Initial component copy-paste setup overhead"]
    },
    {
        "layer": "Frontend Charts",
        "technology": "Recharts + D3.js",
        "version": "Latest",
        "why_chosen": "Recharts for standard charts (fast, React-native). D3 for custom fleet heatmaps and complex visualisations.",
        "alternatives_considered": "Chart.js (less React-native), Highcharts (licensing cost)",
        "category": "Frontend",
        "criticality": "P1 — Analytics",
        "status": "ADOPTED",
        "pros": ["Declarative SVG rendering", "Infinite flexibility for telemetry heatmaps with D3", "Zero recurring licensing fees"],
        "cons": ["D3 steep learning curve for junior frontend engineers"]
    },
    {
        "layer": "Mobile App",
        "technology": "React Native + Expo",
        "version": "Latest",
        "why_chosen": "Share business logic with web. Expo EAS for OTA updates. One team builds 5 apps simultaneously.",
        "alternatives_considered": "Flutter (separate codebase), Native iOS+Android (double the cost)",
        "category": "Mobile",
        "criticality": "P0 — Field Operations",
        "status": "ADOPTED",
        "pros": ["90% TypeScript code reuse with web models", "Expo Application Services (EAS) OTA updates", "Fast turnaround for 5 role apps"],
        "cons": ["Native bridge overhead for high-frequency Bluetooth OBD-II peripherals"]
    },
    {
        "layer": "Backend Primary",
        "technology": "FastAPI + Python 3.12",
        "version": "Latest",
        "why_chosen": "Async, fastest Python framework, excellent AI/ML integration, type-safe Pydantic, auto-generates API docs.",
        "alternatives_considered": "Django REST (slower async), Express.js (less type safety)",
        "category": "Backend",
        "criticality": "P0 — Core API",
        "status": "ADOPTED",
        "pros": ["Starlette async event loop", "Pydantic v2 Rust-backed validation", "Native OpenAPI / Swagger autodoc"],
        "cons": ["ORM requires deliberate choice (SQLAlchemy / asyncpg)"]
    },
    {
        "layer": "Notification Service",
        "technology": "Node.js + Bull + Redis",
        "version": "Latest",
        "why_chosen": "WhatsApp queue processing. Bull for job queuing with retry + DLQ. Node for I/O-bound performance.",
        "alternatives_considered": "Python Celery (viable, considered)",
        "category": "Backend",
        "criticality": "P0 — Messaging",
        "status": "ADOPTED",
        "pros": ["High event loop concurrency for webhook bursts", "Bull Redis-backed distributed locks & DLQs", "Sub-millisecond queue latency"],
        "cons": ["Polyglot operational footprint (Node + Python)"]
    },
    {
        "layer": "Primary Database",
        "technology": "PostgreSQL 16 + TimescaleDB",
        "version": "16",
        "why_chosen": "Battle-tested, JSONB, Row-Level Security for multi-tenancy, TimescaleDB for time-series without separate DB.",
        "alternatives_considered": "MySQL (weaker JSONB, no RLS), MongoDB (ACID required for financial data)",
        "category": "Database & Storage",
        "criticality": "P0 — Persistence",
        "status": "ADOPTED",
        "pros": ["Hardware-grade Row-Level Security (RLS)", "TimescaleDB hypertables for OBD/battery pings", "Rich JSONB querying & indexing"],
        "cons": ["Requires deliberate indexing discipline at 500M+ rows"]
    },
    {
        "layer": "Cache + Sessions",
        "technology": "Redis 7 Cluster",
        "version": "7",
        "why_chosen": "Session store, API cache, Bull queue backend, real-time pub/sub for WebSocket fan-out.",
        "alternatives_considered": "Memcached (no pub/sub), Valkey (monitored as future alternative)",
        "category": "Database & Storage",
        "criticality": "P0 — Real-Time",
        "status": "ADOPTED",
        "pros": ["In-memory sub-millisecond lookups", "Cluster sharding across multiple nodes", "Pub/Sub channels for live telemetry feeds"],
        "cons": ["RAM capacity cost planning required"]
    },
    {
        "layer": "Graph Database",
        "technology": "Neo4j AuraDB",
        "version": "Latest",
        "why_chosen": "Customer-Vehicle-Service knowledge graph. Relationship traversal queries impossible in relational DB.",
        "alternatives_considered": "AWS Neptune (viable), TigerGraph (expensive)",
        "category": "Database & Storage",
        "criticality": "P1 — AI Knowledge Graph",
        "status": "ADOPTED",
        "pros": ["Index-free adjacency graph traversals", "Cypher query language simplicity", "Deep Customer 360 & churn risk discovery"],
        "cons": ["Managed AuraDB hosting overhead"]
    },
    {
        "layer": "Vector Database",
        "technology": "Pinecone + Qdrant",
        "version": "Latest",
        "why_chosen": "Pinecone for production RAG (managed, fast, reliable). Qdrant self-hosted for high-volume batch embeddings (cost).",
        "alternatives_considered": "Weaviate (viable), pgvector (MVP only — migrated to Pinecone at scale)",
        "category": "AI Infrastructure",
        "criticality": "P0 — RAG Pipeline",
        "status": "ADOPTED",
        "pros": ["Pinecone serverless tenant namespaces (org_id)", "Qdrant cost-efficiency for bulk batch embeddings", "Sub-50ms top-k cosine similarity"],
        "cons": ["Dual vector store operational sync logic"]
    },
    {
        "layer": "Message Bus",
        "technology": "Apache Kafka on AWS MSK",
        "version": "3.x",
        "why_chosen": "Durable event log, ordered delivery, exactly-once semantics. MSK removes operational overhead.",
        "alternatives_considered": "RabbitMQ (no log retention), AWS SQS (viable for simpler queuing needs)",
        "category": "Backend Messaging",
        "criticality": "P0 — Event Streaming",
        "status": "ADOPTED",
        "pros": ["Multi-tenant partitioned log storage", "High-throughput telemetry ingestion", "Managed multi-AZ replication on AWS MSK"],
        "cons": ["Consumer rebalance latency if partition consumer dies"]
    },
    {
        "layer": "Cloud Primary",
        "technology": "AWS Mumbai (ap-south-1)",
        "version": "Latest",
        "why_chosen": "DPDP Act data sovereignty. Widest India service coverage. RDS, ECS, EKS, SageMaker all available.",
        "alternatives_considered": "GCP (viable for AI services), Azure (viable for enterprise Microsoft clients)",
        "category": "Cloud & Infrastructure",
        "criticality": "P0 — Hosting",
        "status": "ADOPTED",
        "pros": ["Statutory Indian DPDP Act 2023 compliance", "Sub-25ms latency across Indian metros", "Rich managed service portfolio"],
        "cons": ["Egress bandwidth charges between regions"]
    },
    {
        "layer": "Containers + Orch.",
        "technology": "Docker + Kubernetes (EKS)",
        "version": "Latest",
        "why_chosen": "Service isolation, horizontal autoscaling, rolling deploys, GitOps. EKS removes control plane management.",
        "alternatives_considered": "ECS Fargate (simpler, viable for MVP), Nomad (smaller community)",
        "category": "Cloud & Infrastructure",
        "criticality": "P0 — Runtime",
        "status": "ADOPTED",
        "pros": ["Horizontal Pod Autoscaling (HPA) driven by CPU/Kafka queue depth", "Declarative GitOps deployments", "Multi-AZ pod distribution"],
        "cons": ["Kubernetes cluster operational complexity"]
    },
    {
        "layer": "IaC",
        "technology": "Terraform + Terragrunt",
        "version": "Latest",
        "why_chosen": "Reproducible infrastructure. Terragrunt for DRY multi-environment (dev/staging/prod) configuration.",
        "alternatives_considered": "AWS CDK (viable), Pulumi (viable, TypeScript IaC)",
        "category": "DevOps",
        "criticality": "P1 — Infrastructure as Code",
        "status": "ADOPTED",
        "pros": ["Declarative cloud blueprint", "Terragrunt DRY environment inheritance", "State locking via AWS DynamoDB"],
        "cons": ["Terraform state drift reconciliation if manual changes occur"]
    },
    {
        "layer": "CI/CD",
        "technology": "GitHub Actions + ArgoCD",
        "version": "Latest",
        "why_chosen": "GitHub Actions for build + test + image push. ArgoCD for GitOps deployment to Kubernetes — declarative.",
        "alternatives_considered": "Jenkins (maintenance overhead), CircleCI (viable)",
        "category": "DevOps",
        "criticality": "P1 — Automation",
        "status": "ADOPTED",
        "pros": ["Zero self-hosted CI maintenance", "ArgoCD automated sync from Git to EKS", "Instant rollback to prior commit hash"],
        "cons": ["GitHub Actions runner minutes quota management"]
    },
    {
        "layer": "Observability",
        "technology": "Datadog (APM + Logs + Metrics)",
        "version": "Latest",
        "why_chosen": "Full stack observability. AI anomaly detection. RUM for frontend. Worth cost at scale.",
        "alternatives_considered": "Grafana + Prometheus (open-source, Phase 1 MVP), New Relic (viable)",
        "category": "Observability",
        "criticality": "P1 — Reliability",
        "status": "ADOPTED",
        "pros": ["Unified APM traces + logs correlation", "Frontend Real User Monitoring (RUM)", "Automated anomaly alerts on error spikes"],
        "cons": ["High SaaS invoice cost if log ingestion is unindexed/unfiltered"]
    },
    {
        "layer": "Security",
        "technology": "AWS WAF + Snyk + HashiCorp Vault",
        "version": "Latest",
        "why_chosen": "WAF for API protection. Snyk for dependency scanning on every PR. Vault for secrets with auto-rotation.",
        "alternatives_considered": "Cloudflare (viable WAF + CDN), Doppler (viable for secrets management)",
        "category": "Security & Compliance",
        "criticality": "P0 — Security",
        "status": "ADOPTED",
        "pros": ["Layer 7 DDoS & OWASP Top 10 mitigation via WAF", "Continuous PR dependency vulnerability scanning", "Dynamic short-lived DB credentials via Vault"],
        "cons": ["Vault unseal and key-management ceremonies"]
    }
]


class TechStackService:
    """
    Manages metadata, categorization, trade-off analysis, and compliance audits
    for AutoEra AI's 18-layer Technology Stack.
    """

    @classmethod
    def get_matrix(cls) -> List[Dict[str, Any]]:
        return TECH_STACK_DECISION_MATRIX

    @classmethod
    def get_layer_details(cls, layer_name: str) -> Optional[Dict[str, Any]]:
        target = layer_name.lower()
        for item in TECH_STACK_DECISION_MATRIX:
            if item["layer"].lower() == target or target in item["layer"].lower():
                return item
        return None

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        total_layers = len(TECH_STACK_DECISION_MATRIX)
        categories: Dict[str, int] = {}
        criticalities: Dict[str, int] = {}

        for item in TECH_STACK_DECISION_MATRIX:
            cat = item["category"]
            crit = item["criticality"]
            categories[cat] = categories.get(cat, 0) + 1
            criticalities[crit] = criticalities.get(crit, 0) + 1

        return {
            "total_layers": total_layers,
            "specification_status": "18/18 LAYERS COMPLETE",
            "categories_breakdown": categories,
            "criticality_breakdown": criticalities,
            "data_sovereignty": {
                "region": "AWS Mumbai (ap-south-1)",
                "statutory_act": "India Digital Personal Data Protection (DPDP) Act 2023",
                "status": "100% IN-COUNTRY SOVEREIGNTY"
            },
            "security_framework": "AWS WAF + HashiCorp Vault + Snyk DevSecOps"
        }
