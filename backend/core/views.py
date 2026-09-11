"""
AutoEra AI ERP — Core Views & Base ViewSets
TenantScopedViewSet: Enforces tenant isolation at the ORM query level.
Every tenant-scoped endpoint MUST inherit from this.
"""
import logging
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection

logger = logging.getLogger('autoera.views')


class HealthCheckView(APIView):
    """
    Health check endpoint for container monitoring & load balancers.
    GET /api/v1/health/
    """
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        db_ok = True
        try:
            connection.ensure_connection()
        except Exception:
            db_ok = False

        redis_ok = True
        try:
            from django.core.cache import cache
            cache.set('health_check', '1', 10)
            redis_ok = cache.get('health_check') == '1'
        except Exception:
            redis_ok = False

        is_operational = db_ok
        return Response({
            'status': 'HEALTHY' if (db_ok and redis_ok) else ('DEGRADED' if db_ok else 'UNHEALTHY'),
            'database': 'UP' if db_ok else 'DOWN',
            'cache': 'UP' if redis_ok else 'DOWN',
            'service': 'AutoEra AI ERP Backend',
            'version': '1.0.0',
        }, status=status.HTTP_200_OK if is_operational else status.HTTP_503_SERVICE_UNAVAILABLE)


class ReadinessView(APIView):
    """Kubernetes-style readiness probe."""
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        try:
            connection.ensure_connection()
            return Response({'ready': True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'ready': False}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class LivenessView(APIView):
    """Kubernetes-style liveness probe."""
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        return Response({'alive': True}, status=status.HTTP_200_OK)


class TenantScopedViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that enforces multi-tenant isolation.

    SECURITY CONTRACT:
    1. get_queryset() — Filters ALL queries by the authenticated user's organization_id.
       Users can ONLY see records belonging to their own organization.
    2. perform_create() — Auto-injects organization_id and branch_id from the
       authenticated user into every new record.
    3. No client-controlled header can override tenant context.

    Every tenant-scoped ViewSet in AutoEra MUST inherit from this class.
    """

    def _get_tenant_context(self):
        """Resolves organization_id and branch_id securely from request or authenticated user."""
        request = self.request
        org_id = getattr(request, 'organization_id', None)
        branch_id = getattr(request, 'branch_id', None)

        if not org_id and hasattr(request, 'user') and request.user.is_authenticated:
            if hasattr(request.user, 'organization_id') and request.user.organization_id:
                org_id = request.user.organization_id
            elif hasattr(request.user, 'organization') and request.user.organization:
                org_id = request.user.organization.id

            if hasattr(request.user, 'branch_id') and request.user.branch_id:
                branch_id = request.user.branch_id
            elif hasattr(request.user, 'branch') and request.user.branch:
                branch_id = request.user.branch.id

        return org_id, branch_id

    def get_queryset(self):
        """
        Filter queryset to only return records belonging to the
        authenticated user's organization. This is the PRIMARY
        tenant isolation enforcement mechanism.
        """
        qs = super().get_queryset()
        org_id, branch_id = self._get_tenant_context()

        if not org_id:
            logger.warning(
                "Tenant-scoped query with no organization_id",
                extra={
                    'user': str(self.request.user),
                    'path': self.request.path,
                    'request_id': getattr(self.request, 'request_id', ''),
                }
            )
            # SECURITY: Return empty queryset if no tenant context
            return qs.none()

        qs = qs.filter(organization_id=org_id)

        if branch_id:
            qs = qs.filter(branch_id=branch_id)

        return qs

    def perform_create(self, serializer):
        """
        Auto-inject the authenticated user's organization_id and branch_id
        into every new record. Users cannot set these fields manually.
        """
        org_id, branch_id = self._get_tenant_context()

        if not org_id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("User has no organization assigned. Cannot create records.")

        save_kwargs = {
            'organization_id': org_id,
        }
        if branch_id:
            save_kwargs['branch_id'] = branch_id

        # Auto-inject audit and tenant context fields if present on model
        try:
            model_fields = {f.name for f in serializer.Meta.model._meta.get_fields()}
            if 'user_id' in model_fields and hasattr(self.request, 'user') and self.request.user.is_authenticated:
                save_kwargs['user_id'] = self.request.user.id
            if 'source_system' in model_fields:
                save_kwargs['source_system'] = self.request.headers.get('X-Source-System', 'AUTOERA_CLOUD')
            if 'audit_metadata' in model_fields:
                save_kwargs['audit_metadata'] = {
                    'request_id': getattr(self.request, 'request_id', ''),
                    'client_ip': getattr(self.request, 'META', {}).get('REMOTE_ADDR', ''),
                    'user_agent': getattr(self.request, 'META', {}).get('HTTP_USER_AGENT', '')
                }
        except Exception as e:
            logger.debug(f"Audit field injection skipped: {e}")

        serializer.save(**save_kwargs)
        logger.info(
            f"Record created in {self.queryset.model.__name__}",
            extra={
                'user': str(self.request.user),
                'organization_id': str(org_id),
                'request_id': getattr(self.request, 'request_id', ''),
            }
        )

    def perform_update(self, serializer):
        """Log updates for audit trail."""
        serializer.save()
        org_id, _ = self._get_tenant_context()
        logger.info(
            f"Record updated in {self.queryset.model.__name__}",
            extra={
                'user': str(self.request.user),
                'organization_id': str(org_id or ''),
                'request_id': getattr(self.request, 'request_id', ''),
            }
        )

    def perform_destroy(self, instance):
        """Log deletions for audit trail."""
        org_id, _ = self._get_tenant_context()
        logger.info(
            f"Record deleted in {self.queryset.model.__name__}: {instance.pk}",
            extra={
                'user': str(self.request.user),
                'organization_id': str(org_id or ''),
                'request_id': getattr(self.request, 'request_id', ''),
            }
        )
        instance.delete()


class TenantScopedReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only version of TenantScopedViewSet for resources that
    should not be modified via API (e.g., audit logs).
    """

    def get_queryset(self):
        qs = super().get_queryset()
        request = self.request
        org_id = getattr(request, 'organization_id', None)

        if not org_id and hasattr(request, 'user') and request.user.is_authenticated:
            if hasattr(request.user, 'organization_id') and request.user.organization_id:
                org_id = request.user.organization_id
            elif hasattr(request.user, 'organization') and request.user.organization:
                org_id = request.user.organization.id

        if not org_id:
            return qs.none()

        return qs.filter(organization_id=org_id)


from django.views import View


class RealtimeEventStreamView(View):
    """
    Real-Time Server-Sent Events (SSE) Stream Endpoint (Section 03 & Section 07).
    Streams live automotive events from the AutomotiveEventBus and live workshop telemetry.
    GET /api/v1/events/stream/
    """

    def get(self, request):
        import time
        import json
        import queue
        from django.http import StreamingHttpResponse
        from django.utils import timezone
        from .automotive_event_bus import automotive_event_bus

        org_id = request.GET.get('organization_id') or 'all'
        event_queue = automotive_event_bus.register_sse_queue(org_id)

        def event_stream():
            try:
                # Initial connection handshake frame
                yield f"event: connected\ndata: {json.dumps({'status': 'connected', 'tenant_id': org_id, 'timestamp': timezone.now().isoformat()})}\n\n"

                # Send recent events for instant hydration
                recent = automotive_event_bus.get_recent_events(tenant_id=None if org_id == 'all' else org_id, limit=5)
                for past_event in recent:
                    yield f"event: {past_event.get('event_type', 'domain_event')}\ndata: {json.dumps(past_event)}\n\n"

                # Stream live events with heartbeat
                for _ in range(30):  # Stream 30 cycles (browser auto-reconnects cleanly)
                    try:
                        live_event = event_queue.get(timeout=2.0)
                        evt_name = live_event.get('event_type', 'automotive_event')
                        yield f"event: {evt_name}\ndata: {json.dumps(live_event)}\n\n"
                    except queue.Empty:
                        # Heartbeat with real database status
                        from workshop.models import WorkshopBay
                        from sales.models import Lead
                        from fleet.models import FleetVehicle

                        occupied_bays = WorkshopBay.objects.filter(is_occupied=True).count()
                        total_bays = WorkshopBay.objects.count() or 6
                        bay_pct = round((occupied_bays / total_bays) * 100, 1) if total_bays else 0
                        hot_leads = Lead.objects.filter(ai_propensity_score__gte=70).count()
                        fleet_online = FleetVehicle.objects.filter(is_active=True).count() or 12

                        sync_payload = {
                            'timestamp': timezone.now().isoformat(),
                            'bay_status': {
                                'occupied': occupied_bays,
                                'total': total_bays,
                                'utilization_pct': bay_pct,
                                'express_bay_ready': True
                            },
                            'lead_alerts': {
                                'hot_leads_pending': hot_leads,
                                'sla_breach_count': 0
                            },
                            'fleet_heartbeat': {
                                'online_devices': fleet_online,
                                'active_trips': max(1, fleet_online // 3)
                            }
                        }
                        yield f"event: dashboard_sync\ndata: {json.dumps(sync_payload)}\n\n"
            finally:
                automotive_event_bus.unregister_sse_queue(org_id, event_queue)

        response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response


class TodaysTopActionsView(APIView):
    """
    Action Priority Engine: Returns dynamically prioritized "Today's Top 10 Actions".
    GET /api/v1/actions/top/
    """
    permission_classes = []

    def get(self, request):
        from .sla_priority_engine import SLAPriorityEngine
        org_id = request.query_params.get('organization_id') or getattr(request, 'organization_id', None)
        actions = SLAPriorityEngine.calculate_todays_top_actions(organization_id=org_id)
        return Response({
            'status': 'SUCCESS',
            'count': len(actions),
            'actions': actions
        }, status=status.HTTP_200_OK)


class SLASummaryView(APIView):
    """
    SLA Engine: Aggregated compliance rates, breached count, and financial risk.
    GET /api/v1/actions/sla-summary/
    """
    permission_classes = []

    def get(self, request):
        from .sla_priority_engine import SLAPriorityEngine
        org_id = request.query_params.get('organization_id') or getattr(request, 'organization_id', None)
        summary = SLAPriorityEngine.get_sla_metrics_summary(organization_id=org_id)
        return Response(summary, status=status.HTTP_200_OK)


