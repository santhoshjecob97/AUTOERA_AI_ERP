"""
AutoEra AI ERP — Core Middleware
TenantMiddleware: Derives tenant from authenticated user ONLY (never from client headers).
AuditLogMiddleware: Automatically records mutating API actions.
"""
import uuid
import json
import logging
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone

logger = logging.getLogger('autoera.middleware')


class TenantMiddleware(MiddlewareMixin):
    """
    Extracts organization_id and branch_id from the AUTHENTICATED USER only.

    SECURITY: Tenant identity is NEVER derived from client-controlled HTTP headers.
    This prevents horizontal privilege escalation and cross-tenant data access.

    The X-Organization-ID / X-Branch-ID headers are IGNORED for security.
    If multi-org switching is needed in the future, it must be validated
    against the user's allowed organizations via a server-side lookup.
    """

    def process_request(self, request):
        # Generate a unique request ID for tracing
        request.request_id = str(uuid.uuid4())
        request.organization_id = None
        request.branch_id = None

        if hasattr(request, 'user') and request.user.is_authenticated:
            # Derive tenant from authenticated user's profile — NOT from headers
            if hasattr(request.user, 'organization_id') and request.user.organization_id:
                request.organization_id = request.user.organization_id
            elif hasattr(request.user, 'organization') and request.user.organization:
                request.organization_id = request.user.organization.id

            if hasattr(request.user, 'branch_id') and request.user.branch_id:
                request.branch_id = request.user.branch_id
            elif hasattr(request.user, 'branch') and request.user.branch:
                request.branch_id = request.user.branch.id

            logger.info(
                "Tenant resolved",
                extra={
                    'request_id': request.request_id,
                    'user_id': str(request.user.id),
                    'organization_id': str(request.organization_id),
                    'branch_id': str(request.branch_id),
                    'path': request.path,
                    'method': request.method,
                }
            )

        # SECURITY: Explicitly reject any attempt to override tenant via headers
        # These headers are logged for security monitoring but never used
        spoofed_org = request.headers.get('X-Organization-ID')
        spoofed_branch = request.headers.get('X-Branch-ID')
        if spoofed_org or spoofed_branch:
            logger.warning(
                "Tenant header override attempt detected and BLOCKED",
                extra={
                    'request_id': request.request_id,
                    'spoofed_org': spoofed_org,
                    'spoofed_branch': spoofed_branch,
                    'user': str(getattr(request, 'user', 'anonymous')),
                    'ip': self._get_client_ip(request),
                    'path': request.path,
                }
            )

    @staticmethod
    def _get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')


class AuditLogMiddleware(MiddlewareMixin):
    """
    Automatically records mutating API actions (POST, PUT, PATCH, DELETE)
    to the AuditLog model for compliance and security traceability.
    """
    MUTATING_METHODS = {'POST', 'PUT', 'PATCH', 'DELETE'}
    EXCLUDED_PATHS = {'/api/v1/health/', '/admin/jsi18n/'}

    def process_response(self, request, response):
        if request.method not in self.MUTATING_METHODS:
            return response

        if any(request.path.startswith(p) for p in self.EXCLUDED_PATHS):
            return response

        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return response

        try:
            from audit_log.models import AuditLog
            path_parts = [p for p in request.path.strip('/').split('/') if p]
            resource_name = path_parts[2] if len(path_parts) > 2 else request.path

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

            if not org_id:
                return response

            AuditLog.objects.create(
                user_email=request.user.email or request.user.username,
                action=request.method,
                resource_type=resource_name,
                resource_id=path_parts[3] if len(path_parts) > 3 else '',
                ip_address=TenantMiddleware._get_client_ip(request) or None,
                organization_id=org_id,
                branch_id=branch_id,
                details={
                    'status_code': response.status_code,
                    'path': request.path,
                    'request_id': getattr(request, 'request_id', '')
                }
            )
        except Exception as e:
            logger.error(f"AuditLog write failed: {e}")

        return response
