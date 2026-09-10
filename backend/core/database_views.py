"""
AutoEra AI — Database Architecture API Views
Section 12: 35 Master Tables, ER Design, Multi-Tenant Strategy, Indexing, TimescaleDB
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .database_service import DatabaseArchitectureService


class DatabaseSchemaAPIView(APIView):
    """
    GET: Returns all 35 master tables with primary keys, columns, foreign keys, and index strategies.
    Optional query parameter: ?table=<name> or ?module=<module_name>
    """
    permission_classes = [AllowAny]

    def get(self, request):
        table_param = request.query_params.get('table')
        module_param = request.query_params.get('module')

        if table_param:
            details = DatabaseArchitectureService.get_table_details(table_param)
            if not details:
                return Response({"error": f"Table '{table_param}' not found in 35 master tables."}, status=status.HTTP_404_NOT_FOUND)
            return Response(details, status=status.HTTP_200_OK)

        catalog = DatabaseArchitectureService.get_catalog()
        if module_param:
            catalog = [t for t in catalog if module_param.lower() in t["module"].lower()]

        summary = DatabaseArchitectureService.get_schema_summary()
        return Response({
            "summary": summary,
            "count": len(catalog),
            "tables": catalog
        }, status=status.HTTP_200_OK)


class DatabaseTenancyStrategyAPIView(APIView):
    """
    GET: Returns hybrid multi-tenancy architecture (Schema-per-tenant vs Shared RLS).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        tenant_type = request.query_params.get('type', 'SMB')
        strategy_info = DatabaseArchitectureService.get_tenancy_strategy(tenant_type)
        return Response(strategy_info, status=status.HTTP_200_OK)


class TimescaleDBStatusAPIView(APIView):
    """
    GET: Returns TimescaleDB hypertables, continuous aggregates, and compression configurations.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        ts_data = DatabaseArchitectureService.get_timescaledb_status()
        return Response(ts_data, status=status.HTTP_200_OK)


class DatabaseBenchmarkAPIView(APIView):
    """
    POST: Simulates explain-plan benchmarks comparing indexed vs unindexed scans.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        query_type = request.data.get('query_type', 'CUSTOMER_PHONE_LOOKUP')
        result = DatabaseArchitectureService.simulate_query_benchmark(query_type)
        return Response(result, status=status.HTTP_200_OK)
