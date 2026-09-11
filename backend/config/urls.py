from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from core.views import (
    HealthCheckView, ReadinessView, LivenessView, RealtimeEventStreamView,
    TodaysTopActionsView, SLASummaryView
)
from core.graphql_views import GraphQLAPIView
from identity.views import (
    LoginView, MeView, PasswordChangeView, UserViewSet,
    MFASetupView, MFAVerifyView, MFAValidateView,
    SwitchBranchView, AttendanceRecordViewSet, LeaveRequestViewSet
)
from organization.views import (
    OrganizationViewSet, DealerGroupViewSet, BranchViewSet,
    DepartmentViewSet, BusinessSettingsViewSet, DailyBranchChecklistViewSet
)
from customers.views import CustomerViewSet, CustomerTimelineViewSet, DPDPExportView, DPDPEraseView
from vehicles.views import VehicleViewSet, VehicleStockViewSet, VehicleHealthViewSet
from sales.views import (
    LeadViewSet, LeadFollowUpViewSet, TestDriveViewSet,
    QuotationViewSet, BookingViewSet, AppointmentViewSet,
    SalesTargetViewSet, IncentiveRuleViewSet, IncentiveCalculationViewSet
)
from service.views import (
    JobCardViewSet, ServiceCheckInViewSet, ServiceInspectionViewSet,
    JobCardPartViewSet, JobCardLabourViewSet,
    ServiceAppointmentScheduleViewSet, WarrantyClaimViewSet, QualityChecklistViewSet
)
from workshop.views import (
    WorkshopBayViewSet, TechnicianViewSet,
    TechnicianTimeLogViewSet, DailyTechnicianMetricsViewSet
)
from inventory.views import (
    PartViewSet, SupplierViewSet, StockMovementViewSet,
    PurchaseOrderViewSet, PurchaseOrderItemViewSet
)
from finance.views import InvoiceViewSet, PaymentViewSet, FinanceApplicationViewSet, SubventionSchemeViewSet, NACHMandateViewSet
from insurance.views import InsurancePolicyViewSet, InsuranceRenewalViewSet, InsuranceClaimViewSet
from communication.views import NotificationViewSet
from audit_log.views import AuditLogViewSet
from billing.views import SaaSPlanViewSet, SubscriptionViewSet, RazorpayWebhookView
from fleet.views import (
    FleetVehicleViewSet, OBDTelemetryViewSet, DriverScoreViewSet, GeofenceViewSet,
    FleetTripViewSet, FuelTheftIncidentViewSet, FleetMaintenanceCalendarViewSet,
    TelemetryIngestAPIView, PredictiveMaintenanceAPIView,
    DriverLeaderboardAPIView, RouteOptimizeAPIView, PipelineMetricsAPIView
)
from ev.views import (
    EVBatteryDataViewSet, ChargingSessionViewSet, BatteryHealthScoreViewSet,
    EVRangeAlertViewSet, BatteryReplacementPlanViewSet,
    EVBatteryHealthComputeAPIView, EVRangePredictionAPIView,
    EVDegradationForecastAPIView, EVChargingAnalyticsAPIView,
    EVRangeAnxietyInterventionAPIView, EVCellImbalanceCheckAPIView,
    EVThermalSafetyCheckAPIView, EVTCOCalculatorAPIView,
    EVReplacementPlanningAPIView, EVOEMBMSQueryAPIView
)
from ai_platform.views import (
    AICopilotChatView, AIServiceAdvisorContextView, AIServiceAdvisorRecommendationView,
    KnowledgeSearchAPIView, KnowledgeQueryAPIView,
    KnowledgeDocumentViewSet, KnowledgeChunkViewSet,
    ActionProposalViewSet, PromptTemplateViewSet,
    VoiceSessionViewSet, VoiceTranscriptViewSet,
    VoiceAnalyticsAPIView, VoiceWebhookAPIView,
    SpecialistAgentsRosterAPIView, SupervisorAgentDispatchAPIView,
    RAGPipelineQueryAPIView, CustomerKnowledgeGraphAPIView,
    ModelStackRouterAPIView, VoiceAISimulateAPIView
)
from developer.views import ApiKeyViewSet, WebhookViewSet, DeveloperDocsView
from customers.views import CustomerComplaintViewSet
from used_cars.views import (
    UsedCarAppraisalViewSet, UsedCarValuationViewSet, UsedCarInventoryViewSet
)
from core.database_views import (
    DatabaseSchemaAPIView, DatabaseTenancyStrategyAPIView,
    TimescaleDBStatusAPIView, DatabaseBenchmarkAPIView
)
from core.microservices_views import (
    MicroservicesCatalogAPIView, KafkaMeshTopicsAPIView,
    KafkaPublishEventAPIView, APIGatewayStandardsAPIView,
    TestEnvelopeAPIView
)
from core.tech_stack_views import (
    TechStackMatrixAPIView, TechStackSummaryAPIView,
    TechStackLayerDetailAPIView
)
from core.security_compliance_views import (
    SecurityLayersAPIView, SecurityLayerDetailAPIView,
    DPDPRequirementsAPIView, ComplianceControlsAPIView,
    SecuritySummaryAPIView, BreachNotificationSimulatorAPIView
)
from core.mobile_app_views import (
    MobileArchitectureAPIView, MobileAppsSummaryAPIView,
    MobileAppsListAPIView, MobileAppDetailAPIView
)

router = DefaultRouter()
router.register(r'attendance', AttendanceRecordViewSet, basename='attendance')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'developer/keys', ApiKeyViewSet, basename='developer-key')
router.register(r'developer/webhooks', WebhookViewSet, basename='developer-webhook')
router.register(r'users', UserViewSet, basename='user')
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'dealer-groups', DealerGroupViewSet, basename='dealer-group')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'daily-checklists', DailyBranchChecklistViewSet, basename='daily-checklist')
router.register(r'settings', BusinessSettingsViewSet, basename='business-settings')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'customer-timeline', CustomerTimelineViewSet, basename='customer-timeline')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'vehicle-stocks', VehicleStockViewSet, basename='vehicle-stock')
router.register(r'vehicle-health', VehicleHealthViewSet, basename='vehicle-health')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'lead-followups', LeadFollowUpViewSet, basename='lead-followup')
router.register(r'test-drives', TestDriveViewSet, basename='test-drive')
router.register(r'quotations', QuotationViewSet, basename='quotation')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'sales-targets', SalesTargetViewSet, basename='sales-target')
router.register(r'incentive-rules', IncentiveRuleViewSet, basename='incentive-rule')
router.register(r'incentive-calculations', IncentiveCalculationViewSet, basename='incentive-calculation')
router.register(r'job-cards', JobCardViewSet, basename='jobcard')
router.register(r'service-appointments', ServiceAppointmentScheduleViewSet, basename='service-appointment')
router.register(r'warranty-claims', WarrantyClaimViewSet, basename='warranty-claim')
router.register(r'quality-checklists', QualityChecklistViewSet, basename='quality-checklist')
router.register(r'check-ins', ServiceCheckInViewSet, basename='check-in')
router.register(r'inspections', ServiceInspectionViewSet, basename='inspection')
router.register(r'job-card-parts', JobCardPartViewSet, basename='job-card-part')
router.register(r'job-card-labour', JobCardLabourViewSet, basename='job-card-labour')
router.register(r'bays', WorkshopBayViewSet, basename='bay')
router.register(r'technicians', TechnicianViewSet, basename='technician')
router.register(r'technician-time-logs', TechnicianTimeLogViewSet, basename='technician-time-log')
router.register(r'technician-metrics', DailyTechnicianMetricsViewSet, basename='technician-metric')
router.register(r'parts', PartViewSet, basename='part')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'stock-movements', StockMovementViewSet, basename='stock-movement')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'purchase-order-items', PurchaseOrderItemViewSet, basename='purchase-order-item')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'finance-applications', FinanceApplicationViewSet, basename='finance-application')
router.register(r'finance/subventions', SubventionSchemeViewSet, basename='subvention-scheme')
router.register(r'finance/nach-mandates', NACHMandateViewSet, basename='nach-mandate')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'audit-logs', AuditLogViewSet, basename='auditlog')
router.register(r'billing/plans', SaaSPlanViewSet, basename='saasplan')
router.register(r'billing/subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'insurance/policies', InsurancePolicyViewSet, basename='policy')
router.register(r'insurance/renewals', InsuranceRenewalViewSet, basename='renewal')
router.register(r'insurance/claims', InsuranceClaimViewSet, basename='claim')
router.register(r'fleet/vehicles', FleetVehicleViewSet, basename='fleet-vehicle')
router.register(r'fleet/telemetry', OBDTelemetryViewSet, basename='fleet-telemetry')
router.register(r'fleet/driver-scores', DriverScoreViewSet, basename='driver-score')
router.register(r'fleet/geofences', GeofenceViewSet, basename='geofence')
router.register(r'fleet/trips', FleetTripViewSet, basename='fleet-trip')
router.register(r'fleet/fuel-theft-incidents', FuelTheftIncidentViewSet, basename='fleet-fuel-theft')
router.register(r'fleet/maintenance-calendar', FleetMaintenanceCalendarViewSet, basename='fleet-maintenance-calendar')
router.register(r'ev/battery-data', EVBatteryDataViewSet, basename='ev-battery')
router.register(r'ev/charging-sessions', ChargingSessionViewSet, basename='charging-session')
router.register(r'ev/health-scores', BatteryHealthScoreViewSet, basename='battery-health')
router.register(r'ev/range-alerts', EVRangeAlertViewSet, basename='ev-range-alert')
router.register(r'ev/replacement-plans', BatteryReplacementPlanViewSet, basename='ev-replacement-plan')
router.register(r'knowledge/documents', KnowledgeDocumentViewSet, basename='knowledge-document')
router.register(r'knowledge/chunks', KnowledgeChunkViewSet, basename='knowledge-chunk')
router.register(r'ai/proposals', ActionProposalViewSet, basename='ai-proposal')
router.register(r'ai/prompts', PromptTemplateViewSet, basename='ai-prompt')
router.register(r'voice/sessions', VoiceSessionViewSet, basename='voice-session')
router.register(r'voice/transcripts', VoiceTranscriptViewSet, basename='voice-transcript')

# Customer Complaint & Grievance Escalation (Area 22)
router.register(r'customer-complaints', CustomerComplaintViewSet, basename='customer-complaint')

# Used-Car Operating Engine (Area 13)
router.register(r'used-cars/appraisals', UsedCarAppraisalViewSet, basename='used-car-appraisal')
router.register(r'used-cars/valuations', UsedCarValuationViewSet, basename='used-car-valuation')
router.register(r'used-cars/inventory', UsedCarInventoryViewSet, basename='used-car-inventory')

# Dual URL aliases for seamless frontend compatibility
router.register(r'vehicles/vehicles', VehicleViewSet, basename='vehicles-vehicles-alias')
router.register(r'sales/leads', LeadViewSet, basename='sales-leads-alias')
router.register(r'service/job-cards', JobCardViewSet, basename='service-jobcards-alias')
router.register(r'inventory/parts', PartViewSet, basename='inventory-parts-alias')
router.register(r'finance/invoices', InvoiceViewSet, basename='finance-invoices-alias')
router.register(r'organization/branches', BranchViewSet, basename='organization-branches-alias')
router.register(r'organization/organizations', OrganizationViewSet, basename='organization-organizations-alias')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Health & Observability Probes
    path('api/v1/health/', HealthCheckView.as_view(), name='health_check'),
    path('api/v1/health/ready/', ReadinessView.as_view(), name='readiness_check'),
    path('api/v1/health/readiness/', ReadinessView.as_view(), name='readiness_alias'),
    path('api/v1/health/live/', LivenessView.as_view(), name='liveness_check'),
    path('api/v1/health/liveness/', LivenessView.as_view(), name='liveness_alias'),
    path('api/v1/events/stream/', RealtimeEventStreamView.as_view(), name='event_stream'),
    path('api/v1/actions/top/', TodaysTopActionsView.as_view(), name='todays_top_actions'),
    path('api/v1/actions/sla-summary/', SLASummaryView.as_view(), name='sla_summary'),
    path('api/v1/ai/top-actions/', TodaysTopActionsView.as_view(), name='ai_top_actions_alias'),
    path('api/v1/ai/sla-summary/', SLASummaryView.as_view(), name='ai_sla_summary_alias'),

    # OpenAPI Schema & Interactive Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger_ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Authentication & Session Management
    path('api/v1/auth/login/', LoginView.as_view(), name='auth_login'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('api/v1/auth/me/', MeView.as_view(), name='auth_me'),
    path('api/v1/auth/password-change/', PasswordChangeView.as_view(), name='auth_password_change'),
    path('api/v1/auth/switch-branch/', SwitchBranchView.as_view(), name='auth_switch_branch'),
    path('api/v1/auth/mfa/setup/', MFASetupView.as_view(), name='auth_mfa_setup'),
    path('api/v1/auth/mfa/verify/', MFAVerifyView.as_view(), name='auth_mfa_verify'),
    path('api/v1/auth/mfa/validate/', MFAValidateView.as_view(), name='auth_mfa_validate'),

    # Enterprise GraphQL Gateway
    path('api/v1/graphql/', GraphQLAPIView.as_view(), name='graphql_api'),

    # DPDP Act 2023 Statutory Compliance Endpoints
    path('api/v1/customers/<uuid:id>/dpdp/export/', DPDPExportView.as_view(), name='dpdp_customer_export'),
    path('api/v1/customers/<uuid:id>/dpdp/erase/', DPDPEraseView.as_view(), name='dpdp_customer_erase'),

    # AI Platform, RAG Knowledge & Multi-Agent Network (Section 11)
    path('api/v1/ai/copilot/chat/', AICopilotChatView.as_view(), name='ai_copilot'),
    path('api/v1/ai/knowledge/search/', KnowledgeSearchAPIView.as_view(), name='ai_knowledge_search'),
    path('api/v1/ai/knowledge/query/', KnowledgeQueryAPIView.as_view(), name='ai_knowledge_query'),
    path('api/v1/ai/service-advisor/context/', AIServiceAdvisorContextView.as_view(), name='ai_service_advisor_context'),
    path('api/v1/ai/service-advisor/recommendation/', AIServiceAdvisorRecommendationView.as_view(), name='ai_service_advisor_recommendation'),
    path('api/v1/ai/agents/roster/', SpecialistAgentsRosterAPIView.as_view(), name='ai_agents_roster'),
    path('api/v1/ai/agents/dispatch/', SupervisorAgentDispatchAPIView.as_view(), name='ai_agents_dispatch'),
    path('api/v1/ai/rag/pipeline/query/', RAGPipelineQueryAPIView.as_view(), name='ai_rag_pipeline_query'),
    path('api/v1/ai/knowledge-graph/<str:customer_id>/', CustomerKnowledgeGraphAPIView.as_view(), name='ai_customer_knowledge_graph'),
    path('api/v1/ai/model-stack/route/', ModelStackRouterAPIView.as_view(), name='ai_model_stack_route'),
    path('api/v1/ai/voice/simulate/', VoiceAISimulateAPIView.as_view(), name='ai_voice_simulate'),

    # Voice Analytics & Webhook Endpoints
    path('api/v1/voice/analytics/', VoiceAnalyticsAPIView.as_view(), name='voice_analytics'),
    path('api/v1/voice/webhook/', VoiceWebhookAPIView.as_view(), name='voice_webhook'),

    # Payment Webhooks
    path('api/v1/billing/razorpay-webhook/', RazorpayWebhookView.as_view(), name='razorpay_webhook'),

    # Fleet IoT & Telemetry Ingestion Pipeline
    path('api/v1/fleet/telemetry/ingest/', TelemetryIngestAPIView.as_view(), name='fleet_telemetry_ingest'),
    path('api/v1/fleet/predictive-maintenance/<uuid:vehicle_id>/', PredictiveMaintenanceAPIView.as_view(), name='fleet_predictive_maintenance'),
    path('api/v1/fleet/driver-leaderboard/', DriverLeaderboardAPIView.as_view(), name='fleet_driver_leaderboard'),
    path('api/v1/fleet/routes/optimize/', RouteOptimizeAPIView.as_view(), name='fleet_route_optimize'),
    path('api/v1/fleet/pipeline/metrics/', PipelineMetricsAPIView.as_view(), name='fleet_pipeline_metrics'),

    # EV Battery Intelligence & Health Scoring (Section 10)
    path('api/v1/ev/health-scores/compute/', EVBatteryHealthComputeAPIView.as_view(), name='ev_battery_health_compute'),
    path('api/v1/ev/range/predict/', EVRangePredictionAPIView.as_view(), name='ev_range_predict'),
    path('api/v1/ev/degradation/forecast/', EVDegradationForecastAPIView.as_view(), name='ev_degradation_forecast'),
    path('api/v1/ev/charging/analytics/', EVChargingAnalyticsAPIView.as_view(), name='ev_charging_analytics'),
    path('api/v1/ev/range-anxiety/check/', EVRangeAnxietyInterventionAPIView.as_view(), name='ev_range_anxiety_check'),
    path('api/v1/ev/cells/imbalance-check/', EVCellImbalanceCheckAPIView.as_view(), name='ev_cells_imbalance_check'),
    path('api/v1/ev/thermal/safety-check/', EVThermalSafetyCheckAPIView.as_view(), name='ev_thermal_safety_check'),
    path('api/v1/ev/tco/calculate/', EVTCOCalculatorAPIView.as_view(), name='ev_tco_calculate'),
    path('api/v1/ev/replacement/options/', EVReplacementPlanningAPIView.as_view(), name='ev_replacement_options'),
    path('api/v1/ev/oem-bms/query/', EVOEMBMSQueryAPIView.as_view(), name='ev_oem_bms_query'),

    # Database Architecture (Section 12: 35 Tables, Indexing, TimescaleDB, Multi-Tenancy)
    path('api/v1/database/schema/', DatabaseSchemaAPIView.as_view(), name='database_schema'),
    path('api/v1/database/tenancy/strategy/', DatabaseTenancyStrategyAPIView.as_view(), name='database_tenancy_strategy'),
    path('api/v1/database/timescaledb/status/', TimescaleDBStatusAPIView.as_view(), name='database_timescaledb_status'),
    path('api/v1/database/benchmark/', DatabaseBenchmarkAPIView.as_view(), name='database_benchmark'),

    # Backend Architecture & Microservices Mesh (Section 13: 16 Services, Kafka, REST/GraphQL)
    path('api/v1/mesh/services/', MicroservicesCatalogAPIView.as_view(), name='mesh_services'),
    path('api/v1/mesh/kafka/topics/', KafkaMeshTopicsAPIView.as_view(), name='mesh_kafka_topics'),
    path('api/v1/mesh/kafka/publish/', KafkaPublishEventAPIView.as_view(), name='mesh_kafka_publish'),
    path('api/v1/mesh/gateway/standards/', APIGatewayStandardsAPIView.as_view(), name='mesh_gateway_standards'),
    path('api/v1/mesh/gateway/test-envelope/', TestEnvelopeAPIView.as_view(), name='mesh_test_envelope'),

    # Technology Stack Decision Matrix (Section 14: 18 Layers & Trade-Offs)
    path('api/v1/tech-stack/matrix/', TechStackMatrixAPIView.as_view(), name='tech_stack_matrix'),
    path('api/v1/tech-stack/summary/', TechStackSummaryAPIView.as_view(), name='tech_stack_summary'),
    path('api/v1/tech-stack/layer/<str:layer_slug>/', TechStackLayerDetailAPIView.as_view(), name='tech_stack_layer_detail'),

    # Security & Compliance (Section 15: Defense in Depth · DPDP Act 2023 · SOC2 · ISO 27001)
    path('api/v1/security/layers/', SecurityLayersAPIView.as_view(), name='security_layers'),
    path('api/v1/security/layers/<str:layer_id>/', SecurityLayerDetailAPIView.as_view(), name='security_layer_detail'),
    path('api/v1/security/dpdp/requirements/', DPDPRequirementsAPIView.as_view(), name='dpdp_requirements'),
    path('api/v1/security/compliance/controls/', ComplianceControlsAPIView.as_view(), name='compliance_controls'),
    path('api/v1/security/summary/', SecuritySummaryAPIView.as_view(), name='security_summary'),
    path('api/v1/security/breach-notification/simulate/', BreachNotificationSimulatorAPIView.as_view(), name='breach_notification_simulate'),

    # Mobile App Design (Section 16: 5 Apps — Customer, Advisor, Fleet, Dealer, Technician)
    path('api/v1/mobile/architecture/', MobileArchitectureAPIView.as_view(), name='mobile_architecture'),
    path('api/v1/mobile/apps/summary/', MobileAppsSummaryAPIView.as_view(), name='mobile_apps_summary'),
    path('api/v1/mobile/apps/', MobileAppsListAPIView.as_view(), name='mobile_apps_list'),
    path('api/v1/mobile/apps/<str:app_id>/', MobileAppDetailAPIView.as_view(), name='mobile_app_detail'),

    # Developer Platform Documentation & Schema
    path('api/v1/developer/docs/', DeveloperDocsView.as_view(), name='developer_docs'),

    # Core REST Router
    path('api/v1/', include(router.urls)),
]

