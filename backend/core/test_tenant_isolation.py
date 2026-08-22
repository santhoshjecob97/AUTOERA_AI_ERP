import uuid
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from organization.models import Organization, DealerGroup, Branch
from identity.models import User
from customers.models import Customer
from vehicles.models import Vehicle
from sales.models import Lead
from service.models import JobCard
from finance.models import Invoice


class TenantIsolationSecurityTest(TestCase):
    """
    P0 SECURITY TEST SUITE: Multi-Tenant Isolation
    Verifies that no cross-tenant data leakage or header spoofing is possible.
    """

    def setUp(self):
        self.client = APIClient()

        # Create Tenant Alpha
        self.org_alpha = Organization.objects.create(name='Dealership Alpha', slug='dealer-alpha')
        self.group_alpha = DealerGroup.objects.create(organization=self.org_alpha, name='Alpha Group')
        self.branch_alpha = Branch.objects.create(dealer_group=self.group_alpha, name='Alpha Central', code='ALP01', city='Chennai', state='TN')
        self.user_alpha = User.objects.create_user(
            username='gm_alpha',
            email='gm@alpha.com',
            password='Password123!',
            role='GENERAL_MANAGER',
            organization=self.org_alpha,
            branch=self.branch_alpha
        )

        # Create Tenant Beta
        self.org_beta = Organization.objects.create(name='Dealership Beta', slug='dealer-beta')
        self.group_beta = DealerGroup.objects.create(organization=self.org_beta, name='Beta Group')
        self.branch_beta = Branch.objects.create(dealer_group=self.group_beta, name='Beta South', code='BET01', city='Bangalore', state='KA')
        self.user_beta = User.objects.create_user(
            username='gm_beta',
            email='gm@beta.com',
            password='Password123!',
            role='GENERAL_MANAGER',
            organization=self.org_beta,
            branch=self.branch_beta
        )

        # Seed records for Tenant Alpha
        self.customer_alpha = Customer.objects.create(
            organization_id=self.org_alpha.id,
            branch_id=self.branch_alpha.id,
            first_name='Rohan',
            last_name='Sharma',
            phone='9876543210',
            email='rohan@alpha-customer.com'
        )

        self.vehicle_alpha = Vehicle.objects.create(
            organization_id=self.org_alpha.id,
            branch_id=self.branch_alpha.id,
            customer=self.customer_alpha,
            vin='MALAA51CA7M000001',
            registration_number='TN09AB1234',
            make='Hyundai',
            model='Creta'
        )

        self.job_card_alpha = JobCard.objects.create(
            organization_id=self.org_alpha.id,
            branch_id=self.branch_alpha.id,
            job_card_number='JC-ALP-001',
            customer=self.customer_alpha,
            vehicle=self.vehicle_alpha,
            status='IN_PROGRESS'
        )

        self.invoice_alpha = Invoice.objects.create(
            organization_id=self.org_alpha.id,
            branch_id=self.branch_alpha.id,
            invoice_number='INV-ALP-001',
            customer=self.customer_alpha,
            job_card=self.job_card_alpha,
            total_amount=15000.00
        )

    def test_tenant_alpha_can_see_own_records(self):
        """User Alpha querying customers should receive their own record."""
        self.client.force_authenticate(user=self.user_alpha)
        response = self.client.get('/api/v1/customers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['first_name'], 'Rohan')

    def test_tenant_beta_cannot_see_tenant_alpha_records(self):
        """User Beta querying customers should receive 0 records (no cross-tenant leakage)."""
        self.client.force_authenticate(user=self.user_beta)
        response = self.client.get('/api/v1/customers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 0)

    def test_malicious_header_spoofing_is_blocked(self):
        """
        ATTACK SCENARIO: User Beta sends X-Organization-ID header claiming to be Org Alpha.
        The system MUST reject header override and return 0 records.
        """
        self.client.force_authenticate(user=self.user_beta)
        response = self.client.get(
            '/api/v1/customers/',
            HTTP_X_ORGANIZATION_ID=str(self.org_alpha.id),
            HTTP_X_BRANCH_ID=str(self.branch_alpha.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 0, "Security Failure: Client header spoofed tenant context!")

    def test_direct_object_idor_access_returns_404(self):
        """
        ATTACK SCENARIO: User Beta attempts direct GET/PATCH on Alpha's customer ID.
        System MUST return 404 Not Found.
        """
        self.client.force_authenticate(user=self.user_beta)
        # Direct GET
        get_resp = self.client.get(f'/api/v1/customers/{self.customer_alpha.id}/')
        self.assertEqual(get_resp.status_code, status.HTTP_404_NOT_FOUND)

        # Direct PATCH
        patch_resp = self.client.patch(
            f'/api/v1/customers/{self.customer_alpha.id}/',
            {'first_name': 'Hacked'},
            format='json'
        )
        self.assertEqual(patch_resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_perform_create_auto_injects_authenticated_tenant(self):
        """
        Creating a record as User Beta automatically assigns org_beta id,
        even if request payload attempts to pass org_alpha id.
        """
        self.client.force_authenticate(user=self.user_beta)
        response = self.client.post('/api/v1/customers/', {
            'first_name': 'Vikram',
            'last_name': 'Patel',
            'phone': '9988776655',
            'email': 'vikram@beta.com',
            'organization_id': str(self.org_alpha.id) # Malicious injection attempt
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_customer = Customer.objects.get(email='vikram@beta.com')
        # Verify it was saved under Beta, NOT Alpha
        self.assertEqual(created_customer.organization_id, self.org_beta.id)
