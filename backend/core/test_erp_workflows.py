import uuid
from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from organization.models import Organization, DealerGroup, Branch, BusinessSettings
from identity.models import User
from customers.models import Customer, CustomerTimeline
from vehicles.models import Vehicle, VehicleStock
from sales.models import Lead, Quotation, Booking, TestDrive
from service.models import JobCard, ServiceCheckIn, ServiceInspection, InspectionItem, JobCardPart, JobCardLabour
from workshop.models import WorkshopBay, Technician
from inventory.models import Part, Supplier, StockMovement, PurchaseOrder
from finance.models import Invoice, Payment, FinanceApplication
from insurance.models import InsurancePolicy, InsuranceRenewal
from ai_platform.models import KnowledgeDocument, KnowledgeChunk


class ERPWorkflowLifecycleTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Organization & Hierarchy
        self.org = Organization.objects.create(name='Horizon Motors', slug='horizon-motors')
        self.group = DealerGroup.objects.create(organization=self.org, name='Horizon South')
        self.branch = Branch.objects.create(dealer_group=self.group, name='Downtown', code='DT01', city='Bangalore', state='Karnataka')
        self.settings = BusinessSettings.objects.create(organization_id=self.org.id, branch_id=self.branch.id, dealership_name='Horizon Motors Downtown')

        # Users
        self.sm_user = User.objects.create_user(
            username='sm_user', email='sm@horizon.com', password='Password@123',
            role='SERVICE_MANAGER', organization=self.org, branch=self.branch
        )
        self.sales_user = User.objects.create_user(
            username='sales_user', email='sales@horizon.com', password='Password@123',
            role='SALES_EXECUTIVE', organization=self.org, branch=self.branch
        )
        self.finance_user = User.objects.create_user(
            username='fin_user', email='fin@horizon.com', password='Password@123',
            role='FINANCE_MANAGER', organization=self.org, branch=self.branch
        )

        # Baseline Domain Entities
        self.customer = Customer.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            first_name='Rohan', last_name='Verma', phone='9876543210', email='rohan@example.com'
        )
        self.vehicle = Vehicle.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            customer=self.customer, vin='VIN12345678901234', registration_number='KA-01-AB-1234',
            make='Hyundai', model='Creta', year=2024
        )
        self.bay = WorkshopBay.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id, name='Bay 1 - Express', bay_type='EXPRESS'
        )
        self.tech = Technician.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id, name='Suresh Kumar', specialization='Brakes & Engine'
        )
        self.part = Part.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            part_number='BRK-PAD-01', name='Front Brake Pad Set', cost_price=Decimal('1200.00'),
            selling_price=Decimal('1850.00'), stock_quantity=20, reorder_level=5
        )

    def test_sales_quotation_to_booking_workflow(self):
        """Verify Lead -> Quotation (auto total calculation) -> Booking."""
        self.client.force_authenticate(user=self.sales_user)

        lead = Lead.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            customer=self.customer, interested_vehicle_model='Hyundai Creta SX(O)', status='QUALIFIED'
        )

        stock = VehicleStock.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            vin='VINNEW12345678901', make='Hyundai', model='Creta', variant='SX(O)', color='Titan Grey',
            purchase_cost=Decimal('1400000.00'), selling_price=Decimal('1650000.00'), status='AVAILABLE'
        )

        quotation = Quotation.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            quotation_number='QT-2026-001', lead=lead, customer=self.customer, vehicle_model='Hyundai Creta SX(O)',
            base_ex_showroom_price=Decimal('1650000.00'), accessories_amount=Decimal('25000.00'),
            insurance_amount=Decimal('45000.00'), registration_charges=Decimal('180000.00'),
            discount_amount=Decimal('20000.00')
        )
        # Expected on-road = 1650000 + 25000 + 45000 + 180000 - 20000 = 1880000
        self.assertEqual(quotation.total_on_road_price, Decimal('1880000.00'))

        # Booking
        booking = Booking.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            booking_number='BK-2026-001', quotation=quotation, customer=self.customer,
            allocated_stock=stock, booking_amount_paid=Decimal('50000.00'), status='ALLOCATED'
        )
        self.assertEqual(booking.status, 'ALLOCATED')
        self.assertEqual(booking.allocated_stock.vin, stock.vin)

    def test_service_job_card_state_machine_and_line_items(self):
        """Verify Check-in -> Inspection -> JobCard line items -> totals calculation -> state transitions."""
        self.client.force_authenticate(user=self.sm_user)

        # Check in
        checkin = ServiceCheckIn.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            customer=self.customer, vehicle=self.vehicle, advisor_name='Amit Verma',
            odometer_in=15200, customer_complaints='Brake squeaking noise and 15k periodic service'
        )
        self.assertEqual(checkin.odometer_in, 15200)

        # Job card creation
        job_card = JobCard.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            job_card_number='JC-2026-001', customer=self.customer, vehicle=self.vehicle,
            allocated_bay=self.bay, assigned_technician=self.tech, status='CHECKED_IN'
        )

        # Add parts line item
        jc_part = JobCardPart.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            job_card=job_card, part=self.part, quantity_requested=1, quantity_issued=1,
            unit_price=Decimal('1850.00')
        )
        self.assertEqual(jc_part.total_price, Decimal('1850.00'))

        # Add labour line item
        jc_labour = JobCardLabour.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            job_card=job_card, technician=self.tech, operation_name='Brake Pad Replacement & Bleeding',
            standard_hours=Decimal('1.50'), actual_hours=Decimal('1.50'), hourly_rate=Decimal('850.00')
        )
        self.assertEqual(jc_labour.total_labour_cost, Decimal('1275.00'))

        # Recalculate Job Card totals
        job_card.recalculate_totals()
        self.assertEqual(job_card.actual_parts_cost, Decimal('1850.00'))
        self.assertEqual(job_card.actual_labour_cost, Decimal('1275.00'))
        self.assertEqual(job_card.final_total_cost, Decimal('3125.00'))

        # Legal transition CHECKED_IN -> INSPECTION
        res = self.client.post(f'/api/v1/job-cards/{job_card.id}/transition_status/', {'status': 'INSPECTION'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Illegal transition INSPECTION -> DELIVERED (Must fail)
        bad_res = self.client.post(f'/api/v1/job-cards/{job_card.id}/transition_status/', {'status': 'DELIVERED'}, format='json')
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Illegal status transition', bad_res.data['error'])

    def test_invoice_calculation_and_payment_settlement(self):
        """Verify Invoice auto-computes 18% GST on JobCard totals and reduces balance on payment."""
        self.client.force_authenticate(user=self.finance_user)

        job_card = JobCard.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            job_card_number='JC-FIN-001', customer=self.customer, vehicle=self.vehicle,
            actual_parts_cost=Decimal('2000.00'), actual_labour_cost=Decimal('1000.00'),
            final_total_cost=Decimal('3000.00'), status='READY_FOR_DELIVERY'
        )

        invoice = Invoice.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            invoice_number='INV-2026-001', customer=self.customer, job_card=job_card,
            tax_gst_rate=Decimal('18.00'), discount_amount=Decimal('0.00')
        )

        # Trigger auto-calculation
        invoice.recalculate_from_job_card()
        # Subtotal = 3000.00, GST 18% = 540.00, Total = 3540.00
        self.assertEqual(invoice.subtotal, Decimal('3000.00'))
        self.assertEqual(invoice.tax_gst_amount, Decimal('540.00'))
        self.assertEqual(invoice.total_amount, Decimal('3540.00'))
        self.assertEqual(invoice.balance_amount, Decimal('3540.00'))
        self.assertEqual(invoice.status, 'ISSUED')

        # Record Partial Payment of 2000
        Payment.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            invoice=invoice, amount=Decimal('2000.00'), payment_method='UPI', status='SUCCESS'
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.paid_amount, Decimal('2000.00'))
        self.assertEqual(invoice.balance_amount, Decimal('1540.00'))
        self.assertEqual(invoice.status, 'PARTIALLY_PAID')

        # Settle Remaining 1540
        Payment.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            invoice=invoice, amount=Decimal('1540.00'), payment_method='CARD', status='SUCCESS'
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.paid_amount, Decimal('3540.00'))
        self.assertEqual(invoice.balance_amount, Decimal('0.00'))
        self.assertEqual(invoice.status, 'PAID')

    def test_ai_service_advisor_context_endpoint(self):
        """Verify AI Service Advisor context provider returns structured telemetry without direct SQL."""
        self.client.force_authenticate(user=self.sm_user)

        res = self.client.get(f'/api/v1/ai/service-advisor/context/?vehicle_id={self.vehicle.id}&customer_id={self.customer.id}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data
        self.assertEqual(data['customer']['phone'], '9876543210')
        self.assertEqual(data['vehicle']['vin'], 'VIN12345678901234')
        self.assertEqual(data['vehicle']['make'], 'Hyundai')

    def test_rag_knowledge_document_contracts(self):
        """Verify Knowledge Document and Knowledge Chunks model contracts for Stage 6B readiness."""
        doc = KnowledgeDocument.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            title='Hyundai Creta 2024 Periodic Maintenance Schedule', document_type='SERVICE_MANUAL',
            version=1, status='READY', total_chunks=2
        )
        chunk1 = KnowledgeChunk.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            document=doc, chunk_index=1, content_text='Brake fluid inspection required every 20,000 km or 12 months.',
            token_count=18, metadata_json={'section': 'Brake System', 'interval_km': 20000}
        )
        self.assertEqual(doc.chunks.count(), 1)
        self.assertEqual(chunk1.metadata_json['interval_km'], 20000)
