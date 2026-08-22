import uuid
from django.db import models
from core.models import TenantScopedModel


class Supplier(TenantScopedModel):
    """Automotive parts OEM / aftermarket vendor."""
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    gstin = models.CharField(max_length=30, blank=True)
    payment_terms = models.CharField(max_length=50, default='NET_30') # NET_15, NET_30, IMMEDIATE
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Part(TenantScopedModel):
    part_number = models.CharField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True) # BRAKES, FILTERS, FLUIDS, ELECTRICAL
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='parts')
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stock_quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=5)
    bin_location = models.CharField(max_length=50, blank=True) # e.g. Shelf A-3, Bin 12

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'category']),
            models.Index(fields=['organization_id', 'part_number']),
        ]

    def __str__(self):
        return f"{self.part_number} - {self.name} (Stock: {self.stock_quantity})"


class StockMovement(TenantScopedModel):
    """Audit ledger for all inventory movements."""
    MOVEMENT_TYPES = [
        ('RECEIPT', 'Goods Receipt from PO'),
        ('ISSUE_TO_JOBCARD', 'Issued to Job Card'),
        ('RETURN_FROM_JOBCARD', 'Returned from Job Card'),
        ('ADJUSTMENT', 'Physical Audit Adjustment'),
        ('SCRAPPED', 'Damaged / Scrapped'),
    ]

    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=50, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField(default=0) # Positive for inward, negative for outward
    reference_number = models.CharField(max_length=100, blank=True) # e.g. JC-001 or PO-001
    notes = models.CharField(max_length=255, blank=True)
    performed_by = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"[{self.movement_type}] {self.part.name} ({self.quantity}) on {self.created_at}"


class PurchaseOrder(TenantScopedModel):
    """Procurement purchase order to part suppliers."""
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted to Supplier'),
        ('APPROVED', 'Manager Approved'),
        ('RECEIVED', 'Goods Received'),
        ('CANCELLED', 'Cancelled'),
    ]

    po_number = models.CharField(max_length=50, unique=True, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders')
    order_date = models.DateField(auto_now_add=True)
    expected_delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='DRAFT')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"PO #{self.po_number} - {self.supplier.name} ({self.status})"


class PurchaseOrderItem(TenantScopedModel):
    """Line item in a Purchase Order."""
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    part = models.ForeignKey(Part, on_delete=models.PROTECT, related_name='po_items')
    quantity_ordered = models.IntegerField(default=1)
    quantity_received = models.IntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        self.total_cost = self.quantity_ordered * self.unit_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.part.name} x {self.quantity_ordered} in PO #{self.purchase_order.po_number}"
