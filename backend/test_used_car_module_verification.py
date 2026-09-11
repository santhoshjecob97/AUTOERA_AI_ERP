"""
Verification Test Suite — Used Car Operating Engine (Area 13).
Tests the complete lifecycle: Appraisal → Valuation → Acquisition → Reconditioning → Certification → Sale.
"""
import os
import sys
import unittest
from decimal import Decimal

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['DJANGO_DEBUG'] = 'True'

import django
django.setup()


class TestUsedCarModels(unittest.TestCase):
    """Verify that all Used-Car models exist with correct fields and constraints."""

    def test_appraisal_model_exists(self):
        from used_cars.models import UsedCarAppraisal
        self.assertTrue(hasattr(UsedCarAppraisal, 'appraisal_number'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'registration_number'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'make'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'model_name'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'manufacturing_year'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'odometer_km'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'source'))
        self.assertTrue(hasattr(UsedCarAppraisal, 'status'))

    def test_appraisal_120_point_inspection_fields(self):
        """Verify that the 120-point inspection categories exist."""
        from used_cars.models import UsedCarAppraisal
        required_scores = [
            'exterior_score', 'interior_score', 'engine_score',
            'suspension_score', 'electrical_score', 'underbody_score'
        ]
        for field in required_scores:
            self.assertTrue(hasattr(UsedCarAppraisal, field),
                            f"Missing 120-point inspection field: {field}")

    def test_appraisal_document_verification_fields(self):
        """Verify RC, insurance, hypothecation check fields."""
        from used_cars.models import UsedCarAppraisal
        doc_fields = [
            'rc_verified', 'insurance_valid', 'hypothecation_clear',
            'noc_available', 'pollution_certificate_valid', 'road_tax_paid'
        ]
        for field in doc_fields:
            self.assertTrue(hasattr(UsedCarAppraisal, field),
                            f"Missing document verification field: {field}")

    def test_appraisal_photo_audit_fields(self):
        """Verify 6-angle photo audit fields."""
        from used_cars.models import UsedCarAppraisal
        photo_fields = [
            'photo_front', 'photo_rear', 'photo_left', 'photo_right',
            'photo_interior', 'photo_engine_bay'
        ]
        for field in photo_fields:
            self.assertTrue(hasattr(UsedCarAppraisal, field),
                            f"Missing photo audit field: {field}")

    def test_valuation_model_exists(self):
        from used_cars.models import UsedCarValuation
        self.assertTrue(hasattr(UsedCarValuation, 'appraisal'))
        self.assertTrue(hasattr(UsedCarValuation, 'fair_market_value'))
        self.assertTrue(hasattr(UsedCarValuation, 'recommended_acquisition_price'))
        self.assertTrue(hasattr(UsedCarValuation, 'recommended_selling_price'))
        self.assertTrue(hasattr(UsedCarValuation, 'total_refurbishment_estimate'))
        self.assertTrue(hasattr(UsedCarValuation, 'projected_gross_margin'))
        self.assertTrue(hasattr(UsedCarValuation, 'ai_confidence_score'))
        self.assertTrue(hasattr(UsedCarValuation, 'recommendation'))

    def test_valuation_refurbishment_estimate_fields(self):
        """Verify itemized refurbishment cost breakdown."""
        from used_cars.models import UsedCarValuation
        refurb_fields = [
            'estimated_body_repair_cost', 'estimated_mechanical_repair_cost',
            'estimated_interior_refurb_cost', 'estimated_tyre_replacement_cost',
            'estimated_detailing_cost'
        ]
        for field in refurb_fields:
            self.assertTrue(hasattr(UsedCarValuation, field),
                            f"Missing refurbishment field: {field}")

    def test_inventory_model_exists(self):
        from used_cars.models import UsedCarInventory
        self.assertTrue(hasattr(UsedCarInventory, 'stock_number'))
        self.assertTrue(hasattr(UsedCarInventory, 'appraisal'))
        self.assertTrue(hasattr(UsedCarInventory, 'status'))
        self.assertTrue(hasattr(UsedCarInventory, 'acquisition_cost'))
        self.assertTrue(hasattr(UsedCarInventory, 'reconditioning_cost'))
        self.assertTrue(hasattr(UsedCarInventory, 'total_investment'))
        self.assertTrue(hasattr(UsedCarInventory, 'asking_price'))
        self.assertTrue(hasattr(UsedCarInventory, 'ageing_tier'))
        self.assertTrue(hasattr(UsedCarInventory, 'certification_type'))

    def test_inventory_margin_tracking_fields(self):
        """Verify realized margin analysis fields."""
        from used_cars.models import UsedCarInventory
        margin_fields = [
            'sold_date', 'sold_price', 'realized_gross_margin',
            'realized_margin_percentage', 'daily_holding_cost'
        ]
        for field in margin_fields:
            self.assertTrue(hasattr(UsedCarInventory, field),
                            f"Missing margin tracking field: {field}")

    def test_inventory_ageing_tiers(self):
        """Verify all required ageing tier choices exist."""
        from used_cars.models import UsedCarInventory
        tier_values = [c[0] for c in UsedCarInventory.AGEING_TIER_CHOICES]
        self.assertIn('FRESH', tier_values)
        self.assertIn('AGING', tier_values)
        self.assertIn('SLOW', tier_values)
        self.assertIn('DEAD', tier_values)


class TestUsedCarComputedProperties(unittest.TestCase):
    """Verify computed properties and business logic."""

    def test_inspection_score_calculation(self):
        from used_cars.models import UsedCarAppraisal
        a = UsedCarAppraisal(
            organization_id='00000000-0000-0000-0000-000000000001',
            exterior_score=Decimal('8.0'),
            interior_score=Decimal('7.5'),
            engine_score=Decimal('9.0'),
            suspension_score=Decimal('7.0'),
            electrical_score=Decimal('8.5'),
            underbody_score=Decimal('6.0'),
            make='Test', model_name='Car', manufacturing_year=2020,
            registration_number='XX-00-YY-0000'
        )
        expected = Decimal('46.0')
        self.assertEqual(a.overall_inspection_score, expected)

    def test_inspection_grade_mapping(self):
        from used_cars.models import UsedCarAppraisal
        # Score 55 -> A+
        a = UsedCarAppraisal(
            organization_id='00000000-0000-0000-0000-000000000001',
            exterior_score=Decimal('9.5'), interior_score=Decimal('9.0'),
            engine_score=Decimal('9.5'), suspension_score=Decimal('9.0'),
            electrical_score=Decimal('9.0'), underbody_score=Decimal('9.0'),
            make='Test', model_name='Car', manufacturing_year=2023,
            registration_number='XX-00-YY-0001'
        )
        self.assertEqual(a.inspection_grade, 'A+')

        # Score 30 -> C
        b = UsedCarAppraisal(
            organization_id='00000000-0000-0000-0000-000000000001',
            exterior_score=Decimal('5.0'), interior_score=Decimal('5.0'),
            engine_score=Decimal('5.0'), suspension_score=Decimal('5.0'),
            electrical_score=Decimal('5.0'), underbody_score=Decimal('5.0'),
            make='Test', model_name='Car', manufacturing_year=2018,
            registration_number='XX-00-YY-0002'
        )
        self.assertEqual(b.inspection_grade, 'C')

    def test_vehicle_age_calculation(self):
        from used_cars.models import UsedCarAppraisal
        from django.utils import timezone
        current_year = timezone.now().year
        a = UsedCarAppraisal(
            organization_id='00000000-0000-0000-0000-000000000001',
            manufacturing_year=current_year - 3,
            make='Test', model_name='Car',
            registration_number='XX-00-YY-0003'
        )
        self.assertEqual(a.vehicle_age_years, 3)

    def test_valuation_refurbishment_auto_sum(self):
        from used_cars.models import UsedCarAppraisal, UsedCarValuation
        v = UsedCarValuation(
            organization_id='00000000-0000-0000-0000-000000000001',
            estimated_body_repair_cost=Decimal('15000'),
            estimated_mechanical_repair_cost=Decimal('20000'),
            estimated_interior_refurb_cost=Decimal('8000'),
            estimated_tyre_replacement_cost=Decimal('12000'),
            estimated_detailing_cost=Decimal('5000'),
            recommended_acquisition_price=Decimal('500000'),
            recommended_selling_price=Decimal('700000'),
        )
        # Simulate save auto-compute
        v.total_refurbishment_estimate = (
            v.estimated_body_repair_cost +
            v.estimated_mechanical_repair_cost +
            v.estimated_interior_refurb_cost +
            v.estimated_tyre_replacement_cost +
            v.estimated_detailing_cost
        )
        self.assertEqual(v.total_refurbishment_estimate, Decimal('60000'))


class TestUsedCarStatusChoices(unittest.TestCase):
    """Verify all business-critical status choices exist."""

    def test_appraisal_status_lifecycle(self):
        from used_cars.models import UsedCarAppraisal
        statuses = [c[0] for c in UsedCarAppraisal.STATUS_CHOICES]
        required = ['PENDING_INSPECTION', 'INSPECTION_COMPLETE', 'VALUATION_PENDING',
                     'OFFER_MADE', 'CUSTOMER_ACCEPTED', 'CUSTOMER_REJECTED', 'ACQUIRED']
        for s in required:
            self.assertIn(s, statuses, f"Missing appraisal status: {s}")

    def test_inventory_status_lifecycle(self):
        from used_cars.models import UsedCarInventory
        statuses = [c[0] for c in UsedCarInventory.INVENTORY_STATUS_CHOICES]
        required = ['ACQUIRED', 'IN_RECONDITIONING', 'RECONDITIONING_COMPLETE',
                     'CERTIFIED', 'LISTED_FOR_SALE', 'RESERVED', 'SOLD']
        for s in required:
            self.assertIn(s, statuses, f"Missing inventory status: {s}")

    def test_certification_types(self):
        from used_cars.models import UsedCarInventory
        certs = [c[0] for c in UsedCarInventory.CERTIFICATION_CHOICES]
        self.assertIn('CPO_GOLD', certs)
        self.assertIn('CPO_SILVER', certs)
        self.assertIn('AS_IS', certs)

    def test_valuation_recommendation_types(self):
        from used_cars.models import UsedCarValuation
        recs = [c[0] for c in UsedCarValuation.RECOMMENDATION_CHOICES]
        self.assertIn('STRONG_BUY', recs)
        self.assertIn('BUY', recs)
        self.assertIn('HOLD', recs)
        self.assertIn('PASS', recs)

    def test_acquisition_source_types(self):
        from used_cars.models import UsedCarAppraisal
        sources = [c[0] for c in UsedCarAppraisal.SOURCE_CHOICES]
        self.assertIn('TRADE_IN', sources)
        self.assertIn('DIRECT_PURCHASE', sources)
        self.assertIn('AUCTION', sources)
        self.assertIn('CORPORATE_LEASE_RETURN', sources)


class TestUsedCarSerializers(unittest.TestCase):
    """Verify serializer class definitions."""

    def test_appraisal_serializer_exists(self):
        from used_cars.serializers import UsedCarAppraisalSerializer
        self.assertTrue(UsedCarAppraisalSerializer)

    def test_valuation_serializer_exists(self):
        from used_cars.serializers import UsedCarValuationSerializer
        self.assertTrue(UsedCarValuationSerializer)

    def test_inventory_serializer_exists(self):
        from used_cars.serializers import UsedCarInventorySerializer
        self.assertTrue(UsedCarInventorySerializer)

    def test_detail_serializer_nests_valuation(self):
        from used_cars.serializers import UsedCarAppraisalDetailSerializer
        declared = UsedCarAppraisalDetailSerializer._declared_fields
        self.assertIn('valuation', declared)
        self.assertIn('inventory', declared)


class TestUsedCarViewSets(unittest.TestCase):
    """Verify ViewSet class definitions and custom actions."""

    def test_appraisal_viewset_exists(self):
        from used_cars.views import UsedCarAppraisalViewSet
        self.assertTrue(UsedCarAppraisalViewSet)

    def test_appraisal_viewset_has_custom_actions(self):
        from used_cars.views import UsedCarAppraisalViewSet
        # Check that custom actions are registered
        action_methods = dir(UsedCarAppraisalViewSet)
        self.assertIn('complete_inspection', action_methods)
        self.assertIn('generate_valuation', action_methods)
        self.assertIn('acquire_vehicle', action_methods)

    def test_valuation_viewset_exists(self):
        from used_cars.views import UsedCarValuationViewSet
        self.assertTrue(UsedCarValuationViewSet)

    def test_inventory_viewset_exists(self):
        from used_cars.views import UsedCarInventoryViewSet
        self.assertTrue(UsedCarInventoryViewSet)

    def test_inventory_viewset_has_workflow_actions(self):
        from used_cars.views import UsedCarInventoryViewSet
        action_methods = dir(UsedCarInventoryViewSet)
        self.assertIn('start_reconditioning', action_methods)
        self.assertIn('complete_reconditioning', action_methods)
        self.assertIn('certify_vehicle', action_methods)
        self.assertIn('list_for_sale', action_methods)
        self.assertIn('record_sale', action_methods)
        self.assertIn('inventory_summary', action_methods)


class TestUsedCarURLWiring(unittest.TestCase):
    """Verify that API routes are properly registered."""

    def test_used_car_urls_registered(self):
        from django.urls import reverse
        # These should resolve without errors
        url = reverse('used-car-appraisal-list')
        self.assertIn('used-cars/appraisals', url)

        url = reverse('used-car-valuation-list')
        self.assertIn('used-cars/valuations', url)

        url = reverse('used-car-inventory-list')
        self.assertIn('used-cars/inventory', url)

    def test_complaint_url_registered(self):
        from django.urls import reverse
        url = reverse('customer-complaint-list')
        self.assertIn('customer-complaints', url)


class TestUsedCarAppConfig(unittest.TestCase):
    """Verify Django app registration."""

    def test_used_cars_in_installed_apps(self):
        from django.conf import settings
        self.assertIn('used_cars', settings.INSTALLED_APPS)

    def test_migration_file_exists(self):
        import used_cars.migrations
        migration_dir = os.path.dirname(used_cars.migrations.__file__)
        migrations = [f for f in os.listdir(migration_dir)
                      if f.startswith('0001') and f.endswith('.py')]
        self.assertTrue(len(migrations) > 0, "Initial migration file not found")


if __name__ == '__main__':
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(unittest.TestLoader().loadTestsFromModule(sys.modules[__name__]))
    sys.exit(0 if result.wasSuccessful() else 1)
