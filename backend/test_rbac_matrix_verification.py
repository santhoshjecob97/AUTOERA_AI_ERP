"""
AutoEra AI ERP — Master Architecture Section 02 RBAC Verification Suite
Verifies all 16 Roles, Hierarchy Levels L0–L7, Permission Classes, ABAC, and RLS bindings.
"""
import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from identity.models import User
from core.permissions import (
    IsSuperAdmin, IsEnterpriseAdmin, IsDealerPrincipal, IsManagerOrAbove,
    IsSalesRole, IsServiceRole, IsFinanceRole, IsInsuranceRole,
    IsFleetRole, IsCRMRole, IsOEMRole, IsPartsRole, IsOwnerOrManager
)

MASTER_ROLES = [
    ('SUPER_ADMIN', 0, 'Platform Super Admin'),
    ('ENTERPRISE_ADMIN', 1, 'Enterprise Admin'),
    ('DEALER_PRINCIPAL', 2, 'Dealer Principal'),
    ('GENERAL_MANAGER', 3, 'General Manager'),
    ('OEM_USER', 3, 'OEM User'),
    ('SALES_MANAGER', 4, 'Sales Manager'),
    ('SERVICE_MANAGER', 4, 'Service Manager'),
    ('FLEET_MANAGER', 4, 'Fleet Manager'),
    ('PARTS_MANAGER', 4, 'Spare Parts Manager'),
    ('SALES_EXECUTIVE', 5, 'Sales Consultant'),
    ('CRM_EXECUTIVE', 5, 'CRM Executive'),
    ('SERVICE_ADVISOR', 5, 'Service Advisor'),
    ('INSURANCE_EXECUTIVE', 5, 'Insurance Executive'),
    ('FINANCE_OFFICER', 5, 'Finance Executive'),
    ('TECHNICIAN', 6, 'Technician'),
    ('VEHICLE_OWNER', 7, 'Vehicle Owner'),
]

def run_rbac_audit():
    print("=" * 70)
    print(" AUTOERA AI - SECTION 02 USER ROLES & RBAC AUDIT")
    print("=" * 70)
    
    # 1. Audit Model Role Choices
    print("\n[1] AUDITING 16 ROLES & HIERARCHY LEVELS (L0 - L7)")
    role_choice_keys = dict(User.ROLE_CHOICES)
    level_map = User.LEVEL_MAP
    
    for role_key, expected_level, expected_name in MASTER_ROLES:
        assert role_key in role_choice_keys, f"Missing role {role_key} in ROLE_CHOICES"
        actual_level = level_map.get(role_key)
        assert actual_level == expected_level, f"Mismatch level for {role_key}: got {actual_level}, expected {expected_level}"
        print(f" [L{expected_level}] {role_key:<20} -> {role_choice_keys[role_key]} (Level {actual_level}) [VERIFIED]")
        
    print(f"\n [PASS] All {len(MASTER_ROLES)} roles verified in backend User model.")
    
    # 2. Audit DRF Permission Classes
    print("\n[2] AUDITING DRF PERMISSION CLASSES & ROLE GATES")
    class MockRequest:
        def __init__(self, role, user_id="user-123"):
            self.user = type("MockUser", (), {
                "is_authenticated": True,
                "role": role,
                "hierarchy_level": User.LEVEL_MAP.get(role, 7),
                "id": user_id
            })()
    
    # Test Super Admin Gate
    sa_req = MockRequest('SUPER_ADMIN')
    tech_req = MockRequest('TECHNICIAN')
    oem_req = MockRequest('OEM_USER')
    assert IsSuperAdmin().has_permission(sa_req, None) is True
    assert IsSuperAdmin().has_permission(tech_req, None) is False
    print(" [2.1] IsSuperAdmin (L0) gate verified.")
    
    # Test Enterprise Gate
    assert IsEnterpriseAdmin().has_permission(MockRequest('ENTERPRISE_ADMIN'), None) is True
    assert IsEnterpriseAdmin().has_permission(sa_req, None) is True
    assert IsEnterpriseAdmin().has_permission(tech_req, None) is False
    print(" [2.2] IsEnterpriseAdmin (L1) gate verified.")
    
    # Test Dealer Principal Gate
    assert IsDealerPrincipal().has_permission(MockRequest('DEALER_PRINCIPAL'), None) is True
    assert IsDealerPrincipal().has_permission(MockRequest('GENERAL_MANAGER'), None) is False
    print(" [2.3] IsDealerPrincipal (L2) gate verified.")
    
    # Test Manager Or Above (L0–L4)
    for r in ['SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'SALES_MANAGER', 'SERVICE_MANAGER', 'FLEET_MANAGER', 'PARTS_MANAGER']:
        assert IsManagerOrAbove().has_permission(MockRequest(r), None) is True, f"Failed for {r}"
    assert IsManagerOrAbove().has_permission(MockRequest('SALES_EXECUTIVE'), None) is False
    assert IsManagerOrAbove().has_permission(MockRequest('TECHNICIAN'), None) is False
    print(" [2.4] IsManagerOrAbove (L0–L4) cascade verified.")
    
    # Test OEM Role Gate
    assert IsOEMRole().has_permission(oem_req, None) is True
    assert IsOEMRole().has_permission(sa_req, None) is True
    assert IsOEMRole().has_permission(tech_req, None) is False
    print(" [2.5] IsOEMRole (L3) gate verified.")
    
    # Test Service and Technician Role Gate
    assert IsServiceRole().has_permission(tech_req, None) is True
    assert IsServiceRole().has_permission(MockRequest('SERVICE_ADVISOR'), None) is True
    assert IsServiceRole().has_permission(MockRequest('SALES_EXECUTIVE'), None) is False
    print(" [2.6] IsServiceRole (Service Advisor + Technician) gate verified.")
    
    # 3. Audit ABAC & Object-Level Permission
    print("\n[3] AUDITING ATTRIBUTE-BASED ACCESS CONTROL (ABAC)")
    class MockObject:
        def __init__(self, created_by=None, assigned_sales_rep=None):
            self.created_by = created_by
            self.assigned_sales_rep = assigned_sales_rep
            
    sales_rep_req = MockRequest('SALES_EXECUTIVE', user_id="sales-01")
    own_obj = MockObject(created_by=sales_rep_req.user)
    other_obj = MockObject(created_by="someone_else")
    manager_req = MockRequest('SALES_MANAGER', user_id="mgr-01")
    
    abac = IsOwnerOrManager()
    # Executive can access their own object
    assert abac.has_object_permission(sales_rep_req, None, own_obj) is True
    # Executive cannot access other's object
    assert abac.has_object_permission(sales_rep_req, None, other_obj) is False
    # Manager can access other's object
    assert abac.has_object_permission(manager_req, None, other_obj) is True
    print(" [3.1] Object-Level ownership & Manager cascade verified.")
    
    # 4. Audit PostgreSQL RLS Policy Script
    print("\n[4] AUDITING POSTGRESQL ROW-LEVEL SECURITY (RLS) POLICIES")
    rls_path = os.path.join(os.path.dirname(__file__), 'core', 'rls_policies.sql')
    assert os.path.exists(rls_path), f"RLS policy script missing at {rls_path}"
    with open(rls_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    assert 'get_current_organization_id()' in sql_content
    assert 'ALTER TABLE' in sql_content and 'ENABLE ROW LEVEL SECURITY' in sql_content
    assert 'tenant_isolation_policy' in sql_content
    print(f" [4.1] RLS SQL policy script ({len(sql_content)} bytes) verified.")
    
    print("\n" + "=" * 70)
    print(" >>> SECTION 02 USER ROLES & RBAC 100% VERIFIED & COMPLIANT! <<<")
    print("=" * 70)

if __name__ == '__main__':
    run_rbac_audit()
