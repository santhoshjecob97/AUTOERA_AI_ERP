"""
Area 13 — Used-Car Operating Engine Models.

Implements the complete used-car dealership lifecycle:
Appraisal → 120-Point Inspection → AI Valuation → Acquisition/Trade-In →
Refurbishment Costing → Certification → Pre-Owned Inventory → Resale Margin Tracking.

This module represents 20-30% of dealership revenue and is a P0 operational blocker
when missing from a dealership OS.
"""
import random
from decimal import Decimal
from django.db import models
from django.utils import timezone
from core.models import TenantScopedModel


class UsedCarAppraisal(TenantScopedModel):
    """
    120-Point Digital Inspection & Appraisal Worksheet.
    Captures the complete physical and documentary assessment of a vehicle
    presented for trade-in or direct purchase by the dealership.
    """
    SOURCE_CHOICES = [
        ('TRADE_IN', 'Customer Trade-In (Exchange)'),
        ('DIRECT_PURCHASE', 'Direct Purchase from Owner'),
        ('AUCTION', 'Auto Auction Acquisition'),
        ('CORPORATE_LEASE_RETURN', 'Corporate Lease Return'),
        ('REPOSSESSION', 'Finance Company Repossession'),
        ('DEALER_TRANSFER', 'Inter-Dealer Transfer'),
    ]

    BODY_CONDITION_CHOICES = [
        ('EXCELLENT', 'Excellent — No visible damage or wear'),
        ('GOOD', 'Good — Minor cosmetic imperfections'),
        ('FAIR', 'Fair — Visible wear, minor dents/scratches'),
        ('POOR', 'Poor — Significant body damage requiring repair'),
    ]

    ENGINE_CONDITION_CHOICES = [
        ('EXCELLENT', 'Excellent — Runs perfectly, no issues'),
        ('GOOD', 'Good — Minor issues, serviceable'),
        ('FAIR', 'Fair — Needs attention, functional'),
        ('POOR', 'Poor — Major mechanical issues'),
    ]

    STATUS_CHOICES = [
        ('PENDING_INSPECTION', 'Pending Physical Inspection'),
        ('INSPECTION_COMPLETE', 'Inspection Completed'),
        ('VALUATION_PENDING', 'Awaiting Valuation'),
        ('OFFER_MADE', 'Purchase Offer Made to Customer'),
        ('CUSTOMER_ACCEPTED', 'Customer Accepted Offer'),
        ('CUSTOMER_REJECTED', 'Customer Rejected Offer'),
        ('ACQUIRED', 'Vehicle Acquired into Inventory'),
        ('CANCELLED', 'Appraisal Cancelled'),
    ]

    # Appraisal Identification
    appraisal_number = models.CharField(max_length=50, unique=True, db_index=True)
    appraisal_date = models.DateTimeField(default=timezone.now)
    appraiser_name = models.CharField(max_length=150)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_INSPECTION')

    # Vehicle Identification
    registration_number = models.CharField(max_length=20, db_index=True)
    chassis_number = models.CharField(max_length=50, blank=True)
    engine_number = models.CharField(max_length=50, blank=True)
    make = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    variant = models.CharField(max_length=100, blank=True)
    manufacturing_year = models.PositiveIntegerField()
    registration_date = models.DateField(null=True, blank=True)
    color = models.CharField(max_length=50, blank=True)
    fuel_type = models.CharField(max_length=30, default='PETROL')
    transmission = models.CharField(max_length=20, default='MANUAL')
    odometer_km = models.PositiveIntegerField(default=0)
    number_of_owners = models.PositiveIntegerField(default=1)

    # Acquisition Source
    source = models.CharField(max_length=30, choices=SOURCE_CHOICES, default='TRADE_IN')
    customer_name = models.CharField(max_length=200, blank=True)
    customer_phone = models.CharField(max_length=20, blank=True)
    customer_email = models.EmailField(blank=True)
    linked_new_car_booking = models.UUIDField(null=True, blank=True, help_text="Link to new car booking for exchange deals")

    # Document Verification
    rc_verified = models.BooleanField(default=False)
    insurance_valid = models.BooleanField(default=False)
    insurance_expiry = models.DateField(null=True, blank=True)
    hypothecation_clear = models.BooleanField(default=False)
    hypothecation_bank = models.CharField(max_length=100, blank=True)
    noc_available = models.BooleanField(default=False)
    pollution_certificate_valid = models.BooleanField(default=False)
    road_tax_paid = models.BooleanField(default=False)
    challan_pending = models.BooleanField(default=False)
    challan_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    # 120-Point Inspection Scores (0-10 scale per category)
    exterior_score = models.DecimalField(max_digits=4, decimal_places=1, default=Decimal('0.0'),
                                         help_text="Exterior body, paint, glass, lights (0-10)")
    interior_score = models.DecimalField(max_digits=4, decimal_places=1, default=Decimal('0.0'),
                                         help_text="Seats, dashboard, trim, AC, electronics (0-10)")
    engine_score = models.DecimalField(max_digits=4, decimal_places=1, default=Decimal('0.0'),
                                       help_text="Engine, transmission, exhaust, fluids (0-10)")
    suspension_score = models.DecimalField(max_digits=4, decimal_places=1, default=Decimal('0.0'),
                                           help_text="Suspension, steering, brakes, tyres (0-10)")
    electrical_score = models.DecimalField(max_digits=4, decimal_places=1, default=Decimal('0.0'),
                                           help_text="Battery, wiring, sensors, infotainment (0-10)")
    underbody_score = models.DecimalField(max_digits=4, decimal_places=1, default=Decimal('0.0'),
                                          help_text="Underbody rust, frame integrity (0-10)")

    body_condition = models.CharField(max_length=20, choices=BODY_CONDITION_CHOICES, default='GOOD')
    engine_condition = models.CharField(max_length=20, choices=ENGINE_CONDITION_CHOICES, default='GOOD')

    # Inspection Notes & Photos
    inspection_notes = models.TextField(blank=True, help_text="Detailed appraiser notes from 120-point inspection")
    damage_report = models.TextField(blank=True, help_text="Itemized damage findings")
    accident_history = models.BooleanField(default=False)
    flood_damage = models.BooleanField(default=False)
    repainted_panels = models.PositiveIntegerField(default=0, help_text="Number of repainted panels")

    # Photo Audit (6-angle minimum)
    photo_front = models.URLField(blank=True)
    photo_rear = models.URLField(blank=True)
    photo_left = models.URLField(blank=True)
    photo_right = models.URLField(blank=True)
    photo_interior = models.URLField(blank=True)
    photo_engine_bay = models.URLField(blank=True)
    photo_odometer = models.URLField(blank=True)
    photo_rc_book = models.URLField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'source']),
            models.Index(fields=['organization_id', 'appraisal_date']),
            models.Index(fields=['organization_id', 'make', 'model_name']),
        ]
        ordering = ['-appraisal_date']

    @property
    def overall_inspection_score(self):
        """Calculate weighted overall score from 120-point categories (max 60)."""
        return (
            self.exterior_score +
            self.interior_score +
            self.engine_score +
            self.suspension_score +
            self.electrical_score +
            self.underbody_score
        )

    @property
    def inspection_grade(self):
        """Map overall score to a letter grade for quick assessment."""
        score = float(self.overall_inspection_score)
        if score >= 54:
            return 'A+'
        elif score >= 48:
            return 'A'
        elif score >= 42:
            return 'B+'
        elif score >= 36:
            return 'B'
        elif score >= 30:
            return 'C'
        else:
            return 'D'

    @property
    def vehicle_age_years(self):
        """Calculate vehicle age from manufacturing year."""
        return timezone.now().year - self.manufacturing_year

    def save(self, *args, **kwargs):
        if not self.appraisal_number:
            self.appraisal_number = f"APR-{timezone.now().strftime('%Y%m')}-{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.appraisal_number} — {self.make} {self.model_name} ({self.manufacturing_year}) [{self.status}]"


class UsedCarValuation(TenantScopedModel):
    """
    AI-Powered Market Valuation Engine.
    Computes fair market value using depreciation algorithms, market comparables,
    refurbishment estimates, and recommended dealer acquisition price.
    """
    VALUATION_METHOD_CHOICES = [
        ('MARKET_COMPARABLE', 'Market Comparable Analysis'),
        ('DEPRECIATION_CURVE', 'Depreciation Curve Model'),
        ('AI_PREDICTIVE', 'AI Predictive Valuation'),
        ('MANUAL_EXPERT', 'Manual Expert Assessment'),
    ]

    RECOMMENDATION_CHOICES = [
        ('STRONG_BUY', 'Strong Buy — High margin potential'),
        ('BUY', 'Buy — Fair margin at recommended price'),
        ('HOLD', 'Hold — Marginal, negotiate lower'),
        ('PASS', 'Pass — Poor economics or high risk'),
    ]

    appraisal = models.OneToOneField(UsedCarAppraisal, on_delete=models.CASCADE, related_name='valuation')
    valuation_date = models.DateTimeField(default=timezone.now)
    valuation_method = models.CharField(max_length=30, choices=VALUATION_METHOD_CHOICES, default='MARKET_COMPARABLE')
    valuator_name = models.CharField(max_length=150, blank=True)

    # Market Data Inputs
    ex_showroom_price_when_new = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                                      help_text="Original ex-showroom price when new")
    current_market_low = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                              help_text="Current market range — low end")
    current_market_high = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                               help_text="Current market range — high end")
    current_market_median = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Depreciation Calculation
    depreciation_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'),
                                                   help_text="Total depreciation from new price (%)")
    depreciation_annual_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'),
                                                    help_text="Annualized depreciation rate (%)")
    condition_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'),
                                                help_text="+ or - adjustment based on inspection score")
    mileage_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'),
                                              help_text="+ or - adjustment for odometer vs segment avg")

    # Refurbishment Estimate
    estimated_body_repair_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    estimated_mechanical_repair_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    estimated_interior_refurb_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    estimated_tyre_replacement_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    estimated_detailing_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_refurbishment_estimate = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Computed Values
    fair_market_value = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                             help_text="Calculated FMV after adjustments")
    recommended_acquisition_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                                          help_text="Max price dealer should pay (FMV - refurb - target margin)")
    recommended_selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                                      help_text="Recommended retail price for resale")
    projected_gross_margin = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    projected_margin_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))

    # AI Confidence & Recommendation
    ai_confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'),
                                               help_text="AI model confidence 0-100%")
    recommendation = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES, default='BUY')
    recommendation_notes = models.TextField(blank=True)
    comparable_vehicles_analyzed = models.PositiveIntegerField(default=0,
                                                                help_text="Number of market comparables used")

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'valuation_date']),
            models.Index(fields=['organization_id', 'recommendation']),
        ]
        ordering = ['-valuation_date']

    @property
    def total_all_in_cost(self):
        """Total dealer cost = acquisition + refurbishment."""
        return self.recommended_acquisition_price + self.total_refurbishment_estimate

    def save(self, *args, **kwargs):
        # Auto-compute totals
        self.total_refurbishment_estimate = (
            self.estimated_body_repair_cost +
            self.estimated_mechanical_repair_cost +
            self.estimated_interior_refurb_cost +
            self.estimated_tyre_replacement_cost +
            self.estimated_detailing_cost
        )
        if self.recommended_selling_price and self.recommended_acquisition_price:
            self.projected_gross_margin = (
                self.recommended_selling_price -
                self.recommended_acquisition_price -
                self.total_refurbishment_estimate
            )
            if self.recommended_selling_price > 0:
                self.projected_margin_percentage = (
                    self.projected_gross_margin / self.recommended_selling_price * 100
                )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Valuation for {self.appraisal.appraisal_number} — FMV: ₹{self.fair_market_value:,.0f}"


class UsedCarInventory(TenantScopedModel):
    """
    Pre-Owned Vehicle Inventory Management.
    Tracks acquired used vehicles through reconditioning, certification,
    listing, sale, and realized margin analysis.
    """
    INVENTORY_STATUS_CHOICES = [
        ('ACQUIRED', 'Acquired — Awaiting Inspection'),
        ('IN_RECONDITIONING', 'In Reconditioning Workshop'),
        ('RECONDITIONING_COMPLETE', 'Reconditioning Complete'),
        ('PENDING_CERTIFICATION', 'Pending Quality Certification'),
        ('CERTIFIED', 'Certified Pre-Owned (CPO)'),
        ('LISTED_FOR_SALE', 'Listed for Sale'),
        ('RESERVED', 'Reserved — Customer Hold'),
        ('SOLD', 'Sold'),
        ('TRANSFERRED', 'Transferred to Another Branch'),
        ('AUCTION_EXIT', 'Sent to Auction (Aged Stock)'),
    ]

    CERTIFICATION_CHOICES = [
        ('CPO_GOLD', 'Certified Pre-Owned — Gold (150+ Point)'),
        ('CPO_SILVER', 'Certified Pre-Owned — Silver (120 Point)'),
        ('AS_IS', 'Sold As-Is (No Certification)'),
        ('DEALER_WARRANTY', 'Dealer Warranty Only'),
    ]

    AGEING_TIER_CHOICES = [
        ('FRESH', 'Fresh Stock (< 30 days)'),
        ('AGING', 'Aging Stock (31-60 days)'),
        ('SLOW', 'Slow Mover (61-90 days)'),
        ('DEAD', 'Dead Stock (> 90 days)'),
    ]

    # Inventory Identification
    stock_number = models.CharField(max_length=50, unique=True, db_index=True)
    appraisal = models.OneToOneField(UsedCarAppraisal, on_delete=models.CASCADE, related_name='inventory')
    status = models.CharField(max_length=30, choices=INVENTORY_STATUS_CHOICES, default='ACQUIRED')
    acquired_date = models.DateTimeField(default=timezone.now)

    # Vehicle Info (denormalized from appraisal for fast listing queries)
    make = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    variant = models.CharField(max_length=100, blank=True)
    manufacturing_year = models.PositiveIntegerField()
    registration_number = models.CharField(max_length=20, db_index=True)
    fuel_type = models.CharField(max_length=30, default='PETROL')
    transmission = models.CharField(max_length=20, default='MANUAL')
    color = models.CharField(max_length=50, blank=True)
    odometer_km = models.PositiveIntegerField(default=0)

    # Cost Ledger
    acquisition_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                            help_text="Price paid to acquire the vehicle")
    reconditioning_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                               help_text="Actual reconditioning spent")
    documentation_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'),
                                              help_text="RC transfer, insurance, legal fees")
    total_investment = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                            help_text="Total dealer investment = acquisition + recon + docs")
    daily_holding_cost = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('150.00'),
                                              help_text="Daily floor cost (parking, insurance, depreciation)")

    # Reconditioning Details
    reconditioning_started = models.DateTimeField(null=True, blank=True)
    reconditioning_completed = models.DateTimeField(null=True, blank=True)
    reconditioning_notes = models.TextField(blank=True)

    # Certification & Quality
    certification_type = models.CharField(max_length=30, choices=CERTIFICATION_CHOICES, default='CPO_SILVER')
    certification_date = models.DateTimeField(null=True, blank=True)
    warranty_months = models.PositiveIntegerField(default=6, help_text="Dealer warranty coverage in months")
    certified_by = models.CharField(max_length=150, blank=True)

    # Pricing & Listing
    asking_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    minimum_acceptable_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    price_drops = models.PositiveIntegerField(default=0, help_text="Number of price reductions applied")
    last_price_drop_date = models.DateTimeField(null=True, blank=True)

    # Sale Tracking
    sold_date = models.DateTimeField(null=True, blank=True)
    sold_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    buyer_name = models.CharField(max_length=200, blank=True)
    buyer_phone = models.CharField(max_length=20, blank=True)
    sale_type = models.CharField(max_length=30, blank=True, help_text="Retail, Wholesale, Auction")

    # Margin Analysis
    realized_gross_margin = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    realized_margin_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Ageing
    ageing_tier = models.CharField(max_length=20, choices=AGEING_TIER_CHOICES, default='FRESH')

    # Listing & Marketing
    listing_headline = models.CharField(max_length=255, blank=True)
    listing_description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    enquiries_count = models.PositiveIntegerField(default=0)
    test_drives_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Used Car Inventory'
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'ageing_tier']),
            models.Index(fields=['organization_id', 'make', 'model_name']),
            models.Index(fields=['organization_id', 'acquired_date']),
            models.Index(fields=['organization_id', 'certification_type']),
        ]
        ordering = ['-acquired_date']

    @property
    def days_in_stock(self):
        """Calculate number of days the vehicle has been in inventory."""
        if self.sold_date:
            return (self.sold_date - self.acquired_date).days
        return (timezone.now() - self.acquired_date).days

    @property
    def accumulated_holding_cost(self):
        """Calculate total floor cost based on days in stock."""
        return self.daily_holding_cost * self.days_in_stock

    @property
    def total_cost_with_holding(self):
        """Total dealer cost including holding/floor costs."""
        return self.total_investment + self.accumulated_holding_cost

    def update_ageing_tier(self):
        """Recalculate ageing tier based on days in stock."""
        days = self.days_in_stock
        if days <= 30:
            self.ageing_tier = 'FRESH'
        elif days <= 60:
            self.ageing_tier = 'AGING'
        elif days <= 90:
            self.ageing_tier = 'SLOW'
        else:
            self.ageing_tier = 'DEAD'

    def save(self, *args, **kwargs):
        if not self.stock_number:
            self.stock_number = f"UC-{timezone.now().strftime('%Y%m')}-{random.randint(10000, 99999)}"
        # Auto-compute total investment
        self.total_investment = (
            self.acquisition_cost +
            self.reconditioning_cost +
            self.documentation_cost
        )
        # Auto-compute realized margin on sale
        if self.sold_price and self.status == 'SOLD':
            self.realized_gross_margin = self.sold_price - self.total_cost_with_holding
            if self.sold_price > 0:
                self.realized_margin_percentage = (
                    self.realized_gross_margin / self.sold_price * 100
                )
        # Auto-update ageing tier
        self.update_ageing_tier()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.stock_number} — {self.make} {self.model_name} ({self.manufacturing_year}) [{self.status}]"
