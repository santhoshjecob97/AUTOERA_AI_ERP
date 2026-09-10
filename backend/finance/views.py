from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsFinanceRole, IsManagerOrAbove
from .models import Invoice, Payment, FinanceApplication
from .serializers import InvoiceSerializer, PaymentSerializer, FinanceApplicationSerializer


class InvoiceViewSet(TenantScopedViewSet):
    """Invoice management — tenant-isolated, finance role required."""
    queryset = Invoice.objects.select_related('customer', 'job_card').prefetch_related('payments').all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsFinanceRole]
    search_fields = ['invoice_number', 'customer__first_name', 'customer__phone']
    filterset_fields = ['status', 'invoice_type']
    ordering_fields = ['created_at', 'due_date', 'total_amount']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def generate_from_job_card(self, request, pk=None):
        """Auto-computes parts, labour, taxes, and totals from the Job Card."""
        invoice = self.get_object()
        invoice.recalculate_from_job_card()
        return Response(InvoiceSerializer(invoice).data, status=status.HTTP_200_OK)


class PaymentViewSet(TenantScopedViewSet):
    """Payment processing — tenant-isolated, finance role required."""
    queryset = Payment.objects.select_related('invoice').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsFinanceRole]
    search_fields = ['transaction_reference', 'invoice__invoice_number']
    filterset_fields = ['payment_method', 'status']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']


class FinanceApplicationViewSet(TenantScopedViewSet):
    """Auto-loan finance applications tracking, AI pre-screening, DigiLocker, and multi-bank EMI comparisons."""
    queryset = FinanceApplication.objects.select_related('customer').prefetch_related('bank_quotes').all()
    serializer_class = FinanceApplicationSerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    search_fields = ['application_number', 'customer__first_name', 'bank_partner', 'bank_ack_reference']
    filterset_fields = ['status', 'bank_partner', 'digilocker_status', 'nach_status']
    ordering = ['-created_at']

    @action(detail=False, methods=['post'], url_path='pre-screen')
    def pre_screen(self, request):
        """20-Second Bureau-Free Multi-Bank Eligibility Pre-Screening (Section 08)."""
        from decimal import Decimal
        from .services import AIEligibilityPreScreeningEngine
        income = Decimal(str(request.data.get('monthly_income', 75000)))
        existing_emi = Decimal(str(request.data.get('existing_monthly_emi', 12000)))
        employment_type = str(request.data.get('employment_type', 'SALARIED'))
        loan_amount = Decimal(str(request.data.get('loan_amount_requested', 850000)))
        city_tier = str(request.data.get('city_tier', 'TIER_1'))

        result = AIEligibilityPreScreeningEngine.pre_screen_customer(
            monthly_income=income,
            existing_emi=existing_emi,
            employment_type=employment_type,
            loan_amount_requested=loan_amount,
            city_tier=city_tier
        )
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='compare-emis')
    def compare_emis(self, request):
        """Simulates and compares auto-loan EMIs across 10+ banking partners with subvention schemes."""
        from .services import MultiBankEMIEngine
        loan_amount = float(request.data.get('loan_amount', 750000))
        tenure_months = int(request.data.get('tenure_months', 60))
        cibil_score = int(request.data.get('cibil_score', 750))
        subvention_subsidy_pct = float(request.data.get('subvention_subsidy_pct', 0.0))

        comparison = MultiBankEMIEngine.compare_lenders(
            loan_amount=loan_amount,
            tenure_months=tenure_months,
            cibil_score=cibil_score,
            subvention_subsidy_pct=subvention_subsidy_pct
        )
        return Response(comparison, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='generate-quotes')
    def generate_quotes(self, request, pk=None):
        """Generates and stores multi-bank EMI quote records for this application."""
        from .services import MultiBankEMIEngine
        app = self.get_object()
        loan_amount = float(app.loan_amount_requested or 500000)
        tenure_months = int(app.loan_tenure_months or 60)
        cibil_score = int(request.data.get('cibil_score', 750))

        comparison = MultiBankEMIEngine.compare_lenders(
            loan_amount=loan_amount,
            tenure_months=tenure_months,
            cibil_score=cibil_score,
            application=app
        )
        return Response(comparison, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='send-digilocker-link')
    def send_digilocker_link(self, request, pk=None):
        """Dispatches paperless DigiLocker document consent link via WhatsApp."""
        from .services import DigiLockerIntegrationEngine
        app = self.get_object()
        cust_name = str(request.data.get('customer_name') or (app.customer.first_name if app.customer else 'Customer'))
        cust_phone = str(request.data.get('customer_phone') or (app.customer.phone if app.customer else '+91-9876543210'))

        dispatch = DigiLockerIntegrationEngine.send_digilocker_request(
            application_id=app.id,
            customer_name=cust_name,
            customer_phone=cust_phone
        )
        app.digilocker_status = 'LINK_SENT'
        app.save(update_fields=['digilocker_status'])
        return Response(dispatch, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='verify-documents-ocr')
    def verify_documents_ocr(self, request, pk=None):
        """Cross-validates DigiLocker extracted documents against declared customer data."""
        from .services import DigiLockerIntegrationEngine, DocumentOCRVerificationEngine
        app = self.get_object()
        consent_token = str(request.data.get('consent_token', 'TOKEN_SAMPLE'))
        digilocker_data = request.data.get('digilocker_data') or DigiLockerIntegrationEngine.fetch_authenticated_documents(consent_token)

        declared_name = str(request.data.get('declared_name') or (app.customer.first_name if app.customer else 'Rahul Sharma'))
        declared_income = app.applicant_income or app.loan_amount_requested or 85000

        ocr_report = DocumentOCRVerificationEngine.cross_validate_documents(
            declared_name=declared_name,
            declared_monthly_income=declared_income,
            digilocker_data=digilocker_data
        )

        app.ocr_verification_result = ocr_report
        app.pan_number = ocr_report.get('extracted_pan', app.pan_number)
        app.aadhaar_last4 = ocr_report.get('extracted_aadhaar_last4', app.aadhaar_last4)
        app.digilocker_status = 'AUTHENTICATED' if ocr_report.get('ready_for_bank_submission') else 'FAILED'
        app.save(update_fields=['ocr_verification_result', 'pan_number', 'aadhaar_last4', 'digilocker_status'])

        return Response(ocr_report, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='submit-to-bank')
    def submit_to_bank(self, request, pk=None):
        """1-Click submission to bank API with auto-generated acknowledgement & SLA tracker."""
        from .services import BankApplicationSubmissionEngine
        app = self.get_object()
        bank_name = str(request.data.get('bank_partner') or app.bank_partner or 'HDFC Bank')

        submission = BankApplicationSubmissionEngine.submit_to_bank_api(
            bank_name=bank_name,
            applicant_name=app.customer.first_name if app.customer else 'Rahul Sharma',
            loan_amount=app.loan_amount_requested,
            tenure_months=app.loan_tenure_months,
            verified_dossier=app.ocr_verification_result or {}
        )

        app.bank_ack_reference = submission.get('acknowledgement_number', '')
        app.bank_partner = bank_name
        app.status = 'UNDER_REVIEW'
        app.save(update_fields=['bank_ack_reference', 'bank_partner', 'status'])

        return Response(submission, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='poll-bank-status')
    def poll_bank_status(self, request, pk=None):
        """Simulates 4-hourly bank API status polling and sanction letter retrieval."""
        from decimal import Decimal
        from .services import BankApplicationSubmissionEngine
        app = self.get_object()
        ack = app.bank_ack_reference or f"HDFC-AUTO-{app.id.hex[:6].upper()}"
        decision = BankApplicationSubmissionEngine.poll_bank_decision(ack)

        if decision.get('decision') == 'SANCTIONED':
            app.status = 'APPROVED'
            app.interest_rate_pct = Decimal(str(decision.get('interest_rate_approved', '8.75')))
            app.save(update_fields=['status', 'interest_rate_pct'])

        return Response(decision, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='create-nach-mandate')
    def create_nach_mandate(self, request, pk=None):
        """Auto-generates NPCI e-NACH mandate for EMI auto-debit."""
        from decimal import Decimal
        from .services import NACHMandateEngine
        from .models import NACHMandate
        app = self.get_object()

        cust_name = str(request.data.get('customer_name') or (app.customer.first_name if app.customer else 'Rahul Sharma'))
        bank_name = str(request.data.get('bank_name') or app.bank_partner or 'HDFC Bank')
        account_number = str(request.data.get('account_number', '50100234567890'))
        ifsc = str(request.data.get('ifsc', 'HDFC0001234'))
        monthly_emi = app.monthly_emi_estimated or Decimal('18500.00')

        mandate_data = NACHMandateEngine.generate_nach_mandate(
            customer_name=cust_name,
            bank_name=bank_name,
            account_number=account_number,
            ifsc=ifsc,
            monthly_emi=monthly_emi
        )

        app.nach_mandate_id = mandate_data['mandate_id']
        app.nach_status = 'ACTIVE'
        app.save(update_fields=['nach_mandate_id', 'nach_status'])

        NACHMandate.objects.create(
            organization_id=app.organization_id,
            application=app,
            mandate_reference=mandate_data['mandate_id'],
            customer_name=cust_name,
            bank_name=bank_name,
            bank_account_number=account_number,
            bank_ifsc=ifsc,
            max_amount_authorized=Decimal(str(mandate_data['max_amount_authorized'])),
            status='ACTIVE',
            umrn_number=mandate_data['umrn_number']
        )

        return Response(mandate_data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='record-disbursement')
    def record_disbursement(self, request, pk=None):
        """Records bank disbursement to dealer account and auto-computes 1% commission."""
        from decimal import Decimal
        from django.utils import timezone
        from .services import DisbursementTrackingEngine
        app = self.get_object()

        disbursed = Decimal(str(request.data.get('disbursed_amount') or app.loan_amount_requested or 850000))
        dealer_bank_ref = str(request.data.get('dealer_bank_ref', 'UTR-HDFC-992384110'))
        invoice_total = Decimal(str(request.data.get('invoice_total') or (disbursed + Decimal('150000'))))

        reconciliation = DisbursementTrackingEngine.record_disbursement(
            application_id=app.id,
            disbursed_amount=disbursed,
            dealer_bank_ref=dealer_bank_ref,
            invoice_total=invoice_total
        )

        app.disbursed_amount = disbursed
        app.disbursement_date = timezone.now().date()
        app.status = 'DISBURSED'
        app.calculate_commission()
        app.save(update_fields=['disbursed_amount', 'disbursement_date', 'status', 'dealer_commission_amount'])

        return Response(reconciliation, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='monthly-commission-ledger')
    def monthly_commission_ledger(self, request):
        """Dealer Principal monthly 1% finance commission ledger and executive incentive breakdown."""
        from .services import CommissionTrackingEngine
        ledger = CommissionTrackingEngine.get_monthly_commission_ledger(
            organization_id=getattr(request, 'organization_id', None)
        )
        return Response(ledger, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='active-subventions')
    def active_subventions(self, request):
        """Lists active OEM interest subvention schemes."""
        from .services import SubventionSchemeEngine
        return Response({'schemes': SubventionSchemeEngine.SCHEMES}, status=status.HTTP_200_OK)


class SubventionSchemeViewSet(TenantScopedViewSet):
    """OEM & Dealer Subvention Schemes management."""
    from .models import SubventionScheme
    from .serializers import SubventionSchemeSerializer
    queryset = SubventionScheme.objects.all()
    serializer_class = SubventionSchemeSerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    search_fields = ['scheme_name', 'oem_name', 'applicable_vehicle_model']
    filterset_fields = ['is_active', 'oem_name']
    ordering = ['-valid_until']


class NACHMandateViewSet(TenantScopedViewSet):
    """NPCI e-NACH and Razorpay e-Mandate auto-debit records."""
    from .models import NACHMandate
    from .serializers import NACHMandateSerializer
    queryset = NACHMandate.objects.select_related('application').all()
    serializer_class = NACHMandateSerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    search_fields = ['mandate_reference', 'customer_name', 'bank_name', 'umrn_number']
    filterset_fields = ['status', 'bank_name']
    ordering = ['-created_at']

