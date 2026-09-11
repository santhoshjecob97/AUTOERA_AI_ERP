import uuid
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from identity.models import User
from organization.models import Organization, DealerGroup, Branch
from sales.models import SalesTarget, IncentiveRule, IncentiveCalculation


class SalesTargetAndIncentiveTestCase(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Capital Auto Group", slug="capital-auto-group-sales")
        self.dealer_group = DealerGroup.objects.create(organization=self.org, name="Capital Honda Chennai", brand="Honda")
        self.branch = Branch.objects.create(
            dealer_group=self.dealer_group,
            name="Capital Honda Meenambakkam",
            code="CH-MNB-SLS",
            city="Chennai",
            state="Tamil Nadu"
        )
        self.user = User.objects.create_user(
            username="sales_manager",
            password="securePassword123!",
            email="sales@capitalhonda.com",
            role="SALES_MANAGER",
            organization=self.org
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_sales_target_calculation(self):
        """Verify target vs actual achievement percentage, gap, and forecast."""
        target = SalesTarget.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            level='INDIVIDUAL_REP',
            sales_rep_name="K. Raman",
            period_month=9,
            period_year=2026,
            target_vehicle_units=12,
            actual_vehicle_units=9
        )
        # 9 / 12 * 100 = 75.00%
        self.assertEqual(target.achievement_percentage, Decimal('75.00'))
        self.assertEqual(target.gap_to_target_units, 3)
        self.assertGreater(float(target.ai_predicted_units), 9.0)

    def test_incentive_calculation_with_csi_gate(self):
        """Verify explainable slab incentive with CSI modifier."""
        target = SalesTarget.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            level='INDIVIDUAL_REP',
            sales_rep_name="K. Raman",
            period_month=9,
            period_year=2026,
            target_vehicle_units=10,
            actual_vehicle_units=10,
            actual_csi_score=Decimal('85.00') # Below 90% threshold!
        )
        rule = IncentiveRule.objects.create(
            organization_id=self.org.id,
            name="Standard Retail Slab",
            department="SALES",
            csi_threshold=Decimal('90.00'),
            csi_penalty_percentage=Decimal('15.00')
        )
        calc = IncentiveCalculation.objects.create(
            organization_id=self.org.id,
            target=target,
            rule=rule,
            sales_rep_name=target.sales_rep_name,
            period_month=9,
            period_year=2026,
            units_achieved=10,
            csi_score=Decimal('85.00')
        )
        # 10 units in Core Tier (8-12 units) = 10 * 2500 = 25,000 gross
        self.assertEqual(calc.gross_incentive, Decimal('25000.00'))
        # CSI penalty 15% on 25,000 = -3,750
        self.assertEqual(calc.csi_adjustment, Decimal('-3750.00'))
        # Final = 25000 - 3750 = 21,250
        self.assertEqual(calc.final_payable, Decimal('21250.00'))
        self.assertIn('formula', calc.calculation_audit_trail)

    def test_branch_achievement_api(self):
        """Verify branch achievement summary endpoint."""
        SalesTarget.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            level='INDIVIDUAL_REP',
            sales_rep_name="Rep 1",
            period_month=9,
            period_year=2026,
            target_vehicle_units=10,
            actual_vehicle_units=8
        )
        res = self.client.get(f'/api/v1/sales-targets/branch_achievement/?branch_id={self.branch.id}&month=9&year=2026')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('rollup', data)
        self.assertEqual(data['rollup']['target_units'], 10)
        self.assertEqual(data['rollup']['actual_units'], 8)

    def test_run_monthly_calculation_api(self):
        """Verify automated payroll incentive batch calculation."""
        SalesTarget.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            level='INDIVIDUAL_REP',
            sales_rep_name="Top Performer",
            period_month=9,
            period_year=2026,
            target_vehicle_units=12,
            actual_vehicle_units=14, # Super achiever (>12 units)
            actual_csi_score=Decimal('98.00')
        )
        res = self.client.post('/api/v1/incentive-calculations/run_monthly_calculation/', {
            'month': 9,
            'year': 2026
        }, format='json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('calculations', data)
        self.assertGreater(len(data['calculations']), 0)
        # 14 units * 4000 + 10000 booster = 66,000
        self.assertEqual(float(data['calculations'][0]['final_payable']), 66000.0)
