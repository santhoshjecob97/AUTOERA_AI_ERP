import uuid
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from organization.models import Organization, DealerGroup, Branch
from identity.models import User
from customers.models import Customer
from vehicles.models import Vehicle
from sales.models import Lead, Appointment
from service.models import JobCard
from inventory.models import Part
from ai_platform.models import ActionProposal, PromptTemplate, AIUsageLog, KnowledgeDocument
from ai_platform.tools import tool_registry, RiskLevel
from ai_platform.agents import supervisor, IntentRouter
from ai_platform.ingestion import KnowledgeIngestionPipeline


class AgentOrchestrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Tenant Org A (Horizon Motors)
        self.org_a = Organization.objects.create(name='Horizon Motors', slug='horizon-motors')
        self.group_a = DealerGroup.objects.create(organization=self.org_a, name='Horizon South')
        self.branch_a = Branch.objects.create(dealer_group=self.group_a, name='Downtown', code='DT01', city='Bangalore', state='KA')
        
        self.advisor_a = User.objects.create_user(
            username='sa_orchestration', email='sa@horizon.com', password='Password@123',
            role='SERVICE_ADVISOR', organization=self.org_a, branch=self.branch_a
        )
        self.sales_a = User.objects.create_user(
            username='sales_orchestration', email='sales@horizon.com', password='Password@123',
            role='SALES_EXECUTIVE', organization=self.org_a, branch=self.branch_a
        )
        self.manager_a = User.objects.create_user(
            username='gm_orchestration', email='gm@horizon.com', password='Password@123',
            role='GENERAL_MANAGER', organization=self.org_a, branch=self.branch_a
        )
        self.tech_a = User.objects.create_user(
            username='tech_orchestration', email='tech@horizon.com', password='Password@123',
            role='TECHNICIAN', organization=self.org_a, branch=self.branch_a
        )

        # Tenant Org B (Apex Motors)
        self.org_b = Organization.objects.create(name='Apex Motors', slug='apex-motors')
        self.group_b = DealerGroup.objects.create(organization=self.org_b, name='Apex North')
        self.branch_b = Branch.objects.create(dealer_group=self.group_b, name='North Hub', code='NR01', city='Mumbai', state='MH')
        self.advisor_b = User.objects.create_user(
            username='sa_apex_orch', email='sa@apex.com', password='Password@123',
            role='SERVICE_ADVISOR', organization=self.org_b, branch=self.branch_b
        )

        # Seed Domain Records for Org A
        self.cust_a = Customer.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            first_name='Ananya', last_name='Roy', phone='9876543210'
        )
        self.veh_a = Vehicle.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            customer=self.cust_a, vin='VINORCHESTRATE001', registration_number='KA-01-OR-1234',
            make='Hyundai', model='Tucson', year=2024, odometer_reading=18000
        )
        self.lead_a = Lead.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            customer=self.cust_a, status='CONTACTED'
        )
        self.jc_a = JobCard.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            job_card_number='JC-ORCH-01', customer=self.cust_a, vehicle=self.veh_a,
            customer_complaints='Brake pad squeal and oil change', status='INSPECTION',
            estimated_cost=Decimal('8500.00')
        )
        self.part_brake = Part.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            part_number='BP-TUCSON-01', name='Brake Pad Set Tucson Front',
            stock_quantity=15, reorder_level=5, selling_price=Decimal('3200.00')
        )
        self.part_low = Part.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            part_number='OF-TUCSON-02', name='Oil Filter Tucson',
            stock_quantity=2, reorder_level=10, selling_price=Decimal('650.00')
        )

        # Ingest SOP
        self.doc = KnowledgeDocument.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            title='Horizon Tucson Service SOP', document_type='SOP', version=1
        )
        KnowledgeIngestionPipeline().ingest_document_text(
            self.doc, "Tucson Brake Service\n\nFront brake pads must be replaced if thickness is under 3.0mm."
        )

    # ==========================================
    # 1. Intent Router Tests
    # ==========================================

    def test_intent_router_service(self):
        agent = IntentRouter.route_agent("Job card status for brake replacement", 'SERVICE_ADVISOR')
        self.assertIn(agent, ['Service Advisor Agent', 'Service Agent'])

    def test_intent_router_sales(self):
        agent = IntentRouter.route_agent("Check quotation and booking for new Tucson", 'SALES_EXECUTIVE')
        self.assertEqual(agent, 'Sales Agent')

    def test_intent_router_parts(self):
        agent = IntentRouter.route_agent("Show low stock inventory and parts below reorder", 'SERVICE_ADVISOR')
        self.assertEqual(agent, 'Parts Agent')

    def test_intent_router_crm(self):
        agent = IntentRouter.route_agent("Schedule a follow up call for customer", 'SALES_EXECUTIVE')
        self.assertEqual(agent, 'CRM Agent')

    def test_intent_router_finance(self):
        agent = IntentRouter.route_agent("What is the invoice outstanding balance?", 'FINANCE_OFFICER')
        self.assertIn(agent, ['Finance Assistant', 'Finance Agent'])

    def test_intent_router_management(self):
        agent = IntentRouter.route_agent("Show today's revenue summary and workshop utilization", 'GENERAL_MANAGER')
        self.assertIn(agent, ['Management Copilot', 'Analytics & Executive Agent'])

    # ==========================================
    # 2. Tool Registry & RBAC Permissions
    # ==========================================

    def test_tool_registry_read_customer(self):
        ctx = {'organization_id': self.org_a.id, 'role': 'SERVICE_ADVISOR', 'user_name': 'sa'}
        res = tool_registry.execute('get_customer', ctx, phone='9876543210')
        self.assertEqual(res['status'], 'SUCCESS')
        self.assertEqual(res['customer']['name'], 'Ananya Roy')

    def test_tool_registry_read_vehicle(self):
        ctx = {'organization_id': self.org_a.id, 'role': 'SERVICE_ADVISOR', 'user_name': 'sa'}
        res = tool_registry.execute('get_vehicle', ctx, vin='VINORCHESTRATE001')
        self.assertEqual(res['status'], 'SUCCESS')
        self.assertEqual(res['vehicle']['model'], 'Tucson')

    def test_tool_registry_parts_availability(self):
        ctx = {'organization_id': self.org_a.id, 'role': 'SERVICE_ADVISOR', 'user_name': 'sa'}
        res = tool_registry.execute('get_parts_availability', ctx, part_number='BP-TUCSON-01')
        self.assertEqual(res['status'], 'SUCCESS')
        self.assertEqual(res['parts'][0]['stock_quantity'], 15)

    def test_tool_registry_low_stock(self):
        ctx = {'organization_id': self.org_a.id, 'role': 'SERVICE_ADVISOR', 'user_name': 'sa'}
        res = tool_registry.execute('get_inventory_low_stock', ctx)
        self.assertEqual(res['status'], 'SUCCESS')
        self.assertGreaterEqual(res['low_stock_count'], 1)

    def test_tool_registry_unauthorized_role_blocked(self):
        # Technician attempting to create a quotation or issue a refund
        ctx = {'organization_id': self.org_a.id, 'role': 'TECHNICIAN', 'user_name': 'tech'}
        res = tool_registry.execute('issue_refund', ctx, invoice_id='INV-01', amount='5000')
        self.assertEqual(res['status'], 'FORBIDDEN')

    def test_tool_registry_cross_tenant_isolation(self):
        # User in Org B querying Org A customer
        ctx = {'organization_id': self.org_b.id, 'role': 'SERVICE_ADVISOR', 'user_name': 'sa_b'}
        res = tool_registry.execute('get_customer', ctx, phone='9876543210')
        self.assertEqual(res['status'], 'NOT_FOUND')

    # ==========================================
    # 3. High-Risk Action Proposal & Human Approval
    # ==========================================

    def test_high_risk_action_generates_action_proposal(self):
        """Verify high-risk actions are intercepted as ActionProposal in PENDING_APPROVAL status."""
        ctx = {'organization_id': self.org_a.id, 'role': 'GENERAL_MANAGER', 'user_name': 'gm', 'branch_id': self.branch_a.id}
        res = tool_registry.execute('issue_refund', ctx, invoice_id='INV-1001', amount='4500', reason='Goodwill refund')
        self.assertEqual(res['status'], 'PENDING_APPROVAL')
        self.assertIn('proposal_id', res)

        proposal = ActionProposal.objects.get(id=res['proposal_id'])
        self.assertEqual(proposal.status, 'PENDING_APPROVAL')
        self.assertEqual(proposal.risk_level, 'CRITICAL')

    def test_human_approval_api_workflow(self):
        """Verify Manager approving an ActionProposal updates status to EXECUTED."""
        proposal = ActionProposal.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            created_by_user='AI Copilot', agent_name='Service Agent',
            tool_name='approve_estimate', parameters_json={'job_card_id': str(self.jc_a.id), 'amount': '8500'},
            risk_level='HIGH', reason='Customer consented over phone', expected_effect='Approve Job Card #JC-ORCH-01',
            status='PENDING_APPROVAL'
        )

        self.client.force_authenticate(user=self.manager_a)
        res = self.client.post(f'/api/v1/ai/proposals/{proposal.id}/approve/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'EXECUTED')

        self.jc_a.refresh_from_db()
        self.assertEqual(self.jc_a.status, 'APPROVED')

    def test_human_rejection_api_workflow(self):
        """Verify Manager rejecting an ActionProposal updates status to REJECTED."""
        proposal = ActionProposal.objects.create(
            organization_id=self.org_a.id, branch_id=self.branch_a.id,
            created_by_user='AI Copilot', agent_name='Finance Assistant',
            tool_name='issue_refund', parameters_json={'invoice_id': 'INV-101', 'amount': '10000'},
            risk_level='CRITICAL', reason='Discount dispute', expected_effect='Issue refund',
            status='PENDING_APPROVAL'
        )

        self.client.force_authenticate(user=self.manager_a)
        res = self.client.post(f'/api/v1/ai/proposals/{proposal.id}/reject/', {'reason': 'Dispute resolved without refund'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'REJECTED')

        proposal.refresh_from_db()
        self.assertEqual(proposal.status, 'REJECTED')
        self.assertEqual(proposal.rejection_reason, 'Dispute resolved without refund')

    # ==========================================
    # 4. Multi-Step Agent Supervisor Loop
    # ==========================================

    def test_agent_supervisor_multi_step_execution(self):
        """Verify supervisor executes planned tools and generates synthesized grounded response."""
        self.client.force_authenticate(user=self.advisor_a)
        res = self.client.post('/api/v1/ai/copilot/chat/', {
            'prompt': 'Check customer 9876543210 and verify brake pad stock availability'
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data
        self.assertIn('get_customer', data['tool_executions'])
        self.assertIn('get_parts_availability', data['tool_executions'])
        self.assertEqual(data['status'], 'SUCCESS')

    def test_agent_supervisor_action_proposal_interception(self):
        """Verify prompt requesting refund produces an ActionProposal requiring human approval."""
        self.client.force_authenticate(user=self.manager_a)
        res = self.client.post('/api/v1/ai/copilot/chat/', {
            'prompt': 'Please issue refund of Rs. 5000 for customer invoice'
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data
        self.assertTrue(data['requires_human_approval'])
        self.assertTrue(len(data['action_proposals']) > 0)
        self.assertEqual(data['action_proposals'][0]['risk_level'], 'CRITICAL')

    def test_prompt_template_versioning(self):
        """Verify PromptTemplate creation and retrieval."""
        template = PromptTemplate.objects.create(
            organization_id=self.org_a.id, prompt_name='service_advisor_v1',
            version=1, agent_name='Service Agent',
            template_text='You are the AutoEra Service Advisor Assistant...',
            status='ACTIVE', created_by_user='gm_orchestration'
        )
        self.assertEqual(str(template), 'service_advisor_v1 v1 (Service Agent)')
