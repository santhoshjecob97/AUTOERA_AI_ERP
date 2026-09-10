"""
AutoEra AI ERP — RBAC Permission Classes (Section 02 — 16 Roles)
Server-side authorization enforcement. Frontend button visibility is NOT sufficient.
Every API endpoint MUST use one of these permission classes.

Hierarchy: L0 Super Admin → L1 Enterprise → L2 Dealer Principal → L3 GM/OEM →
           L4 Managers → L5 Executives → L6 Technician → L7 Vehicle Owner
"""
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """L0 — Full system access: tenant management, billing, system config."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') == 'SUPER_ADMIN'
        )


class IsEnterpriseAdmin(BasePermission):
    """L1 — Multi-company group management."""
    ENTERPRISE_ROLES = {'SUPER_ADMIN', 'ENTERPRISE_ADMIN'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.ENTERPRISE_ROLES
        )


class IsDealerPrincipal(BasePermission):
    """L2 — P&L view, all departments, approve write-offs."""
    DEALER_ROLES = {'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.DEALER_ROLES
        )


class IsManagerOrAbove(BasePermission):
    """L3–L4 — General Manager + all department managers."""
    MANAGER_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'SALES_MANAGER', 'SERVICE_MANAGER',
        'FLEET_MANAGER', 'PARTS_MANAGER',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.MANAGER_ROLES
        )


class IsSalesRole(BasePermission):
    """Sales Manager, Sales Executive, CRM Executive, GM, or Super Admin."""
    SALES_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'CRM_EXECUTIVE',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.SALES_ROLES
        )


class IsServiceRole(BasePermission):
    """Service Advisor, Technician, Service Manager, Parts Manager, GM, or Super Admin."""
    SERVICE_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'SERVICE_MANAGER', 'SERVICE_ADVISOR',
        'TECHNICIAN', 'PARTS_MANAGER',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.SERVICE_ROLES
        )


class IsFinanceRole(BasePermission):
    """Finance Executive, General Manager, Dealer Principal, or Super Admin."""
    FINANCE_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'FINANCE_OFFICER',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.FINANCE_ROLES
        )


class IsInsuranceRole(BasePermission):
    """Insurance Executive, General Manager, Dealer Principal, or Super Admin."""
    INSURANCE_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'INSURANCE_EXECUTIVE',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.INSURANCE_ROLES
        )


class IsFleetRole(BasePermission):
    """Fleet Manager, General Manager, or Super Admin."""
    FLEET_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'FLEET_MANAGER',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.FLEET_ROLES
        )


class IsCRMRole(BasePermission):
    """CRM Executive, Sales Manager, or above."""
    CRM_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'SALES_MANAGER', 'CRM_EXECUTIVE',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.CRM_ROLES
        )


class IsOEMRole(BasePermission):
    """OEM User — read-only network-level data access."""
    OEM_ROLES = {'SUPER_ADMIN', 'OEM_USER'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.OEM_ROLES
        )


class IsPartsRole(BasePermission):
    """Parts Manager, Service Manager, or above."""
    PARTS_ROLES = {
        'SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL',
        'GENERAL_MANAGER', 'SERVICE_MANAGER', 'PARTS_MANAGER',
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.PARTS_ROLES
        )


class ReadOnly(BasePermission):
    """Allow any authenticated user to read, but deny writes."""
    def has_permission(self, request, view):
        return request.method in ('GET', 'HEAD', 'OPTIONS')


class IsOwnerOrManager(BasePermission):
    """
    Object-level permission: allows the creator or a manager+ to modify.
    Requires the model to have a `created_by` or `assigned_to` field.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        user_level = getattr(user, 'hierarchy_level', 7)

        # L0–L4 managers have full object access
        if user_level <= 4:
            return True

        # Check ownership via common fields
        if hasattr(obj, 'created_by') and obj.created_by == user:
            return True
        if hasattr(obj, 'assigned_sales_rep') and obj.assigned_sales_rep == str(user):
            return True
        if hasattr(obj, 'customer') and hasattr(user, 'id'):
            # Vehicle owners can access their own data
            if user.role == 'VEHICLE_OWNER':
                customer = getattr(obj, 'customer', None)
                if customer and hasattr(customer, 'user') and customer.user == user:
                    return True

        return False

