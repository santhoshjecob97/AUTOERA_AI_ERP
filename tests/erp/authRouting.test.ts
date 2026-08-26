import { describe, it, expect } from 'vitest';
import { getDashboardForUser } from '../../services/roleRouter';
import { mapDjangoUser } from '../../context/AuthContext';
import { User } from '../../types';

describe('AutoEra AI ERP — Role-Based Routing & Context Verification', () => {

  it('routes General Manager to Overview Dashboard', () => {
    const user: User = {
      id: '1',
      username: 'gm_apex',
      name: 'Anand Nambiar',
      email: 'gm@apex.in',
      role: 'General Manager',
      avatar: '',
      permissions: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'plans'],
    };
    expect(getDashboardForUser(user)).toBe('/');
  });

  it('routes Service Advisor to Service Operations Dashboard', () => {
    const user: User = {
      id: '2',
      username: 'sa_apex',
      name: 'Karthik Swaminathan',
      email: 'sa@apex.in',
      role: 'Service Advisor',
      avatar: '',
      permissions: ['dashboard', 'service', 'service-ai', 'plans'],
    };
    expect(getDashboardForUser(user)).toBe('/service');
  });

  it('routes Technician to Workshop Bays Dashboard', () => {
    const user: User = {
      id: '3',
      username: 'tech_apex',
      name: 'Suresh Babu',
      email: 'tech@apex.in',
      role: 'Technician',
      avatar: '',
      permissions: ['dashboard', 'service', 'service-ai'],
    };
    expect(getDashboardForUser(user)).toBe('/service/bays');
  });

  it('routes Sales Manager to Sales Engine Dashboard', () => {
    const user: User = {
      id: '4',
      username: 'salesm_apex',
      name: 'Priya Sharma',
      email: 'salesm@apex.in',
      role: 'Sales Manager',
      avatar: '',
      permissions: ['dashboard', 'sales', 'sales-ai', 'plans'],
    };
    expect(getDashboardForUser(user)).toBe('/sales');
  });

  it('routes Finance Officer to Finance Engine Dashboard', () => {
    const user: User = {
      id: '5',
      username: 'fin_apex',
      name: 'Deepak Shenoy',
      email: 'fin@apex.in',
      role: 'Finance Officer',
      avatar: '',
      permissions: ['dashboard', 'finance', 'finance-ai', 'plans'],
    };
    expect(getDashboardForUser(user)).toBe('/finance');
  });

  it('routes Insurance Officer to Insurance Engine Dashboard', () => {
    const user: User = {
      id: '6',
      username: 'ins_apex',
      name: 'Sneha Patel',
      email: 'ins@apex.in',
      role: 'Insurance Officer',
      avatar: '',
      permissions: ['dashboard', 'insurance', 'insurance-ai', 'plans'],
    };
    expect(getDashboardForUser(user)).toBe('/insurance');
  });

  it('maps Django user API payload to strongly-typed AppUser with tenant scope', () => {
    const djangoUserPayload = {
      id: 'c17e06a3-059a-4c28-bb83-8a0df7f29b4e',
      username: 'sa_apex',
      email: 'sa@apex.in',
      first_name: 'Karthik',
      last_name: 'Swaminathan',
      role: 'SERVICE_ADVISOR',
      organization: '9f24eb09-d3e9-4e56-913a-a11488c5efb0',
      organization_name: 'Apex Mobility Group',
      branch: '6224ce34-ec20-410a-9d9e-1087e382fa66',
      branch_name: 'Indiranagar Main Showroom',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    };

    const mapped = mapDjangoUser(djangoUserPayload);
    expect(mapped.name).toBe('Karthik Swaminathan');
    expect(mapped.role).toBe('Service Advisor');
    expect(mapped.department).toBe('Service & Workshop');
    expect(mapped.organizationName).toBe('Apex Mobility Group');
    expect(mapped.permissions).toContain('service');
    expect(mapped.permissions).toContain('service-ai');
  });

});
