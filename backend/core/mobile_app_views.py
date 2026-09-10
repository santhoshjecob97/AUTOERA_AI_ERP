"""
AutoEra AI — Mobile App Design API Views (Section 16)
5 Apps — Customer · Service Advisor · Fleet Manager · Dealer Executive · Technician
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .mobile_app_design import MobileAppDesignService
from .microservices_mesh import MicroservicesMeshService


class MobileArchitectureAPIView(APIView):
    """
    GET: Returns the shared React Native + Expo mobile architecture strategy.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        arch = MobileAppDesignService.get_architecture()
        return Response(MicroservicesMeshService.format_envelope(arch), status=status.HTTP_200_OK)


class MobileAppsSummaryAPIView(APIView):
    """
    GET: Returns summary of all 5 apps with screen counts, AI screen counts, and shared stack info.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        summary = MobileAppDesignService.get_apps_summary()
        return Response(MicroservicesMeshService.format_envelope(summary), status=status.HTTP_200_OK)


class MobileAppsListAPIView(APIView):
    """
    GET: Returns full specs for all 5 mobile apps.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        apps = MobileAppDesignService.get_all_apps()
        return Response(
            MicroservicesMeshService.format_envelope(apps, total=len(apps)),
            status=status.HTTP_200_OK
        )


class MobileAppDetailAPIView(APIView):
    """
    GET: Returns full screen-by-screen spec for a single app by ID (e.g. APP-01).
    """
    permission_classes = [AllowAny]

    def get(self, request, app_id):
        app = MobileAppDesignService.get_app_by_id(app_id)
        if not app:
            return Response(
                MicroservicesMeshService.format_error(
                    "APP_NOT_FOUND",
                    f"Mobile app '{app_id}' not found. Valid IDs: APP-01 through APP-05.",
                    field="app_id"
                ),
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(MicroservicesMeshService.format_envelope(app), status=status.HTTP_200_OK)
