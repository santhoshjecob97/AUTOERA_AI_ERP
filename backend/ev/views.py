from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from core.permissions import IsFleetRole, IsManagerOrAbove
from core.views import TenantScopedViewSet
from .models import (
    EVBatteryData, ChargingSession, BatteryHealthScore,
    EVRangeAlert, BatteryReplacementPlan
)
from .serializers import (
    EVBatteryDataSerializer, ChargingSessionSerializer,
    BatteryHealthScoreSerializer, EVRangeAlertSerializer,
    BatteryReplacementPlanSerializer
)
from .services import (
    ev_health_engine,
    RangePredictionEngine,
    BatteryDegradationForecastingEngine,
    ChargingSessionAnalyticsEngine,
    RangeAnxietyInterventionEngine,
    CellImbalanceDetectionEngine,
    ThermalManagementAlertEngine,
    EVTCOCalculatorEngine,
    BatteryReplacementPlanningEngine,
    OEMBMSAPIEngine,
)
from vehicles.models import Vehicle


class EVBatteryDataViewSet(TenantScopedViewSet):
    """Read-only battery telemetry — ingested via BMS API pipeline."""
    serializer_class = EVBatteryDataSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['vehicle', 'is_charging', 'is_driving']
    ordering_fields = ['recorded_at']
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        return EVBatteryData.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('vehicle')


class ChargingSessionViewSet(TenantScopedViewSet):
    """Manage and view charging sessions."""
    serializer_class = ChargingSessionSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['vehicle', 'charger_type', 'status']
    ordering_fields = ['started_at', 'energy_added_kwh', 'energy_cost_inr']

    def get_queryset(self):
        return ChargingSession.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('vehicle')


class BatteryHealthScoreViewSet(TenantScopedViewSet):
    """Daily battery health scores for trend analysis."""
    serializer_class = BatteryHealthScoreSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['vehicle', 'score_date']
    ordering_fields = ['score_date', 'overall_score']

    def get_queryset(self):
        return BatteryHealthScore.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('vehicle')


class EVRangeAlertViewSet(TenantScopedViewSet):
    """Range anxiety alerts & nearest charging station interventions (P0 MVP)."""
    serializer_class = EVRangeAlertSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['vehicle', 'status', 'whatsapp_alert_sent']
    ordering_fields = ['triggered_at', 'current_soc_pct']

    def get_queryset(self):
        return EVRangeAlert.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('vehicle')


class BatteryReplacementPlanViewSet(TenantScopedViewSet):
    """Battery replacement planning & workshop booking flow (P1)."""
    serializer_class = BatteryReplacementPlanSerializer
    permission_classes = [IsAuthenticated, IsFleetRole]
    filterset_fields = ['vehicle', 'booking_status']
    ordering_fields = ['created_at', 'current_soh_pct']

    def get_queryset(self):
        return BatteryReplacementPlan.objects.filter(
            organization_id=self.request.organization_id
        ).select_related('vehicle')

    @action(detail=True, methods=['post'], url_path='book-workshop')
    def book_workshop(self, request, pk=None):
        plan = self.get_object()
        selected_option = request.data.get('selected_option', 'OEM_NEW_PACK')
        plan.selected_option = selected_option
        plan.booking_status = 'BOOKED'
        plan.job_card_reference = f"JC-EV-{plan.vehicle.registration_number[:4]}-REPLACE"
        plan.save()
        return Response({
            'message': 'Workshop job card created successfully for battery replacement',
            'job_card_reference': plan.job_card_reference,
            'status': plan.booking_status,
            'selected_option': plan.selected_option
        }, status=status.HTTP_200_OK)


class EVBatteryHealthComputeAPIView(APIView):
    """
    Computes Section 10 Battery Health Score on-demand or 2am batch.
    POST /api/v1/ev/health-scores/compute/
    Body: { "vehicle_id": "uuid" } (Optional: if omitted, computes for all vehicles)
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        vehicle_id = request.data.get('vehicle_id')
        org_id = getattr(request, 'organization_id', None) or (request.user.organization.id if getattr(request.user, 'organization', None) else None)

        if vehicle_id:
            try:
                vehicle = Vehicle.objects.filter(organization_id=org_id, id=vehicle_id).first()
            except Exception:
                vehicle = None

            if not vehicle:
                # Provide fallback simulated vehicle compute if DB record not present
                result = ev_health_engine.calculate_battery_health_score(
                    soh_pct=float(request.data.get('soh_pct', 88.5)),
                    capacity_fade_rate_90d=float(request.data.get('capacity_fade_rate_90d', 0.02)),
                    cell_voltage_balance_score=float(request.data.get('cell_voltage_balance_score', 94.0)),
                    thermal_management_efficiency=float(request.data.get('thermal_management_efficiency', 91.0))
                )
                return Response({'vehicle_id': vehicle_id, **result}, status=status.HTTP_200_OK)

            result = ev_health_engine.compute_daily_score(vehicle)
            return Response(result, status=status.HTTP_200_OK)

        # Batch compute for all active vehicles
        try:
            vehicles = list(Vehicle.objects.filter(organization_id=org_id)[:50])
            results = [ev_health_engine.compute_daily_score(v) for v in vehicles]
        except Exception:
            results = []

        return Response({
            'total_evaluated': len(results),
            'results': results
        }, status=status.HTTP_200_OK)


class EVRangePredictionAPIView(APIView):
    """
    Predicts personalized remaining range per driver profile, weather, terrain, and payload (P1).
    POST /api/v1/ev/range/predict/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        soc_pct = float(request.data.get('soc_pct', 80.0))
        battery_capacity_kwh = float(request.data.get('battery_capacity_kwh', 40.5))
        driver_profile = request.data.get('driver_profile', request.data.get('driving_style', 'NORMAL'))
        ambient_temp_c = float(request.data.get('ambient_temp_c', 28.0))
        terrain = request.data.get('terrain', 'FLAT')
        payload_kg = float(request.data.get('payload_kg', 150.0))
        ac_active = bool(request.data.get('ac_active', True))

        prediction = RangePredictionEngine.predict_personalized_range(
            battery_capacity_kwh=battery_capacity_kwh,
            current_soc_pct=soc_pct,
            driver_profile=driver_profile,
            ambient_temp_c=ambient_temp_c,
            terrain=terrain,
            payload_kg=payload_kg,
            ac_active=ac_active
        )
        return Response(prediction, status=status.HTTP_200_OK)


class EVDegradationForecastAPIView(APIView):
    """
    Forecasts battery degradation to 70% threshold using Weibull distribution (P1).
    POST /api/v1/ev/degradation/forecast/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        current_soh_pct = float(request.data.get('current_soh_pct', 87.4))
        current_odometer_km = float(request.data.get('current_odometer_km', 48500.0))
        annual_km = float(request.data.get('annual_km', request.data.get('annual_mileage_km', 24000.0)))
        pack_capacity_kwh = float(request.data.get('pack_capacity_kwh', 40.5))

        forecast = BatteryDegradationForecastingEngine.forecast_degradation(
            current_soh_pct=current_soh_pct,
            current_odometer_km=current_odometer_km,
            annual_km=annual_km,
            pack_capacity_kwh=pack_capacity_kwh
        )
        return Response(forecast, status=status.HTTP_200_OK)


class EVChargingAnalyticsAPIView(APIView):
    """
    Analyzes charging session efficiency, costs, and optimal off-peak windows (P1).
    POST /api/v1/ev/charging/analytics/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        energy_added_kwh = float(request.data.get('energy_added_kwh', 28.5))
        duration_minutes = int(request.data.get('duration_minutes', 45))
        charger_type = request.data.get('charger_type', 'DC_FAST_CCS2')
        start_hour = int(request.data.get('start_hour', 14))

        analytics = ChargingSessionAnalyticsEngine.analyze_session(
            energy_added_kwh=energy_added_kwh,
            duration_minutes=duration_minutes,
            charger_type=charger_type,
            start_hour=start_hour
        )
        return Response(analytics, status=status.HTTP_200_OK)


class EVRangeAnxietyInterventionAPIView(APIView):
    """
    Detects low SOH/SOC and generates proactive WhatsApp intervention with nearest stations (P0 MVP).
    POST /api/v1/ev/range-anxiety/check/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        vehicle_reg = request.data.get('vehicle_reg', request.data.get('vehicle_registration', 'TN-09-EV-2026'))
        soc_pct = float(request.data.get('soc_pct', 16.0))
        soh_pct = float(request.data.get('soh_pct', 78.5))
        current_lat = float(request.data.get('latitude', 19.0760))
        current_lon = float(request.data.get('longitude', 72.8777))

        intervention = RangeAnxietyInterventionEngine.check_range_intervention(
            vehicle_reg=vehicle_reg,
            soc_pct=soc_pct,
            soh_pct=soh_pct,
            current_lat=current_lat,
            current_lon=current_lon
        )
        return Response(intervention, status=status.HTTP_200_OK)


class EVCellImbalanceCheckAPIView(APIView):
    """
    Evaluates individual cell voltages across 96/108 series cells for weak-cell anomaly detection (P2).
    POST /api/v1/ev/cells/imbalance-check/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        cell_voltages = request.data.get('cell_voltages')
        if not cell_voltages:
            # 96-cell series baseline: 3.82V - 3.86V
            cell_voltages = [round(3.845 + (0.012 if i % 7 != 0 else -0.038), 3) for i in range(96)]

        evaluation = CellImbalanceDetectionEngine.evaluate_cell_balance(cell_voltages=cell_voltages)
        return Response(evaluation, status=status.HTTP_200_OK)


class EVThermalSafetyCheckAPIView(APIView):
    """
    Monitors thermal deviation during charge/discharge and provides safety advisories (P1).
    POST /api/v1/ev/thermal/safety-check/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        cell_temp_min_c = float(request.data.get('cell_temp_min_c', 28.5))
        cell_temp_max_c = float(request.data.get('cell_temp_max_c', 33.2))
        is_charging = bool(request.data.get('is_charging', True))

        evaluation = ThermalManagementAlertEngine.evaluate_thermal_safety(
            cell_temp_min_c=cell_temp_min_c,
            cell_temp_max_c=cell_temp_max_c,
            is_charging=is_charging
        )
        return Response(evaluation, status=status.HTTP_200_OK)


class EVTCOCalculatorAPIView(APIView):
    """
    Compares EV vs Diesel per-km costs, annual savings, and CO2 averted (P1).
    POST /api/v1/ev/tco/calculate/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        annual_distance_km = float(request.data.get('annual_distance_km', 30000.0))
        electricity_cost = float(request.data.get('electricity_cost_per_kwh', 8.0))
        diesel_cost = float(request.data.get('diesel_cost_per_litre', 94.0))

        tco = EVTCOCalculatorEngine.calculate_tco_comparison(
            annual_distance_km=annual_distance_km,
            electricity_cost_per_kwh=electricity_cost,
            diesel_cost_per_litre=diesel_cost
        )
        return Response(tco, status=status.HTTP_200_OK)


class EVReplacementPlanningAPIView(APIView):
    """
    Retrieves 4 battery replacement options (OEM New / Refurb / Recondition / Trade-in) (P1).
    POST /api/v1/ev/replacement/options/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        vehicle_id = request.data.get('vehicle_id', 'VEH-EV-DEMO')
        soh_pct = float(request.data.get('soh_pct', 68.5))

        options = BatteryReplacementPlanningEngine.get_replacement_options(
            vehicle_id=vehicle_id,
            soh_pct=soh_pct
        )
        return Response(options, status=status.HTTP_200_OK)


class EVOEMBMSQueryAPIView(APIView):
    """
    Connects to manufacturer-authenticated OEM BMS APIs (Tata, Ather, OLA, Mahindra) (P2).
    POST /api/v1/ev/oem-bms/query/
    """
    permission_classes = [IsAuthenticated, IsFleetRole]

    def post(self, request):
        oem_name = request.data.get('oem_name', 'Tata Motors EV')
        vin = request.data.get('vin', 'MAT612345NEXON1234')

        telemetry = OEMBMSAPIEngine.query_oem_bms_telemetry(
            oem_name=oem_name,
            vin=vin
        )
        return Response(telemetry, status=status.HTTP_200_OK)


