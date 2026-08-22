from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsFinanceRole, IsManagerOrAbove
from .models import Invoice, Payment, FinanceApplication
from .serializers import InvoiceSerializer, PaymentSerializer, FinanceApplicationSerializer


class InvoiceViewSet(TenantScopedViewSet):
    """Invoice management — tenant-isolated, finance role required."""
    queryset = Invoice.objects.select_related('customer', 'job_card').prefetch_related('payments').all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsFinanceRole]
    search_fields = ['invoice_number', 'customer__first_name', 'customer__phone']
    filterset_fields = ['status', 'invoice_type']
    ordering_fields = ['created_at', 'due_date', 'total_amount']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def generate_from_job_card(self, request, pk=None):
        """Auto-computes parts, labour, taxes, and totals from the Job Card."""
        invoice = self.get_object()
        invoice.recalculate_from_job_card()
        return Response(InvoiceSerializer(invoice).data, status=status.HTTP_200_OK)


class PaymentViewSet(TenantScopedViewSet):
    """Payment processing — tenant-isolated, finance role required."""
    queryset = Payment.objects.select_related('invoice').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsFinanceRole]
    search_fields = ['transaction_reference', 'invoice__invoice_number']
    filterset_fields = ['payment_method', 'status']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']


class FinanceApplicationViewSet(TenantScopedViewSet):
    """Auto-loan finance applications tracking."""
    queryset = FinanceApplication.objects.select_related('customer').all()
    serializer_class = FinanceApplicationSerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    search_fields = ['application_number', 'customer__first_name', 'bank_partner']
    filterset_fields = ['status', 'bank_partner']
    ordering = ['-created_at']
