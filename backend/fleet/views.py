from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsFleetRole, IsManagerOrAbove
from core.views import TenantScopedViewSet
from .models import (
    FleetVehicle, OBDTelemetry, DriverScore, Geofence,
    FleetTrip, FuelTheftIncident, FleetMaintenanceCalendar
)
from .serializers import (
    FleetVehicleSerializer, OBDTelemetrySerializer,
    DriverScoreSerializer, GeofenceSerializer,
    FleetTripSerializer, FuelTheftIncidentSerializer, FleetMaintenanceCalendarSerializer
)
from .ingestion import pipeline
from .predictive_maintenance import predictive_engine
from .services import (
    GPSGeofenceEngine, OBDAnomalyDetectionEngine, FuelIntelligenceEngine,
    DriverBehaviorScoringEngine, FleetCostOptimizationEngine,
    DriverScorecardLeaderboardEngine, MaintenanceSchedulingEngine,
    RouteOptimizationEngine, FleetIoTPipelineEngine
)


class FleetVehicleViewSet(TenantScopedViewSet):
    """CRUD for fleet-enrolled vehicles with GPS and health data."""
    serializer_class = FleetVehicleSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['status', 'driver']
    search_fields = ['fleet_tag', 'obd_device_id', 'vehicle__registration_number']
    ordering_fields = ['health_score', 'created_at', 'total_distance_km']

    def get_queryset(self):
        return FleetVehicle.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('vehicle', 'driver')

    @action(detail=True, methods=['post'], url_path='check-route-deviation')
    def check_route_deviation(self, request, pk=None):
        """Checks if vehicle has deviated > 500m from assigned corridor."""
        vehicle = self.get_object()
        current_lat = float(request.data.get('latitude', vehicle.last_latitude or 19.0760))
        current_lon = float(request.data.get('longitude', vehicle.last_longitude or 72.8777))
        waypoints = request.data.get('waypoints', [(19.0760, 72.8777), (19.0820, 72.8850)])
        max_dev = float(request.data.get('max_deviation_meters', 500.0))

        result = GPSGeofenceEngine.check_route_deviation(
            current_lat=current_lat,
            current_lon=current_lon,
            approved_waypoints=waypoints,
            max_deviation_meters=max_dev
        )
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='fuel-intelligence')
    def fuel_intelligence(self, request, pk=None):
        """Evaluates fuel consumption baseline, efficiency score, and stationary drop checks."""
        vehicle = self.get_object()
        dist = float(vehicle.total_distance_km or 250.0)
        fuel_consumed = float(request.query_params.get('fuel_consumed_litres', 20.0))
        result = FuelIntelligenceEngine.evaluate_fuel_consumption(
            distance_km=dist,
            fuel_consumed_litres=fuel_consumed
        )
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='driver-scorecard')
    def driver_scorecard(self, request, pk=None):
        """Weekly telematics driver scorecard with coaching flags."""
        vehicle = self.get_object()
        result = DriverBehaviorScoringEngine.calculate_weekly_driver_score(
            total_distance_km=float(vehicle.total_distance_km or 850.0),
            speeding_events=int(request.query_params.get('speeding_events', 2)),
            harsh_braking_events=int(request.query_params.get('harsh_braking_events', 3)),
            harsh_accel_events=int(request.query_params.get('harsh_accel_events', 1)),
            idle_minutes=int(request.query_params.get('idle_minutes', 25))
        )
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='tco-analysis')
    def tco_analysis(self, request, pk=None):
        """Total Cost of Ownership (TCO) calculation and peer benchmark comparison."""
        vehicle = self.get_object()
        dist = float(vehicle.total_distance_km or 3000.0)
        result = FleetCostOptimizationEngine.calculate_vehicle_tco(monthly_distance_km=dist)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='schedule-maintenance')
    def schedule_maintenance(self, request, pk=None):
        """AI-optimised maintenance scheduling with workshop parts pre-order."""
        vehicle = self.get_object()
        rul_days = int(request.data.get('predicted_rul_days', 14))
        subsystem = str(request.data.get('subsystem', 'BRAKE'))

        result = MaintenanceSchedulingEngine.schedule_predictive_maintenance(
            fleet_vehicle_tag=vehicle.fleet_tag or 'FL-01',
            predicted_rul_days=rul_days,
            primary_subsystem=subsystem
        )
        return Response(result, status=status.HTTP_201_CREATED)


class OBDTelemetryViewSet(TenantScopedViewSet):
    """Read-only telemetry data — typically ingested via IoT pipeline."""
    serializer_class = OBDTelemetrySerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['fleet_vehicle', 'harsh_braking', 'harsh_acceleration']
    ordering_fields = ['recorded_at']
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        return OBDTelemetry.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('fleet_vehicle')


class DriverScoreViewSet(TenantScopedViewSet):
    """Daily driver behaviour scores, filterable by date and vehicle."""
    serializer_class = DriverScoreSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['fleet_vehicle', 'score_date']
    ordering_fields = ['score_date', 'overall_score']

    def get_queryset(self):
        return DriverScore.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('fleet_vehicle', 'driver')


class GeofenceViewSet(TenantScopedViewSet):
    """Manage geographic boundary zones for fleet monitoring."""
    serializer_class = GeofenceSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAbove]
    filterset_fields = ['zone_type', 'is_active']
    search_fields = ['name']

    def get_queryset(self):
        return Geofence.objects.filter(
            organization_id=self.request.organization_id
        )


class FleetTripViewSet(TenantScopedViewSet):
    """Fleet trip tracking and route corridor deviation records."""
    serializer_class = FleetTripSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['fleet_vehicle', 'status', 'route_deviation_flag']
    ordering_fields = ['start_time', 'distance_km']

    def get_queryset(self):
        return FleetTrip.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('fleet_vehicle', 'driver')


class FuelTheftIncidentViewSet(TenantScopedViewSet):
    """Stationary fuel drop alerts and siphoning incident tracking."""
    serializer_class = FuelTheftIncidentSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['fleet_vehicle', 'severity', 'resolved']
    ordering_fields = ['detected_at', 'fuel_drop_litres']

    def get_queryset(self):
        return FuelTheftIncident.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('fleet_vehicle')


class FleetMaintenanceCalendarViewSet(TenantScopedViewSet):
    """AI-optimised fleet maintenance scheduling and parts pre-order records."""
    serializer_class = FleetMaintenanceCalendarSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['fleet_vehicle', 'status', 'scheduled_date']
    ordering_fields = ['scheduled_date', 'estimated_vor_hours']

    def get_queryset(self):
        return FleetMaintenanceCalendar.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('fleet_vehicle')


class TelemetryIngestAPIView(APIView):
    """
    High-throughput ingestion endpoint for OBD-II telematics devices.
    POST /api/v1/fleet/telemetry/ingest/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        org_id = getattr(request, 'organization_id', None) or (request.user.organization.id if getattr(request.user, 'organization', None) else None)

        if not org_id:
            return Response({'error': 'Organization context required'}, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(data, list):
            result = pipeline.ingest_batch(data, organization_id=org_id)
        elif isinstance(data, dict):
            if 'packets' in data and isinstance(data['packets'], list):
                result = pipeline.ingest_batch(data['packets'], organization_id=org_id)
            else:
                result = pipeline.ingest_packet(data, organization_id=org_id)
        else:
            return Response({'error': 'Invalid payload format. Expected dict or list.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_201_CREATED if result.get('status') == 'INGESTED' or result.get('ingested_count', 0) > 0 else status.HTTP_200_OK)


class PredictiveMaintenanceAPIView(APIView):
    """
    LSTM Predictive Maintenance Evaluation for a vehicle.
    GET /api/v1/fleet/predictive-maintenance/<vehicle_id>/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def get(self, request, vehicle_id):
        org_id = getattr(request, 'organization_id', None) or (request.user.organization.id if getattr(request.user, 'organization', None) else None)

        fleet_vehicle = FleetVehicle.objects.filter(
            organization_id=org_id, id=vehicle_id
        ).select_related('vehicle').first()

        if not fleet_vehicle:
            return Response({'error': f'Fleet vehicle {vehicle_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        evaluation = predictive_engine.evaluate_vehicle(fleet_vehicle)
        return Response(evaluation, status=status.HTTP_200_OK)


class DriverLeaderboardAPIView(APIView):
    """
    Weekly driver safety and fuel efficiency leaderboard.
    GET /api/v1/fleet/driver-leaderboard/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def get(self, request):
        leaderboard = DriverScorecardLeaderboardEngine.generate_leaderboard()
        return Response(leaderboard, status=status.HTTP_200_OK)


class RouteOptimizeAPIView(APIView):
    """
    Multi-stop delivery route optimization factoring in traffic & fuel efficiency.
    POST /api/v1/fleet/routes/optimize/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        origin = request.data.get('origin', 'Central Logistics Depot')
        destinations = request.data.get('destinations', [
            {'location': 'Bandra West Delivery Hub', 'priority': 'HIGH', 'distance_km': 14.5},
            {'location': 'Andheri East Cargo Centre', 'priority': 'URGENT', 'distance_km': 8.2},
            {'location': 'Thane Distribution Warehouse', 'priority': 'NORMAL', 'distance_km': 22.0}
        ])
        result = RouteOptimizationEngine.optimize_delivery_route(origin=origin, destinations=destinations)
        return Response(result, status=status.HTTP_200_OK)


class PipelineMetricsAPIView(APIView):
    """
    Fleet IoT Data Pipeline Architecture metrics (TimescaleDB, MQTT, 10:1 compression).
    GET /api/v1/fleet/pipeline/metrics/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def get(self, request):
        fleet_size = int(request.query_params.get('fleet_size', 100))
        metrics = FleetIoTPipelineEngine.get_pipeline_architecture_metrics(fleet_size=fleet_size)
        return Response(metrics, status=status.HTTP_200_OK)

