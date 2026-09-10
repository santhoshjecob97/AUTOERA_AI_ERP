"""
AutoEra AI — Security & Compliance API Views (Section 15)
Defense in Depth · DPDP Act 2023 · RBAC+RLS · SOC2 · ISO 27001
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .security_compliance import SecurityComplianceService
from .microservices_mesh import MicroservicesMeshService


class SecurityLayersAPIView(APIView):
    """
    GET: Returns all 10 Defense-in-Depth security control layers.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        layers = SecurityComplianceService.get_security_layers()
        return Response(
            MicroservicesMeshService.format_envelope(layers, total=len(layers)),
            status=status.HTTP_200_OK
        )


class SecurityLayerDetailAPIView(APIView):
    """
    GET: Returns detailed info for a single security layer by ID (e.g. SL-01).
    """
    permission_classes = [AllowAny]

    def get(self, request, layer_id):
        layer = SecurityComplianceService.get_layer_by_id(layer_id)
        if not layer:
            return Response(
                MicroservicesMeshService.format_error(
                    "LAYER_NOT_FOUND",
                    f"Security layer '{layer_id}' not found.",
                    field="layer_id"
                ),
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(MicroservicesMeshService.format_envelope(layer), status=status.HTTP_200_OK)


class DPDPRequirementsAPIView(APIView):
    """
    GET: Returns all 9 DPDP Act 2023 compliance requirements with implementation details.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        requirements = SecurityComplianceService.get_dpdp_requirements()
        return Response(
            MicroservicesMeshService.format_envelope(requirements, total=len(requirements)),
            status=status.HTTP_200_OK
        )


class ComplianceControlsAPIView(APIView):
    """
    GET: Returns SOC2 and ISO 27001 compliance controls.
    Query param: ?standard=SOC2 or ?standard=ISO 27001
    """
    permission_classes = [AllowAny]

    def get(self, request):
        standard = request.query_params.get('standard')
        controls = SecurityComplianceService.get_compliance_controls(standard=standard)
        return Response(
            MicroservicesMeshService.format_envelope(controls, total=len(controls)),
            status=status.HTTP_200_OK
        )


class SecuritySummaryAPIView(APIView):
    """
    GET: Returns security posture summary — all layers, DPDP compliance %, encryption specs.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        summary = SecurityComplianceService.get_security_summary()
        return Response(MicroservicesMeshService.format_envelope(summary), status=status.HTTP_200_OK)


class BreachNotificationSimulatorAPIView(APIView):
    """
    GET: Simulates the DPDP Act Section 8 breach notification workflow.
    Query param: ?breach_type=P1 (default) or ?breach_type=P2
    """
    permission_classes = [AllowAny]

    def get(self, request):
        breach_type = request.query_params.get('breach_type', 'P1')
        simulation = SecurityComplianceService.simulate_breach_notification(breach_type=breach_type)
        return Response(MicroservicesMeshService.format_envelope(simulation), status=status.HTTP_200_OK)
