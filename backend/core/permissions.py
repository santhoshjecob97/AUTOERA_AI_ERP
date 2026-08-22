"""
AutoEra AI ERP — RBAC Permission Classes
Server-side authorization enforcement. Frontend button visibility is NOT sufficient.
Every API endpoint MUST use one of these permission classes.
"""
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """Full system access — tenant management, billing, system config."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') == 'SUPER_ADMIN'
        )


class IsManagerOrAbove(BasePermission):
    """General Manager, Sales Manager, Service Manager, or Super Admin."""
    MANAGER_ROLES = {'SUPER_ADMIN', 'GENERAL_MANAGER', 'SALES_MANAGER', 'SERVICE_MANAGER'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.MANAGER_ROLES
        )


class IsFinanceRole(BasePermission):
    """Finance Officer, General Manager, or Super Admin."""
    FINANCE_ROLES = {'SUPER_ADMIN', 'GENERAL_MANAGER', 'FINANCE_OFFICER'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.FINANCE_ROLES
        )


class IsServiceRole(BasePermission):
    """Service Advisor, Technician, Service Manager, GM, or Super Admin."""
    SERVICE_ROLES = {'SUPER_ADMIN', 'GENERAL_MANAGER', 'SERVICE_MANAGER', 'SERVICE_ADVISOR', 'TECHNICIAN'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.SERVICE_ROLES
        )


class IsSalesRole(BasePermission):
    """Sales Manager, Sales Executive, GM, or Super Admin."""
    SALES_ROLES = {'SUPER_ADMIN', 'GENERAL_MANAGER', 'SALES_MANAGER', 'SALES_EXECUTIVE'}

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, 'role', '') in self.SALES_ROLES
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
    MANAGER_ROLES = {'SUPER_ADMIN', 'GENERAL_MANAGER', 'SALES_MANAGER', 'SERVICE_MANAGER'}

    def has_object_permission(self, request, view, obj):
        if getattr(request.user, 'role', '') in self.MANAGER_ROLES:
            return True

        # Check ownership via common fields
        if hasattr(obj, 'created_by') and obj.created_by == request.user:
            return True
        if hasattr(obj, 'assigned_sales_rep') and obj.assigned_sales_rep == str(request.user):
            return True

        return False
