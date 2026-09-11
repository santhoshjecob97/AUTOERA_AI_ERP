import uuid
from decimal import Decimal
from datetime import date, timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from identity.models import User
from organization.models import Organization, DealerGroup, Branch
from workshop.models import WorkshopBay, Technician, TechnicianTimeLog, DailyTechnicianMetrics


class WorkshopProductivityTestCase(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Capital Auto Group", slug="capital-auto-group-workshop")
        self.dealer_group = DealerGroup.objects.create(organization=self.org, name="Capital Honda Chennai", brand="Honda")
        self.branch = Branch.objects.create(
            dealer_group=self.dealer_group,
            name="Capital Honda Meenambakkam",
            code="CH-MNB-SRV",
            city="Chennai",
            state="Tamil Nadu"
        )
        self.user = User.objects.create_user(
            username="service_manager",
            password="securePassword123!",
            email="service@capitalhonda.com",
            role="SERVICE_MANAGER",
            organization=self.org
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.tech = Technician.objects.create(
            organization_id=self.org.id,
            branch_id=self.branch.id,
            name="R. Vignesh",
            skill_tier="L2",
            specialization="Suspension, Brakes & Electrical"
        )

    def test_time_log_calculation_and_ai_flag(self):
        """Verify automatic duration computation and AI flag detection."""
        now = timezone.now()
        log = TechnicianTimeLog.objects.create(
            organization_id=self.org.id,
            branch_id=self.branch.id,
            technician=self.tech,
            date=date.today(),
            clock_in=now - timedelta(hours=2),
            clock_out=now,
            activity_type='MAINTENANCE',
            flat_rate_hours=Decimal('2.50')
        )
        self.assertAlmostEqual(float(log.actual_hours), 2.0, places=1)
        self.assertEqual(log.ai_efficiency_flag, 'OPTIMAL')

    def test_comeback_flag(self):
        """Verify comeback rework flag."""
        now = timezone.now()
        log = TechnicianTimeLog.objects.create(
            organization_id=self.org.id,
            branch_id=self.branch.id,
            technician=self.tech,
            date=date.today(),
            clock_in=now - timedelta(hours=1),
            clock_out=now,
            is_comeback=True,
            comeback_notes="Customer reported brake squeal after yesterday pad replacement."
        )
        self.assertEqual(log.ai_efficiency_flag, 'COMEBACK_RISK')

    def test_productivity_formulas(self):
        """
        Verify the 3 Capital Honda / AutoEra standard dealership productivity formulas:
        Productivity = Productive / Available * 100
        Efficiency = Sold / Clocked * 100
        Utilization = Clocked / Available * 100
        """
        metrics = DailyTechnicianMetrics.objects.create(
            organization_id=self.org.id,
            technician=self.tech,
            date=date.today(),
            available_hours=Decimal('8.00'),
            clocked_hours=Decimal('7.00'),
            productive_hours=Decimal('6.80'),
            sold_hours=Decimal('7.70') # Tech finished 7.7 flat rate hours in 7 clocked hours
        )
        # Prod = 6.80 / 8.00 * 100 = 85.00%
        self.assertEqual(metrics.productivity_pct, Decimal('85.00'))
        # Eff = 7.70 / 7.00 * 100 = 110.00%
        self.assertEqual(metrics.efficiency_pct, Decimal('110.00'))
        # Util = 7.00 / 8.00 * 100 = 87.50%
        self.assertEqual(metrics.utilization_pct, Decimal('87.50'))

    def test_clock_event_api(self):
        """Verify clock-in and clock-out API actions."""
        # Clock in
        res_in = self.client.post('/api/v1/technician-time-logs/clock_event/', {
            'action': 'CLOCK_IN',
            'technician_id': str(self.tech.id),
            'activity_type': 'REPAIR',
            'flat_rate_hours': '1.50'
        }, format='json')
        self.assertEqual(res_in.status_code, 201)
        log_id = res_in.json()['id']

        # Clock out
        res_out = self.client.post('/api/v1/technician-time-logs/clock_event/', {
            'action': 'CLOCK_OUT',
            'log_id': log_id
        }, format='json')
        self.assertEqual(res_out.status_code, 200)
        self.assertIsNotNone(res_out.json()['clock_out'])

    def test_workshop_summary_api(self):
        """Verify aggregated workshop productivity metrics and anomaly checks."""
        DailyTechnicianMetrics.objects.create(
            organization_id=self.org.id,
            technician=self.tech,
            date=date.today(),
            available_hours=Decimal('8.00'),
            clocked_hours=Decimal('7.50'),
            productive_hours=Decimal('7.00'),
            sold_hours=Decimal('8.25'),
            idle_hours=Decimal('0.50'),
            comeback_count=0
        )
        res = self.client.get('/api/v1/technician-metrics/workshop_summary/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('kpis', data)
        self.assertIn('formulas_explained', data)
        self.assertGreater(float(data['kpis']['workshop_productivity_pct']), 0.0)
