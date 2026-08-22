from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from organization.models import Organization, DealerGroup, Branch
from identity.models import User
from customers.models import Customer
from vehicles.models import Vehicle
from sales.models import Lead, Appointment
from service.models import JobCard
from finance.models import Invoice, Payment


class APICRUDIntegrationTest(TestCase):
    """
    P1 INTEGRATION TEST SUITE: Full API CRUD lifecycle across all core ERP modules.
    """

    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name='Horizon Auto Corp', slug='horizon-auto')
        self.group = DealerGroup.objects.create(organization=self.org, name='Horizon Group')
        self.branch = Branch.objects.create(dealer_group=self.group, name='Horizon Main', code='HRZ01', city='Delhi', state='DL')

        self.user = User.objects.create_user(
            username='gm_horizon',
            email='gm@horizon.com',
            password='SecurePassword123!',
            role='GENERAL_MANAGER',
            organization=self.org,
            branch=self.branch
        )

    def test_jwt_login_success(self):
        """POST /api/v1/auth/login/ returns access/refresh JWT tokens and user metadata."""
        response = self.client.post('/api/v1/auth/login/', {
            'username': 'gm_horizon',
            'password': 'SecurePassword123!'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'gm_horizon')

    def test_customer_crud_lifecycle(self):
        """Full CRUD cycle on /api/v1/customers/."""
        self.client.force_authenticate(user=self.user)

        # 1. CREATE
        create_resp = self.client.post('/api/v1/customers/', {
            'first_name': 'Kavita',
            'last_name': 'Menon',
            'phone': '9876500000',
            'email': 'kavita@example.com',
            'city': 'Delhi'
        }, format='json')
        self.assertEqual(create_resp.status_code, status.HTTP_201_CREATED)
        cust_id = create_resp.data['id']

        # 2. READ
        get_resp = self.client.get(f'/api/v1/customers/{cust_id}/')
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(get_resp.data['first_name'], 'Kavita')

        # 3. UPDATE
        patch_resp = self.client.patch(f'/api/v1/customers/{cust_id}/', {
            'phone': '9876599999'
        }, format='json')
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data['phone'], '9876599999')

        # 4. DELETE
        del_resp = self.client.delete(f'/api/v1/customers/{cust_id}/')
        self.assertEqual(del_resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_job_card_lifecycle(self):
        """JobCard creation with customer and vehicle associations."""
        self.client.force_authenticate(user=self.user)

        customer = Customer.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            first_name='Amit', last_name='Patil', phone='9811223344'
        )
        vehicle = Vehicle.objects.create(
            organization_id=self.org.id, branch_id=self.branch.id,
            customer=customer,
            vin='MALAA51CA7M555555', registration_number='DL01XY5555', make='Mahindra', model='XUV700'
        )

        create_resp = self.client.post('/api/v1/job-cards/', {
            'job_card_number': 'JC-HRZ-555',
            'customer': str(customer.id),
            'vehicle': str(vehicle.id),
            'status': 'CHECKED_IN',
            'estimated_cost': '12500.00'
        }, format='json')

        self.assertEqual(create_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_resp.data['job_card_number'], 'JC-HRZ-555')
