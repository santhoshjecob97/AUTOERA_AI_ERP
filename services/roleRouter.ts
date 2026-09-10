import { User } from '../types';

/**
 * Centralized Dealership Role-Based Dashboard Routing Algorithm
 * Determines the authoritative initial landing page for each authenticated user.
 * Covers all 16 roles per Master Architecture Section 02 (L0–L7 hierarchy).
 */
export const getDashboardForUser = (user: User | null): string => {
  if (!user) return '/';

  const role = user.role;
  const dept = user.department || '';

  // L0–L3: Executive Management — Full dashboard
  if (
    role === 'General Manager' ||
    role === 'Super Admin' ||
    role === 'Enterprise Admin' ||
    role === 'Dealer Principal'
  ) {
    return '/';
  }

  // L3: OEM User — Network overview
  if (role === 'OEM User') {
    return '/';
  }

  // L4: Service & Workshop Management
  if (role === 'Service Manager' || role === 'Service Advisor') {
    return '/service';
  }

  // L4: Fleet Management
  if (role === 'Fleet Manager') {
    return '/fleet';
  }

  // L4: Parts Manager
  if (role === 'Parts Manager') {
    return '/service/inventory';
  }

  // L6: Technician — Direct to bays
  if (role === 'Technician') {
    return '/service/bays';
  }

  // L4–L5: Sales & CRM
  if (role === 'Sales Manager' || role === 'Sales Executive' || role === 'CRM Executive') {
    return '/sales';
  }

  // L5: Finance
  if (role === 'Finance Officer') {
    return '/finance';
  }

  // L5: Insurance
  if (role === 'Insurance Executive') {
    return '/insurance';
  }

  // L7: Vehicle Owner — Customer portal
  if (role === 'Vehicle Owner') {
    return '/ev';
  }

  // Department fallback
  if (dept.includes('Service') || dept.includes('Workshop')) return '/service';
  if (dept.includes('Sales')) return '/sales';
  if (dept.includes('Finance')) return '/finance';
  if (dept.includes('Insurance')) return '/insurance';
  if (dept.includes('Fleet')) return '/fleet';

  return '/';
};
