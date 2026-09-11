import uuid
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from organization.models import Organization, DealerGroup, Branch
from identity.models import User, AttendanceRecord, LeaveRequest


class IdentityWorkforceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Apex KUN Auto", slug="apex-kun-auto")
        self.group = DealerGroup.objects.create(organization=self.org, name="Capital Group")
        self.branch_a = Branch.objects.create(dealer_group=self.group, name="Meenambakkam 3S", code="CHN-01")
        self.branch_b = Branch.objects.create(dealer_group=self.group, name="OMR Tech Hub", code="CHN-02")

        # Create Dealer Principal (L2)
        self.dp = User.objects.create_user(
            username="dealer_principal",
            password="StrongPassword123!",
            role="DEALER_PRINCIPAL",
            organization=self.org,
            branch=self.branch_a
        )

        # Create Sales Executive (L5)
        self.employee = User.objects.create_user(
            username="sales_rep",
            password="StrongPassword123!",
            role="SALES_EXECUTIVE",
            organization=self.org,
            branch=self.branch_a
        )

    def test_attendance_punch_in_and_out(self):
        self.client.force_authenticate(user=self.employee)
        # 1. Punch In
        res1 = self.client.post('/api/v1/attendance/punch/', {'source': 'MOBILE_GEO_FENCE'})
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertIn("Punch-in recorded", res1.data['message'])
        self.assertEqual(res1.data['record']['status'], 'PRESENT')

        # 2. Punch Out (second punch on same date)
        res2 = self.client.post('/api/v1/attendance/punch/', {'source': 'MOBILE_GEO_FENCE'})
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertIn("Punch-out recorded", res2.data['message'])
        self.assertIsNotNone(res2.data['record']['punch_out'])

    def test_leave_request_application_and_approval(self):
        self.client.force_authenticate(user=self.employee)
        today = timezone.localdate()
        # Employee applies for leave
        res_apply = self.client.post('/api/v1/leave-requests/', {
            'leave_type': 'CASUAL',
            'start_date': str(today),
            'end_date': str(today),
            'days_count': 1.0,
            'reason': 'Family function'
        })
        self.assertEqual(res_apply.status_code, status.HTTP_201_CREATED)
        leave_id = res_apply.data['id']
        self.assertEqual(res_apply.data['status'], 'PENDING')

        # Dealer Principal approves leave
        self.client.force_authenticate(user=self.dp)
        res_approve = self.client.post(f'/api/v1/leave-requests/{leave_id}/review/', {
            'decision': 'APPROVE'
        })
        self.assertEqual(res_approve.status_code, status.HTTP_200_OK)
        self.assertEqual(res_approve.data['status'], 'APPROVED')
        self.assertEqual(res_approve.data['approver_name'], self.dp.get_full_name())

    def test_branch_context_switching(self):
        self.client.force_authenticate(user=self.dp)
        self.assertEqual(self.dp.branch, self.branch_a)

        # Switch to branch B
        res_switch = self.client.post('/api/v1/auth/switch-branch/', {
            'branch_id': str(self.branch_b.id)
        })
        self.assertEqual(res_switch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_switch.data['active_branch']['name'], 'OMR Tech Hub')

        self.dp.refresh_from_db()
        self.assertEqual(self.dp.branch, self.branch_b)
