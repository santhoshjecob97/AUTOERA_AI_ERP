from rest_framework import viewsets
from core.views import TenantScopedViewSet
from core.permissions import IsSuperAdmin, IsManagerOrAbove
from .models import Organization, DealerGroup, Branch, Department, BusinessSettings
from .serializers import OrganizationSerializer, DealerGroupSerializer, BranchSerializer, DepartmentSerializer, BusinessSettingsSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    """Organization management — scoped to current user's org or Super Admin."""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsManagerOrAbove]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Organization.objects.none()
        if getattr(user, 'role', '') == 'SUPER_ADMIN':
            return Organization.objects.all()
        org_id = getattr(user, 'organization_id', None) or (user.organization.id if user.organization else None)
        if org_id:
            return Organization.objects.filter(id=org_id)
        return Organization.objects.none()


class DealerGroupViewSet(viewsets.ModelViewSet):
    """Dealer group management."""
    queryset = DealerGroup.objects.all()
    serializer_class = DealerGroupSerializer
    permission_classes = [IsManagerOrAbove]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return DealerGroup.objects.none()
        if getattr(user, 'role', '') == 'SUPER_ADMIN':
            return DealerGroup.objects.all()
        org_id = getattr(user, 'organization_id', None) or (user.organization.id if user.organization else None)
        if org_id:
            return DealerGroup.objects.filter(organization_id=org_id)
        return DealerGroup.objects.none()


class BranchViewSet(viewsets.ModelViewSet):
    """Branch management."""
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsManagerOrAbove]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Branch.objects.none()
        if getattr(user, 'role', '') == 'SUPER_ADMIN':
            return Branch.objects.all()
        org_id = getattr(user, 'organization_id', None) or (user.organization.id if user.organization else None)
        if org_id:
            return Branch.objects.filter(dealer_group__organization_id=org_id)
        return Branch.objects.none()


class DepartmentViewSet(viewsets.ModelViewSet):
    """Department management (Sales, Service, Parts, Finance, Insurance)."""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsManagerOrAbove]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Department.objects.none()
        if getattr(user, 'role', '') == 'SUPER_ADMIN':
            return Department.objects.all()
        org_id = getattr(user, 'organization_id', None) or (user.organization.id if user.organization else None)
        if org_id:
            return Department.objects.filter(organization_id=org_id)
        return Department.objects.none()


class BusinessSettingsViewSet(TenantScopedViewSet):
    """Dealership configuration settings — tenant isolated."""
    queryset = BusinessSettings.objects.all()
    serializer_class = BusinessSettingsSerializer
    permission_classes = [IsManagerOrAbove]
