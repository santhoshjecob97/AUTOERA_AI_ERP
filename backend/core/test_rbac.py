from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from organization.models import Organization, DealerGroup, Branch
from identity.models import User
from customers.models import Customer
from service.models import JobCard
from vehicles.models import Vehicle
from finance.models import Invoice


class RBACSecurityTest(TestCase):
    """
    P0 SECURITY TEST SUITE: Role-Based Access Control (RBAC)
    Verifies server-side authorization enforcement per role.
    """

    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name='Prime Motors', slug='prime-motors')
        self.group = DealerGroup.objects.create(organization=self.org, name='Prime Group')
        self.branch = Branch.objects.create(dealer_group=self.group, name='Prime North', code='PRM01', city='Mumbai', state='MH')

        # 1. Super Admin
        self.super_admin = User.objects.create_user(
            username='superadmin', password='Password123!', role='SUPER_ADMIN'
        )

        # 2. General Manager
        self.gm = User.objects.create_user(
            username='gm_user', password='Password123!', role='GENERAL_MANAGER',
            organization=self.org, branch=self.branch
        )

        # 3. Sales Executive
        self.sales_rep = User.objects.create_user(
            username='sales_rep', password='Password123!', role='SALES_EXECUTIVE',
            organization=self.org, branch=self.branch
        )

        # 4. Technician
        self.technician = User.objects.create_user(
            username='tech_user', password='Password123!', role='TECHNICIAN',
            organization=self.org, branch=self.branch
        )

        # Seed test records
        self.customer = Customer.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            first_name='Anil', last_name='Kumar', phone='9123456789'
        )
        self.vehicle = Vehicle.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            customer=self.customer,
            vin='MALAA51CA7M999999', registration_number='MH01AB9999', make='Tata', model='Nexon'
        )
        self.job_card = JobCard.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            job_card_number='JC-PRM-001', customer=self.customer, vehicle=self.vehicle
        )
        self.invoice = Invoice.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            invoice_number='INV-PRM-001', customer=self.customer, total_amount=8000.00
        )

    def test_unauthenticated_request_is_rejected(self):
        """Unauthenticated requests must receive 401 Unauthorized."""
        response = self.client.get('/api/v1/customers/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_technician_cannot_access_finance_invoices(self):
        """Technician role must be forbidden from accessing invoice/billing endpoints."""
        self.client.force_authenticate(user=self.technician)
        response = self.client.get('/api/v1/invoices/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_technician_can_access_service_job_cards(self):
        """Technician role can access workshop and service job cards."""
        self.client.force_authenticate(user=self.technician)
        response = self.client.get('/api/v1/job-cards/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sales_rep_can_access_leads_and_customers(self):
        """Sales Executive role can access customers and sales leads."""
        self.client.force_authenticate(user=self.sales_rep)
        response = self.client.get('/api/v1/customers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sales_rep_cannot_access_finance_invoices(self):
        """Sales Executive cannot access financial invoices."""
        self.client.force_authenticate(user=self.sales_rep)
        response = self.client.get('/api/v1/invoices/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_general_manager_has_broad_access(self):
        """General Manager has access across Sales, Service, and Finance domains."""
        self.client.force_authenticate(user=self.gm)
        resp_cust = self.client.get('/api/v1/customers/')
        resp_serv = self.client.get('/api/v1/job-cards/')
        resp_fin = self.client.get('/api/v1/invoices/')
        self.assertEqual(resp_cust.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_serv.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_fin.status_code, status.HTTP_200_OK)
