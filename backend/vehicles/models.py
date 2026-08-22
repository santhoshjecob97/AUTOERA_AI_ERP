import uuid
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer


class Vehicle(TenantScopedModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='vehicles')
    vin = models.CharField(max_length=50, unique=True, db_index=True)
    registration_number = models.CharField(max_length=50, db_index=True)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    variant = models.CharField(max_length=100, blank=True)
    year = models.IntegerField(null=True, blank=True)
    color = models.CharField(max_length=50, blank=True)
    fuel_type = models.CharField(max_length=50, choices=[('PETROL', 'Petrol'), ('DIESEL', 'Diesel'), ('EV', 'Electric'), ('HYBRID', 'Hybrid'), ('CNG', 'CNG')], default='PETROL')
    transmission_type = models.CharField(max_length=50, choices=[('MANUAL', 'Manual'), ('AUTOMATIC', 'Automatic'), ('DCT', 'Dual Clutch'), ('AMT', 'AMT'), ('EV_DIRECT', 'EV Direct Drive')], default='MANUAL')
    engine_number = models.CharField(max_length=50, blank=True)
    odometer_reading = models.IntegerField(default=0)
    warranty_start_date = models.DateField(null=True, blank=True)
    warranty_expiry_date = models.DateField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'vin']),
            models.Index(fields=['organization_id', 'registration_number']),
        ]

    def __str__(self):
        return f"{self.make} {self.model} ({self.registration_number})"


class VehicleStock(TenantScopedModel):
    """
    Dealership new/used vehicle inventory on showroom yards and transit.
    """
    STATUS_CHOICES = [
        ('IN_TRANSIT', 'In Transit from OEM'),
        ('RECEIVED', 'Received at Yard'),
        ('AVAILABLE', 'Available for Sale'),
        ('RESERVED', 'Reserved (Quotation Active)'),
        ('ALLOCATED', 'Allocated to Customer Booking'),
        ('PDI_IN_PROGRESS', 'Pre-Delivery Inspection In Progress'),
        ('PDI_PASSED', 'PDI Passed - Ready for Delivery'),
        ('DELIVERED', 'Delivered to Customer'),
        ('RETURNED', 'Returned to OEM / Transferred'),
    ]

    vin = models.CharField(max_length=50, unique=True, db_index=True)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    variant = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    fuel_type = models.CharField(max_length=50, default='PETROL')
    transmission_type = models.CharField(max_length=50, default='MANUAL')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='AVAILABLE')
    yard_location = models.CharField(max_length=100, blank=True) # e.g. Yard A, Main Showroom
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    arrival_date = models.DateField(null=True, blank=True)
    allocated_to_customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='allocated_stock')
    allocated_sales_rep = models.CharField(max_length=150, blank=True)
    pdi_notes = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'vin']),
        ]

    def __str__(self):
        return f"{self.make} {self.model} - {self.vin} ({self.get_status_display()})"
