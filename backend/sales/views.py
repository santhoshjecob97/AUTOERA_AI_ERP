from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsSalesRole, IsServiceRole
from .models import Lead, LeadFollowUp, TestDrive, Quotation, Booking, Appointment
from .serializers import (
    LeadSerializer, LeadFollowUpSerializer, TestDriveSerializer,
    QuotationSerializer, BookingSerializer, AppointmentSerializer
)


class LeadViewSet(TenantScopedViewSet):
    """Lead management — tenant-isolated, sales role required."""
    queryset = Lead.objects.select_related('customer').prefetch_related('follow_ups', 'quotations').all()
    serializer_class = LeadSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['interested_vehicle_model', 'status', 'source', 'customer__first_name', 'customer__phone']
    filterset_fields = ['status', 'source']
    ordering_fields = ['created_at', 'ai_score', 'status']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def pipeline_stats(self, request):
        """Returns CRM sales pipeline funnel statistics."""
        qs = self.get_queryset()
        stats = {
            'total_leads': qs.count(),
            'new': qs.filter(status='NEW').count(),
            'qualified': qs.filter(status='QUALIFIED').count(),
            'test_drive': qs.filter(status='TEST_DRIVE').count(),
            'quotation': qs.filter(status='QUOTATION').count(),
            'booked': qs.filter(status='BOOKED').count(),
            'won': qs.filter(status='CLOSED_WON').count(),
            'lost': qs.filter(status='CLOSED_LOST').count(),
        }
        return Response(stats, status=status.HTTP_200_OK)


class LeadFollowUpViewSet(TenantScopedViewSet):
    """Salesperson daily follow-up tasks."""
    queryset = LeadFollowUp.objects.select_related('lead').all()
    serializer_class = LeadFollowUpSerializer
    permission_classes = [IsSalesRole]
    filterset_fields = ['status', 'follow_up_type']
    ordering_fields = ['scheduled_at']
    ordering = ['scheduled_at']


class TestDriveViewSet(TenantScopedViewSet):
    """Test drive booking and scheduling with collision checks."""
    queryset = TestDrive.objects.select_related('customer', 'vehicle_stock').all()
    serializer_class = TestDriveSerializer
    permission_classes = [IsSalesRole]
    filterset_fields = ['status', 'vehicle_model']
    ordering_fields = ['scheduled_time']
    ordering = ['-scheduled_time']


class QuotationViewSet(TenantScopedViewSet):
    """Vehicle sales quotations."""
    queryset = Quotation.objects.select_related('lead', 'customer').all()
    serializer_class = QuotationSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['quotation_number', 'vehicle_model', 'customer__first_name']
    filterset_fields = ['status']
    ordering = ['-created_at']


class BookingViewSet(TenantScopedViewSet):
    """Vehicle customer orders / bookings."""
    queryset = Booking.objects.select_related('quotation', 'customer', 'allocated_stock').all()
    serializer_class = BookingSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['booking_number', 'customer__first_name']
    filterset_fields = ['status']
    ordering = ['-booking_date']


class AppointmentViewSet(TenantScopedViewSet):
    """Appointment booking — tenant-isolated."""
    queryset = Appointment.objects.select_related('customer', 'vehicle').all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsSalesRole | IsServiceRole]
    search_fields = ['appointment_type', 'status', 'customer__first_name', 'customer__phone']
    filterset_fields = ['appointment_type', 'status']
    ordering_fields = ['scheduled_time', 'created_at']
    ordering = ['-scheduled_time']
