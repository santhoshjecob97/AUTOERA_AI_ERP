"""
AutoEra AI — Microservices Mesh & API Gateway Architecture
Section 13: 16 Microservices · Kafka Event Bus · REST + GraphQL · API Gateway
"""

import uuid
import time
from typing import Dict, List, Any, Optional
from datetime import datetime

# 16 Microservices Specification Catalog
MICROSERVICES_CATALOGUE = [
    {
        "service_name": "API Gateway",
        "technology": "Kong / AWS API Gateway",
        "responsibility": "Rate limiting, auth validation, routing, load balancing, circuit breaker",
        "scaling_strategy": "Horizontal — 3+ instances, anycast",
        "port": 8000,
        "route_prefix": "/api/v1/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 4
    },
    {
        "service_name": "Auth Service",
        "technology": "FastAPI + Python + Redis",
        "responsibility": "Login, JWT, refresh tokens, MFA, RBAC permission evaluation",
        "scaling_strategy": "Horizontal — stateless + Redis session store",
        "port": 8001,
        "route_prefix": "/api/v1/auth/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 3
    },
    {
        "service_name": "User Service",
        "technology": "FastAPI + Python",
        "responsibility": "User CRUD, role assignment, profile, onboarding workflows",
        "scaling_strategy": "Horizontal",
        "port": 8002,
        "route_prefix": "/api/v1/users/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 2
    },
    {
        "service_name": "CRM Service",
        "technology": "FastAPI + Python",
        "responsibility": "Customer, lead, opportunity, campaign, lifecycle tracking",
        "scaling_strategy": "Horizontal + read replicas for analytics queries",
        "port": 8003,
        "route_prefix": "/api/v1/customers/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 4
    },
    {
        "service_name": "Sales Service",
        "technology": "FastAPI + Python",
        "responsibility": "Quotations, bookings, test drives, inventory, demand forecasting",
        "scaling_strategy": "Horizontal",
        "port": 8004,
        "route_prefix": "/api/v1/sales/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 3
    },
    {
        "service_name": "Service Ops Service",
        "technology": "FastAPI + Python",
        "responsibility": "Job cards, appointments, bay management, workshop operations",
        "scaling_strategy": "Horizontal — per-branch affinity for cache locality",
        "port": 8005,
        "route_prefix": "/api/v1/service/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 5
    },
    {
        "service_name": "Fleet Service",
        "technology": "FastAPI + Python",
        "responsibility": "Fleet vehicles, driver management, route tracking, telematics ingestion",
        "scaling_strategy": "Horizontal — IoT-write-optimised instances",
        "port": 8006,
        "route_prefix": "/api/v1/fleet/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 4
    },
    {
        "service_name": "EV Service",
        "technology": "FastAPI + Python",
        "responsibility": "Battery data, health scoring, charging sessions, BMS integration",
        "scaling_strategy": "Horizontal — compute-intensive instances for ML inference",
        "port": 8007,
        "route_prefix": "/api/v1/ev/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 3
    },
    {
        "service_name": "Insurance Service",
        "technology": "FastAPI + Python",
        "responsibility": "Policies, renewals, claims, insurer API integration, commission tracking",
        "scaling_strategy": "Horizontal",
        "port": 8008,
        "route_prefix": "/api/v1/insurance/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 3
    },
    {
        "service_name": "Finance Service",
        "technology": "FastAPI + Python",
        "responsibility": "Loan applications, DigiLocker, bank APIs, NACH, disbursement tracking",
        "scaling_strategy": "Horizontal",
        "port": 8009,
        "route_prefix": "/api/v1/finance/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 3
    },
    {
        "service_name": "Analytics Service",
        "technology": "FastAPI + Python + DuckDB",
        "responsibility": "Dashboard data, custom reports, aggregations, benchmark data serving",
        "scaling_strategy": "Vertical — compute-optimised instances (memory-intensive)",
        "port": 8010,
        "route_prefix": "/api/v1/analytics/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 2
    },
    {
        "service_name": "Notification Service",
        "technology": "Node.js + Bull + Redis",
        "responsibility": "WhatsApp, push, email, SMS delivery. Queue + retry + DLQ management.",
        "scaling_strategy": "Horizontal — queue worker auto-scaling",
        "port": 8011,
        "route_prefix": "/api/v1/communication/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 6
    },
    {
        "service_name": "AI Service",
        "technology": "FastAPI + Python + LangChain",
        "responsibility": "Agent orchestration, RAG pipeline, model routing, prompt management",
        "scaling_strategy": "Vertical + GPU instances for self-hosted models",
        "port": 8012,
        "route_prefix": "/api/v1/ai/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 4
    },
    {
        "service_name": "Billing Service",
        "technology": "FastAPI + Python + Razorpay",
        "responsibility": "Subscription management, invoicing, payment processing, commission calculation",
        "scaling_strategy": "Horizontal",
        "port": 8013,
        "route_prefix": "/api/v1/billing/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 2
    },
    {
        "service_name": "Parts Service",
        "technology": "FastAPI + Python",
        "responsibility": "Parts catalog, stock management, vendor management, procurement",
        "scaling_strategy": "Horizontal",
        "port": 8014,
        "route_prefix": "/api/v1/inventory/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 2
    },
    {
        "service_name": "OEM Service",
        "technology": "FastAPI + Python",
        "responsibility": "OEM dashboard, dealer network analytics, OEM report generation",
        "scaling_strategy": "Horizontal",
        "port": 8015,
        "route_prefix": "/api/v1/oem/",
        "status": "HEALTHY",
        "circuit_breaker": "CLOSED",
        "instances": 2
    }
]

RATE_LIMITING_TIERS = {
    "STARTER": {"limit": 100, "unit": "req/min", "header_prefix": "X-RateLimit-"},
    "GROWTH": {"limit": 500, "unit": "req/min", "header_prefix": "X-RateLimit-"},
    "ENTERPRISE": {"limit": 2000, "unit": "req/min", "header_prefix": "X-RateLimit-"}
}


class MicroservicesMeshService:
    """
    Orchestrates 16 microservices metadata, circuit breaker state,
    and REST API standard response/error formatting.
    """

    @classmethod
    def get_services(cls) -> List[Dict[str, Any]]:
        return MICROSERVICES_CATALOGUE

    @classmethod
    def get_service(cls, name: str) -> Optional[Dict[str, Any]]:
        for s in MICROSERVICES_CATALOGUE:
            if s["service_name"].lower() == name.lower():
                return s
        return None

    @classmethod
    def get_rate_limits(cls) -> Dict[str, Any]:
        return RATE_LIMITING_TIERS

    @classmethod
    def format_envelope(
        cls,
        data: Any,
        page: int = 1,
        total: Optional[int] = None,
        cursor: Optional[str] = None,
        errors: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Builds the standard REST API envelope:
        { data: T|T[], meta: { page, total, cursor, timestamp }, errors: [] }
        """
        is_list = isinstance(data, list)
        calculated_total = total if total is not None else (len(data) if is_list else 1)

        return {
            "data": data,
            "meta": {
                "page": page,
                "total": calculated_total,
                "cursor": cursor,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            },
            "errors": errors or []
        }

    @classmethod
    def format_error(
        cls,
        code: str,
        message: str,
        field: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Builds standard REST error format:
        { code: 'LEAD_NOT_FOUND', message: 'Human readable', field: 'lead_id' }
        """
        err: Dict[str, Any] = {
            "code": code,
            "message": message
        }
        if field:
            err["field"] = field

        return {
            "data": None,
            "meta": {
                "timestamp": datetime.utcnow().isoformat() + "Z"
            },
            "errors": [err]
        }

    @classmethod
    def parse_structured_filters(cls, query_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses ?filter[status]=hot&filter[score][gte]=7&sort=-created_at&after=cursor_123
        """
        filters: Dict[str, Any] = {}
        sort_by = query_params.get("sort", "-created_at")
        after_cursor = query_params.get("after")
        limit = int(query_params.get("limit", 50))

        for k, v in query_params.items():
            if k.startswith("filter["):
                clean_key = k[7:-1]
                if "][" in clean_key:
                    parts = clean_key.split("][")
                    field = parts[0]
                    op = parts[1]
                    if field not in filters:
                        filters[field] = {}
                    filters[field][op] = v
                else:
                    filters[clean_key] = v

        return {
            "filters": filters,
            "sort": sort_by,
            "cursor": after_cursor,
            "limit": limit
        }
