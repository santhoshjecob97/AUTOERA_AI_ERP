from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from core.views import HealthCheckView, ReadinessView, LivenessView
from identity.views import LoginView, MeView, PasswordChangeView, UserViewSet
from organization.views import OrganizationViewSet, DealerGroupViewSet, BranchViewSet, DepartmentViewSet, BusinessSettingsViewSet
from customers.views import CustomerViewSet, CustomerTimelineViewSet
from vehicles.views import VehicleViewSet, VehicleStockViewSet
from sales.views import (
    LeadViewSet, LeadFollowUpViewSet, TestDriveViewSet,
    QuotationViewSet, BookingViewSet, AppointmentViewSet
)
from service.views import (
    JobCardViewSet, ServiceCheckInViewSet, ServiceInspectionViewSet,
    JobCardPartViewSet, JobCardLabourViewSet
)
from workshop.views import WorkshopBayViewSet, TechnicianViewSet
from inventory.views import (
    PartViewSet, SupplierViewSet, StockMovementViewSet,
    PurchaseOrderViewSet, PurchaseOrderItemViewSet
)
from finance.views import InvoiceViewSet, PaymentViewSet, FinanceApplicationViewSet
from insurance.views import InsurancePolicyViewSet, InsuranceRenewalViewSet, InsuranceClaimViewSet
from communication.views import NotificationViewSet
from audit_log.views import AuditLogViewSet
from billing.views import SaaSPlanViewSet, SubscriptionViewSet, RazorpayWebhookView
from ai_platform.views import (
    AICopilotChatView, AIServiceAdvisorContextView, AIServiceAdvisorRecommendationView,
    KnowledgeSearchAPIView, KnowledgeQueryAPIView,
    KnowledgeDocumentViewSet, KnowledgeChunkViewSet,
    ActionProposalViewSet, PromptTemplateViewSet,
    VoiceSessionViewSet, VoiceTranscriptViewSet,
    VoiceAnalyticsAPIView, VoiceWebhookAPIView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'dealer-groups', DealerGroupViewSet, basename='dealer-group')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'settings', BusinessSettingsViewSet, basename='business-settings')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'customer-timeline', CustomerTimelineViewSet, basename='customer-timeline')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'vehicle-stocks', VehicleStockViewSet, basename='vehicle-stock')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'lead-followups', LeadFollowUpViewSet, basename='lead-followup')
router.register(r'test-drives', TestDriveViewSet, basename='test-drive')
router.register(r'quotations', QuotationViewSet, basename='quotation')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'job-cards', JobCardViewSet, basename='jobcard')
router.register(r'check-ins', ServiceCheckInViewSet, basename='check-in')
router.register(r'inspections', ServiceInspectionViewSet, basename='inspection')
router.register(r'job-card-parts', JobCardPartViewSet, basename='job-card-part')
router.register(r'job-card-labour', JobCardLabourViewSet, basename='job-card-labour')
router.register(r'bays', WorkshopBayViewSet, basename='bay')
router.register(r'technicians', TechnicianViewSet, basename='technician')
router.register(r'parts', PartViewSet, basename='part')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'stock-movements', StockMovementViewSet, basename='stock-movement')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'purchase-order-items', PurchaseOrderItemViewSet, basename='purchase-order-item')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'finance-applications', FinanceApplicationViewSet, basename='finance-application')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'audit-logs', AuditLogViewSet, basename='auditlog')
router.register(r'billing/plans', SaaSPlanViewSet, basename='saasplan')
router.register(r'billing/subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'insurance/policies', InsurancePolicyViewSet, basename='policy')
router.register(r'insurance/renewals', InsuranceRenewalViewSet, basename='renewal')
router.register(r'insurance/claims', InsuranceClaimViewSet, basename='claim')
router.register(r'knowledge/documents', KnowledgeDocumentViewSet, basename='knowledge-document')
router.register(r'knowledge/chunks', KnowledgeChunkViewSet, basename='knowledge-chunk')
router.register(r'ai/proposals', ActionProposalViewSet, basename='ai-proposal')
router.register(r'ai/prompts', PromptTemplateViewSet, basename='ai-prompt')
router.register(r'voice/sessions', VoiceSessionViewSet, basename='voice-session')
router.register(r'voice/transcripts', VoiceTranscriptViewSet, basename='voice-transcript')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Health & Observability Probes
    path('api/v1/health/', HealthCheckView.as_view(), name='health_check'),
    path('api/v1/health/ready/', ReadinessView.as_view(), name='readiness_check'),
    path('api/v1/health/live/', LivenessView.as_view(), name='liveness_check'),

    # OpenAPI Schema & Interactive Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger_ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Authentication & Session Management
    path('api/v1/auth/login/', LoginView.as_view(), name='auth_login'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('api/v1/auth/me/', MeView.as_view(), name='auth_me'),
    path('api/v1/auth/password-change/', PasswordChangeView.as_view(), name='auth_password_change'),

    # AI Platform, RAG Knowledge & Service Advisor
    path('api/v1/ai/copilot/chat/', AICopilotChatView.as_view(), name='ai_copilot'),
    path('api/v1/ai/knowledge/search/', KnowledgeSearchAPIView.as_view(), name='ai_knowledge_search'),
    path('api/v1/ai/knowledge/query/', KnowledgeQueryAPIView.as_view(), name='ai_knowledge_query'),
    path('api/v1/ai/service-advisor/context/', AIServiceAdvisorContextView.as_view(), name='ai_service_advisor_context'),
    path('api/v1/ai/service-advisor/recommendation/', AIServiceAdvisorRecommendationView.as_view(), name='ai_service_advisor_recommendation'),

    # Voice Analytics & Webhook Endpoints
    path('api/v1/voice/analytics/', VoiceAnalyticsAPIView.as_view(), name='voice_analytics'),
    path('api/v1/voice/webhook/', VoiceWebhookAPIView.as_view(), name='voice_webhook'),

    # Payment Webhooks
    path('api/v1/billing/razorpay-webhook/', RazorpayWebhookView.as_view(), name='razorpay_webhook'),

    # Core REST Router
    path('api/v1/', include(router.urls)),
]
