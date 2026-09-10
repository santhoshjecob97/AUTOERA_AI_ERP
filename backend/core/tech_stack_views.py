"""
AutoEra AI — Technology Stack API Views
Section 14: Full Decision Matrix · Rationale · Alternatives Evaluated
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .tech_stack import TechStackService
from .microservices_mesh import MicroservicesMeshService


class TechStackMatrixAPIView(APIView):
    """
    GET: Returns complete 18-layer decision matrix with alternatives evaluated.
    Query param ?category=Frontend or ?search=Next.js
    """
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        matrix = TechStackService.get_matrix()

        if category and category != 'ALL':
            matrix = [item for item in matrix if item['category'].lower() == category.lower()]
        if search:
            search_l = search.lower()
            matrix = [item for item in matrix if (
                search_l in item['layer'].lower() or
                search_l in item['technology'].lower() or
                search_l in item['why_chosen'].lower() or
                search_l in item['alternatives_considered'].lower()
            )]

        return Response(MicroservicesMeshService.format_envelope(matrix, total=len(matrix)), status=status.HTTP_200_OK)


class TechStackSummaryAPIView(APIView):
    """
    GET: Returns summary statistics, categorization, and DPDP Act compliance info.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        summary = TechStackService.get_summary()
        return Response(MicroservicesMeshService.format_envelope(summary), status=status.HTTP_200_OK)


class TechStackLayerDetailAPIView(APIView):
    """
    GET: Returns detailed rationale, pros, cons, and alternatives for a single layer.
    """
    permission_classes = [AllowAny]

    def get(self, request, layer_slug):
        layer = TechStackService.get_layer_details(layer_slug)
        if not layer:
            return Response(
                MicroservicesMeshService.format_error("LAYER_NOT_FOUND", f"Layer '{layer_slug}' not found in 18-layer stack matrix.", field="layer_slug"),
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(MicroservicesMeshService.format_envelope(layer), status=status.HTTP_200_OK)
