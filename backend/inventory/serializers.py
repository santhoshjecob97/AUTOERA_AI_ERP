from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Part, Supplier, StockMovement, PurchaseOrder, PurchaseOrderItem


class SupplierSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = Supplier
        fields = '__all__'


class StockMovementSerializer(TenantScopedSerializer):
    part_name = serializers.CharField(source='part.name', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = StockMovement
        fields = '__all__'


class PartSerializer(TenantScopedSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    is_low_stock = serializers.SerializerMethodField()

    class Meta(TenantScopedSerializer.Meta):
        model = Part
        fields = '__all__'

    def get_is_low_stock(self, obj) -> bool:
        return obj.stock_quantity <= obj.reorder_level


class PurchaseOrderItemSerializer(TenantScopedSerializer):
    part_name = serializers.CharField(source='part.name', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = PurchaseOrderItem
        fields = '__all__'


class PurchaseOrderSerializer(TenantScopedSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = PurchaseOrder
        fields = '__all__'
