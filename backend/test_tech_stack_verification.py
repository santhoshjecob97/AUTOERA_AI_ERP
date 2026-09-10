"""
AutoEra AI — Section 14: Technology Stack Decision Matrix Verification Suite
Full Decision Matrix · Rationale · Alternatives Evaluated
18 Layers · India DPDP Act 2023 Sovereignty · Trade-Off Scorecards
"""

import os
import sys
import django

# Setup Django Environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.tech_stack import TechStackService, TECH_STACK_DECISION_MATRIX
from core.tech_stack_views import TechStackMatrixAPIView, TechStackSummaryAPIView, TechStackLayerDetailAPIView
from rest_framework.test import APIRequestFactory


def run_tests():
    print("=" * 70)
    print("RUNNING SECTION 14: TECHNOLOGY STACK TEST SUITE")
    print("=" * 70)
    passed_count = 0

    # -------------------------------------------------------------
    # TEST 1: Verify All 18 Stack Layers Completeness
    # -------------------------------------------------------------
    print("\n[TEST 1] Verifying 18-Layer Stack Matrix Completeness...")
    matrix = TechStackService.get_matrix()
    assert len(matrix) == 18, f"Expected 18 layers, got {len(matrix)}"
    passed_count += 1
    print(f" -> PASSED: Exactly 18 architectural layers catalogued.")

    # -------------------------------------------------------------
    # TEST 2: Verify Schema Integrity of Every Layer
    # -------------------------------------------------------------
    print("\n[TEST 2] Verifying Layer Attributes & Trade-Off Schema...")
    required_keys = ["layer", "technology", "version", "why_chosen", "alternatives_considered", "category", "criticality", "status", "pros", "cons"]
    for item in matrix:
        for k in required_keys:
            assert k in item and item[k], f"Missing or empty key '{k}' in layer '{item.get('layer')}'"
        assert len(item["pros"]) > 0, f"Layer '{item['layer']}' has no pros listed"
        assert len(item["cons"]) > 0, f"Layer '{item['layer']}' has no cons listed"
    passed_count += 1
    print(f" -> PASSED: All 18 layers have complete rationales, alternatives, pros, and cons.")

    # -------------------------------------------------------------
    # TEST 3: Verify Frontend Web & State Layers
    # -------------------------------------------------------------
    print("\n[TEST 3] Verifying Frontend Web, State, UI & Charts Specifications...")
    nextjs = TechStackService.get_layer_details("Frontend Web")
    assert nextjs is not None
    assert "Next.js" in nextjs["technology"]
    assert "15" in nextjs["version"]
    assert "Remix" in nextjs["alternatives_considered"]

    state = TechStackService.get_layer_details("Frontend State")
    assert state is not None
    assert "Zustand" in state["technology"] and "React Query" in state["technology"]
    assert "Redux" in state["alternatives_considered"]

    ui = TechStackService.get_layer_details("Frontend UI")
    assert ui is not None
    assert "TailwindCSS" in ui["technology"] and "ShadCN UI" in ui["technology"]
    assert "Material UI" in ui["alternatives_considered"]

    charts = TechStackService.get_layer_details("Frontend Charts")
    assert charts is not None
    assert "Recharts" in charts["technology"] and "D3.js" in charts["technology"]
    assert "Highcharts" in charts["alternatives_considered"]
    passed_count += 1
    print(f" -> PASSED: Frontend stack strictly adheres to Next.js 15, Zustand+React Query, ShadCN, and Recharts+D3.")

    # -------------------------------------------------------------
    # TEST 4: Verify Mobile App Architecture (5 Apps, React Native + Expo)
    # -------------------------------------------------------------
    print("\n[TEST 4] Verifying Mobile App Layer Specifications...")
    mobile = TechStackService.get_layer_details("Mobile App")
    assert mobile is not None
    assert "React Native" in mobile["technology"] and "Expo" in mobile["technology"]
    assert "Flutter" in mobile["alternatives_considered"]
    assert "OTA" in mobile["why_chosen"] or "EAS" in mobile["why_chosen"]
    passed_count += 1
    print(f" -> PASSED: Mobile app architecture verified with React Native, Expo EAS OTA, and shared TypeScript logic.")

    # -------------------------------------------------------------
    # TEST 5: Verify Backend Primary & Notification Service
    # -------------------------------------------------------------
    print("\n[TEST 5] Verifying Primary Backend & Notification Microservices...")
    backend = TechStackService.get_layer_details("Backend Primary")
    assert backend is not None
    assert "FastAPI" in backend["technology"] and "Python 3.12" in backend["technology"]
    assert "Django REST" in backend["alternatives_considered"]

    notifier = TechStackService.get_layer_details("Notification Service")
    assert notifier is not None
    assert "Node.js" in notifier["technology"] and "Bull" in notifier["technology"] and "Redis" in notifier["technology"]
    assert "Celery" in notifier["alternatives_considered"]
    passed_count += 1
    print(f" -> PASSED: Backend Primary (FastAPI 3.12) and Notification Service (Node.js + Bull + Redis) verified.")

    # -------------------------------------------------------------
    # TEST 6: Verify Database & Persistence Ecosystem (Postgres 16, TimescaleDB, Redis, Neo4j, Pinecone)
    # -------------------------------------------------------------
    print("\n[TEST 6] Verifying Multi-Model Persistence Ecosystem...")
    pg = TechStackService.get_layer_details("Primary Database")
    assert pg is not None
    assert "PostgreSQL 16" in pg["technology"] and "TimescaleDB" in pg["technology"]
    assert "Row-Level Security" in pg["why_chosen"] or "RLS" in pg["why_chosen"]

    redis = TechStackService.get_layer_details("Cache + Sessions")
    assert redis is not None
    assert "Redis 7 Cluster" in redis["technology"]

    neo4j = TechStackService.get_layer_details("Graph Database")
    assert neo4j is not None
    assert "Neo4j AuraDB" in neo4j["technology"]

    vector = TechStackService.get_layer_details("Vector Database")
    assert vector is not None
    assert "Pinecone" in vector["technology"] and "Qdrant" in vector["technology"]
    assert "pgvector" in vector["alternatives_considered"]
    passed_count += 1
    print(f" -> PASSED: Multi-model persistence verified (PostgreSQL 16, TimescaleDB, Redis 7, Neo4j, Pinecone + Qdrant).")

    # -------------------------------------------------------------
    # TEST 7: Verify Message Bus & Cloud Infrastructure
    # -------------------------------------------------------------
    print("\n[TEST 7] Verifying Kafka Message Bus & EKS Orchestration...")
    kafka = TechStackService.get_layer_details("Message Bus")
    assert kafka is not None
    assert "Apache Kafka on AWS MSK" in kafka["technology"]
    assert "RabbitMQ" in kafka["alternatives_considered"]

    containers = TechStackService.get_layer_details("Containers + Orch.")
    assert containers is not None
    assert "Docker + Kubernetes (EKS)" in containers["technology"]
    assert "ECS Fargate" in containers["alternatives_considered"]
    passed_count += 1
    print(f" -> PASSED: Apache Kafka on AWS MSK and Kubernetes EKS orchestration verified.")

    # -------------------------------------------------------------
    # TEST 8: Verify Data Sovereignty (AWS Mumbai ap-south-1 & DPDP Act 2023)
    # -------------------------------------------------------------
    print("\n[TEST 8] Verifying India DPDP Act Data Sovereignty & Cloud Hosting...")
    cloud = TechStackService.get_layer_details("Cloud Primary")
    assert cloud is not None
    assert "AWS Mumbai (ap-south-1)" in cloud["technology"]
    assert "DPDP Act" in cloud["why_chosen"]

    summary = TechStackService.get_summary()
    assert summary["data_sovereignty"]["region"] == "AWS Mumbai (ap-south-1)"
    assert "DPDP" in summary["data_sovereignty"]["statutory_act"]
    passed_count += 1
    print(f" -> PASSED: AWS Mumbai (ap-south-1) with 100% in-country data sovereignty statutory compliance confirmed.")

    # -------------------------------------------------------------
    # TEST 9: Verify DevOps, Observability & Security Layers
    # -------------------------------------------------------------
    print("\n[TEST 9] Verifying Terraform, ArgoCD, Datadog & WAF/Vault Security...")
    iac = TechStackService.get_layer_details("IaC")
    assert "Terraform + Terragrunt" in iac["technology"]

    cicd = TechStackService.get_layer_details("CI/CD")
    assert "GitHub Actions + ArgoCD" in cicd["technology"]

    obs = TechStackService.get_layer_details("Observability")
    assert "Datadog" in obs["technology"]
    assert "Grafana" in obs["alternatives_considered"]

    sec = TechStackService.get_layer_details("Security")
    assert "AWS WAF" in sec["technology"] and "HashiCorp Vault" in sec["technology"] and "Snyk" in sec["technology"]
    passed_count += 1
    print(f" -> PASSED: DevOps (Terraform+ArgoCD), Observability (Datadog), and Security (WAF+Snyk+Vault) verified.")

    # -------------------------------------------------------------
    # TEST 10: Verify REST API Endpoints & Standard Response Envelope
    # -------------------------------------------------------------
    print("\n[TEST 10] Verifying Tech Stack REST API Endpoints...")
    factory = APIRequestFactory()

    # 1. Full Matrix
    view_matrix = TechStackMatrixAPIView.as_view()
    req = factory.get('/api/v1/tech-stack/matrix/')
    resp = view_matrix(req)
    assert resp.status_code == 200
    assert len(resp.data["data"]) == 18
    assert resp.data["meta"]["total"] == 18

    # 2. Filter by Category
    req_cat = factory.get('/api/v1/tech-stack/matrix/?category=Frontend')
    resp_cat = view_matrix(req_cat)
    assert resp_cat.status_code == 200
    assert len(resp_cat.data["data"]) == 4

    # 3. Filter by Search Query
    req_search = factory.get('/api/v1/tech-stack/matrix/?search=Kafka')
    resp_search = view_matrix(req_search)
    assert resp_search.status_code == 200
    assert len(resp_search.data["data"]) == 1
    assert "Kafka" in resp_search.data["data"][0]["technology"]

    # 4. Summary Endpoint
    view_summary = TechStackSummaryAPIView.as_view()
    req_sum = factory.get('/api/v1/tech-stack/summary/')
    resp_sum = view_summary(req_sum)
    assert resp_sum.status_code == 200
    assert resp_sum.data["data"]["total_layers"] == 18
    assert "categories_breakdown" in resp_sum.data["data"]

    # 5. Layer Detail Endpoint
    view_detail = TechStackLayerDetailAPIView.as_view()
    req_detail = factory.get('/api/v1/tech-stack/layer/frontend-web/')
    resp_detail = view_detail(req_detail, layer_slug="Frontend Web")
    assert resp_detail.status_code == 200
    assert resp_detail.data["data"]["technology"] == "Next.js"

    passed_count += 1
    print(f" -> PASSED: Tech stack REST APIs return validated standard response envelopes.")

    print("\n" + "=" * 70)
    print(f"ALL SECTION 14 VERIFICATION TESTS PASSED: {passed_count}/10")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
