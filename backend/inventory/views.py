from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsServiceRole, IsManagerOrAbove
from .models import Part, Supplier, StockMovement, PurchaseOrder, PurchaseOrderItem
from .serializers import (
    PartSerializer, SupplierSerializer, StockMovementSerializer,
    PurchaseOrderSerializer, PurchaseOrderItemSerializer
)


class PartViewSet(TenantScopedViewSet):
    """Parts/Inventory management — tenant-isolated."""
    queryset = Part.objects.select_related('supplier').all()
    serializer_class = PartSerializer
    permission_classes = [IsServiceRole]
    search_fields = ['part_number', 'name', 'category', 'bin_location']
    filterset_fields = ['category', 'is_active']
    ordering_fields = ['name', 'stock_quantity', 'created_at']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Returns parts below the reorder threshold."""
        from django.db.models import F
        qs = self.get_queryset().filter(stock_quantity__lte=F('reorder_level'))
        serializer = self.get_serializer(qs, many=True)
        return Response({'low_stock_parts': serializer.data, 'count': qs.count()}, status=status.HTTP_200_OK)


class SupplierViewSet(TenantScopedViewSet):
    """Vendor / Supplier management."""
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsServiceRole | IsManagerOrAbove]
    search_fields = ['name', 'phone', 'email', 'gstin']
    ordering = ['name']


class StockMovementViewSet(TenantScopedViewSet):
    """Inventory transaction ledger."""
    queryset = StockMovement.objects.select_related('part').all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsServiceRole]
    filterset_fields = ['movement_type']
    ordering = ['-created_at']


class PurchaseOrderViewSet(TenantScopedViewSet):
    """Procurement purchase orders."""
    queryset = PurchaseOrder.objects.select_related('supplier').prefetch_related('items').all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsServiceRole | IsManagerOrAbove]
    search_fields = ['po_number', 'supplier__name']
    filterset_fields = ['status']
    ordering = ['-order_date']


class PurchaseOrderItemViewSet(TenantScopedViewSet):
    """Line items for Purchase Orders."""
    queryset = PurchaseOrderItem.objects.select_related('purchase_order', 'part').all()
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsServiceRole | IsManagerOrAbove]
