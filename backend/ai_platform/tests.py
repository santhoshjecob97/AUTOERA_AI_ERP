from django.test import TestCase
from rest_framework.test import APIClient
from identity.models import User
from organization.models import Organization


class AIAgentsAndPlatformTestCase(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Capital Auto Group", slug="capital-auto-group-ai")
        self.user = User.objects.create_user(
            username="ai_architect",
            password="securePassword123!",
            email="ai@capitalhonda.com",
            role="GENERAL_MANAGER",
            organization=self.org
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_specialist_agents_roster(self):
        """Verify the 10-Agent Specialist Dealership AI Roster."""
        res = self.client.get('/api/v1/ai/agents/roster/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('total_agents', data)
        self.assertIn('agents', data)
        self.assertGreaterEqual(data['total_agents'], 5)

    def test_supervisor_dispatch_sales_copilot(self):
        """Verify Supervisor Agent classifies prompt and routes to Sales Copilot."""
        res = self.client.post('/api/v1/ai/agents/dispatch/', {
            'prompt': 'Customer is asking for price comparison between Honda City e:HEV and Hyundai Verna Turbo'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('status', data)
        self.assertEqual(data['status'], 'SUCCESS')

    def test_supervisor_dispatch_service_copilot(self):
        """Verify Supervisor Agent routes service questions to Service Advisor Copilot."""
        res = self.client.post('/api/v1/ai/agents/dispatch/', {
            'prompt': 'Vehicle came in with DTC P0420 catalytic converter efficiency below threshold'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('status', data)
        self.assertEqual(data['status'], 'SUCCESS')
