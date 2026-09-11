import uuid
from datetime import date
from django.test import TestCase
from rest_framework.test import APIClient
from identity.models import User
from organization.models import Organization, DealerGroup, Branch, DailyBranchChecklist


class DailyBranchChecklistTestCase(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Capital Auto Group", slug="capital-auto-group")
        self.dealer_group = DealerGroup.objects.create(organization=self.org, name="Capital Honda Chennai", brand="Honda")
        self.branch = Branch.objects.create(
            dealer_group=self.dealer_group,
            name="Capital Honda Meenambakkam",
            code="CH-MNB-01",
            city="Chennai",
            state="Tamil Nadu"
        )
        self.user = User.objects.create_user(
            username="branch_manager",
            password="securePassword123!",
            email="manager@capitalhonda.com",
            role="GENERAL_MANAGER",
            organization=self.org
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_default_items_population(self):
        """Verify Capital Honda SOP default items are loaded for opening and closing."""
        checklist = DailyBranchChecklist.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            date=date.today(),
            checklist_type='OPENING',
            department='SALES'
        )
        self.assertGreater(len(checklist.items), 0)
        self.assertEqual(checklist.status, 'FLAGGED') # Because critical items exist and are not yet completed
        self.assertGreater(checklist.critical_issues_count, 0)
        self.assertEqual(checklist.completion_percentage, 0.0)

    def test_completion_calculation(self):
        """Verify completion percentage updates dynamically as items are checked."""
        checklist = DailyBranchChecklist.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            date=date.today(),
            checklist_type='OPENING',
            department='SALES'
        )
        # Mark all items as completed
        for item in checklist.items:
            item['completed'] = True
        checklist.update_completion()
        checklist.save()

        self.assertEqual(checklist.completion_percentage, 100.0)
        self.assertEqual(checklist.critical_issues_count, 0)
        self.assertEqual(checklist.status, 'COMPLETED')

    def test_today_status_api(self):
        """Verify today_status action initializes all 5 departments for both opening and closing."""
        response = self.client.get(f'/api/v1/daily-checklists/today_status/?branch_id={self.branch.id}')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('summary', data)
        self.assertIn('checklists', data)
        # 5 departments * 2 types (OPENING, CLOSING) = 10 checklists
        self.assertEqual(len(data['checklists']), 10)

    def test_toggle_item_api(self):
        """Verify toggle_item updates item state and recalculates checklist completion."""
        checklist = DailyBranchChecklist.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            date=date.today(),
            checklist_type='OPENING',
            department='SALES'
        )
        item_id = checklist.items[0]['id']
        response = self.client.post(f'/api/v1/daily-checklists/{checklist.id}/toggle_item/', {
            'item_id': item_id,
            'completed': True,
            'notes': 'Verified by Sales Lead'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(float(data['completion_percentage']), 0.0)

    def test_sign_off_api(self):
        """Verify branch manager digital sign off."""
        checklist = DailyBranchChecklist.objects.create(
            organization_id=self.org.id,
            branch=self.branch,
            date=date.today(),
            checklist_type='OPENING',
            department='FACILITY'
        )
        response = self.client.post(f'/api/v1/daily-checklists/{checklist.id}/sign_off/', {
            'supervisor_notes': 'Facility inspection passed and biometric gates verified.'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('signed off successfully', data['message'])
        self.assertEqual(data['checklist']['supervisor_notes'], 'Facility inspection passed and biometric gates verified.')
