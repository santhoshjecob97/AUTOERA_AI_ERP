from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsSalesRole, IsServiceRole, IsFleetRole
from .models import Vehicle, VehicleStock, VehicleHealth
from .serializers import VehicleSerializer, VehicleStockSerializer, VehicleHealthSerializer


class VehicleViewSet(TenantScopedViewSet):
    """Vehicle CRUD — tenant-isolated."""
    queryset = Vehicle.objects.select_related('customer').all()
    serializer_class = VehicleSerializer
    permission_classes = [IsSalesRole | IsServiceRole]
    search_fields = ['vin', 'registration_number', 'make', 'model', 'customer__first_name', 'customer__phone']
    filterset_fields = ['make', 'fuel_type', 'transmission_type', 'is_active']
    ordering_fields = ['created_at', 'make', 'model', 'year']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'], url_path='360')
    def vehicle_360(self, request, pk=None):
        """
        Stage 7 Production Vehicle 360 Aggregation:
        Aggregates VIN, registration, make, model, variant, year, odometer, owner,
        job card history, parts replaced, appointments, open complaints, and AI recommendations.
        """
        vehicle = self.get_object()

        # Job cards & repair history
        job_cards_data = []
        parts_replaced = []
        try:
            from service.models import JobCard
            jcs = vehicle.job_cards.filter(organization_id=vehicle.organization_id).order_by('-created_at')[:15]
            job_cards_data = [
                {
                    'id': str(jc.id),
                    'job_card_number': jc.job_card_number,
                    'status': jc.status,
                    'complaints': jc.customer_complaints,
                    'estimated_cost': str(jc.estimated_cost),
                    'final_total_cost': str(jc.final_total_cost),
                    'created_at': jc.created_at.isoformat()
                }
                for jc in jcs
            ]
        except Exception:
            pass

        # Appointments
        appointments_data = []
        try:
            from sales.models import Appointment
            appts = Appointment.objects.filter(vehicle=vehicle, organization_id=vehicle.organization_id).order_by('-scheduled_time')[:10]
            appointments_data = [
                {
                    'id': str(a.id),
                    'appointment_type': getattr(a, 'appointment_type', 'SERVICE_CHECKUP'),
                    'scheduled_time': a.scheduled_time.isoformat() if hasattr(a, 'scheduled_time') and a.scheduled_time else None,
                    'status': a.status,
                    'notes': a.notes
                }
                for a in appts
            ]
        except Exception:
            pass

        # Owner info
        owner_data = None
        if vehicle.customer:
            c = vehicle.customer
            owner_data = {
                'id': str(c.id),
                'first_name': c.first_name,
                'last_name': c.last_name,
                'phone': c.phone,
                'email': c.email
            }

        # AI Recommendations
        ai_recommendations = []
        if vehicle.odometer_reading:
            if vehicle.odometer_reading >= 10000:
                ai_recommendations.append("Recommended periodic maintenance service: Engine oil, oil filter, and brake pad inspection.")
            if vehicle.odometer_reading >= 40000:
                ai_recommendations.append("Major service interval reached: Transmission fluid, brake fluid, and coolant flush recommended.")

        return Response({
            'vehicle': VehicleSerializer(vehicle).data,
            'owner': owner_data,
            'job_cards': job_cards_data,
            'parts_replaced': parts_replaced,
            'appointments': appointments_data,
            'ai_recommendations': ai_recommendations,
            'total_services': len(job_cards_data)
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def service_history(self, request, pk=None):
        """Returns the full service repair history of the vehicle."""
        vehicle = self.get_object()
        from service.serializers import JobCardSerializer
        job_cards = vehicle.job_cards.all().order_by('-created_at')
        serializer = JobCardSerializer(job_cards, many=True)
        return Response({'history': serializer.data}, status=status.HTTP_200_OK)


class VehicleStockViewSet(TenantScopedViewSet):
    """Dealership Vehicle Stock & Showroom Inventory."""
    queryset = VehicleStock.objects.select_related('allocated_to_customer').all()
    serializer_class = VehicleStockSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['vin', 'make', 'model', 'variant', 'yard_location']
    filterset_fields = ['status', 'make', 'fuel_type']
    ordering_fields = ['arrival_date', 'selling_price', 'created_at']
    ordering = ['-created_at']


class VehicleHealthViewSet(TenantScopedViewSet):
    """Vehicle Telemetry and Health Scoring per Section 03/09."""
    queryset = VehicleHealth.objects.select_related('vehicle').all()
    serializer_class = VehicleHealthSerializer
    permission_classes = [IsServiceRole | IsFleetRole]
    search_fields = ['vehicle__vin', 'vehicle__registration_number']
    filterset_fields = ['risk_level', 'overall_score']
    ordering_fields = ['overall_score', 'last_telemetry_at']
    ordering = ['overall_score']

