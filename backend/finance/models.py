import uuid
from decimal import Decimal
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer
from service.models import JobCard


class Invoice(TenantScopedModel):
    INVOICE_TYPES = [
        ('SERVICE', 'Workshop Service & Repairs'),
        ('VEHICLE_SALE', 'New / Used Vehicle Sale'),
        ('COUNTER_SALE', 'Over-The-Counter Parts Sale'),
    ]

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('ISSUED', 'Issued / Pending Payment'),
        ('PARTIALLY_PAID', 'Partially Paid'),
        ('PAID', 'Fully Paid'),
        ('CANCELLED', 'Cancelled'),
    ]

    invoice_number = models.CharField(max_length=50, default='', blank=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='invoices')
    job_card = models.ForeignKey(JobCard, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    invoice_type = models.CharField(max_length=50, choices=INVOICE_TYPES, default='SERVICE')
    parts_subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    labour_subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax_gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('18.00'))
    tax_gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    balance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='ISSUED')
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'invoice_number']),
        ]

    def recalculate_from_job_card(self):
        """Auto-computes parts, labour, GST tax, and total from associated Job Card."""
        if self.job_card:
            self.parts_subtotal = Decimal(str(self.job_card.actual_parts_cost or 0))
            self.labour_subtotal = Decimal(str(self.job_card.actual_labour_cost or 0))
            discount = Decimal(str(self.discount_amount or 0))
            self.subtotal = self.parts_subtotal + self.labour_subtotal - discount
            tax_rate = Decimal(str(self.tax_gst_rate or 18.00))
            self.tax_gst_amount = (self.subtotal * (tax_rate / Decimal('100'))).quantize(Decimal('0.01'))
            self.tax_amount = self.tax_gst_amount
            self.total_amount = self.subtotal + self.tax_gst_amount
            paid = Decimal(str(self.paid_amount or 0))
            self.balance_amount = max(self.total_amount - paid, Decimal('0.00'))
            if paid >= self.total_amount and self.total_amount > Decimal('0.00'):
                self.status = 'PAID'
            elif paid > Decimal('0.00'):
                self.status = 'PARTIALLY_PAID'
            self.save()

    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.customer.first_name} (₹{self.total_amount})"


class Payment(TenantScopedModel):
    PAYMENT_METHODS = [
        ('CASH', 'Cash'),
        ('UPI', 'UPI / QR Code'),
        ('CARD', 'Credit / Debit Card'),
        ('BANK_TRANSFER', 'NEFT / RTGS / IMPS'),
        ('RAZORPAY', 'Online via Razorpay'),
        ('CHEQUE', 'Bank Cheque'),
    ]

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHODS, default='UPI')
    transaction_reference = models.CharField(max_length=150, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[('SUCCESS', 'Success'), ('REFUNDED', 'Refunded'), ('FAILED', 'Failed')], default='SUCCESS')
    notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.status == 'SUCCESS':
            total_paid = sum(Decimal(str(p.amount)) for p in self.invoice.payments.filter(status='SUCCESS'))
            self.invoice.paid_amount = total_paid
            total_amt = Decimal(str(self.invoice.total_amount or 0))
            self.invoice.balance_amount = max(total_amt - total_paid, Decimal('0.00'))
            if self.invoice.balance_amount == Decimal('0.00') and total_amt > Decimal('0.00'):
                self.invoice.status = 'PAID'
            elif total_paid > Decimal('0.00'):
                self.invoice.status = 'PARTIALLY_PAID'
            self.invoice.save(update_fields=['paid_amount', 'balance_amount', 'status'])

    def __str__(self):
        return f"Payment #{self.id} - ₹{self.amount} for Invoice #{self.invoice.invoice_number}"


class FinanceApplication(TenantScopedModel):
    """Customer auto-loan finance application tracking."""
    STATUS_CHOICES = [
        ('DRAFT', 'Draft Application'),
        ('SUBMITTED', 'Submitted to Bank'),
        ('DOCUMENTS_PENDING', 'Documents Pending'),
        ('UNDER_REVIEW', 'Under Credit Review'),
        ('APPROVED', 'Loan Sanctioned / Approved'),
        ('REJECTED', 'Application Rejected'),
        ('DISBURSED', 'Loan Disbursed'),
        ('CANCELLED', 'Cancelled by Customer'),
    ]

    application_number = models.CharField(max_length=50, default='', blank=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='finance_applications')
    vehicle_model = models.CharField(max_length=150, default='Sedan')
    loan_amount_requested = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    down_payment_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    loan_tenure_months = models.IntegerField(default=60) # 36, 48, 60, 84 months
    bank_partner = models.CharField(max_length=100, default='HDFC Bank') # e.g. HDFC Bank, ICICI Bank, SBI
    interest_rate_pct = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('8.75'))
    monthly_emi_estimated = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='SUBMITTED')
    disbursed_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    disbursement_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Finance #{self.application_number} - {self.customer.first_name} ({self.bank_partner})"
