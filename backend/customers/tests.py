from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from organization.models import Organization, DealerGroup, Branch
from identity.models import User
from customers.models import Customer, CustomerComplaint


class CustomerComplaintTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Apex KUN Auto", slug="apex-kun-auto")
        self.group = DealerGroup.objects.create(organization=self.org, name="Capital Group")
        self.branch = Branch.objects.create(dealer_group=self.group, name="Meenambakkam 3S", code="CHN-01")

        self.service_mgr = User.objects.create_user(
            username="service_manager",
            password="StrongPassword123!",
            role="SERVICE_MANAGER",
            organization=self.org,
            branch=self.branch
        )

        self.customer = Customer.objects.create(
            organization_id=self.org.id,
            branch_id=self.branch.id,
            first_name="Priya",
            last_name="Ramachandran",
            phone="+919841987654",
            email="priya@example.com"
        )

    def test_complaint_lifecycle(self):
        self.client.force_authenticate(user=self.service_mgr)

        # 1. Log Grievance
        res1 = self.client.post('/api/v1/customer-complaints/', {
            'complaint_number': 'CMP-2026-9901',
            'customer': self.customer.id,
            'department': 'SERVICE',
            'severity': 'P1_CRITICAL',
            'subject': 'Brake shudder on delivery',
            'description': 'Customer reported brake vibration on delivery drive.',
            'vehicle_registration': 'TN-09-AB-1234'
        })
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        complaint_id = res1.data['id']
        self.assertEqual(res1.data['status'], 'RECEIVED')

        # 2. Offer Resolution with RCA
        res2 = self.client.post(f'/api/v1/customer-complaints/{complaint_id}/resolve/', {
            'root_cause_analysis': 'Rotor disc manufacturing run-out discrepancy',
            'corrective_action': 'Replaced front discs under OEM warranty'
        })
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data['status'], 'RESOLVED')
        self.assertIn('Rotor disc', res2.data['root_cause_analysis'])

        # 3. Customer Close with CSI
        res3 = self.client.post(f'/api/v1/customer-complaints/{complaint_id}/close/', {
            'csi_recovery_score': 10,
            'customer_feedback': 'Very satisfied with prompt manager resolution'
        })
        self.assertEqual(res3.status_code, status.HTTP_200_OK)
        self.assertEqual(res3.data['status'], 'CLOSED')
        self.assertEqual(res3.data['csi_recovery_score'], 10)
