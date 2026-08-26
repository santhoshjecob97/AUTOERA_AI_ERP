import { User } from '../types';

/**
 * Centralized Dealership Role-Based Dashboard Routing Algorithm
 * Determines the authoritative initial landing page for each authenticated user
 */
export const getDashboardForUser = (user: User | null): string => {
  if (!user) return '/';

  const role = user.role;
  const dept = user.department || '';

  // 1. Executive Management
  if (
    role === 'General Manager' ||
    role === 'Super Admin' ||
    role === 'Enterprise Admin' ||
    role === 'Dealer Principal'
  ) {
    return '/';
  }

  // 2. Service & Workshop
  if (role === 'Service Manager' || role === 'Service Advisor') {
    return '/service';
  }

  if (role === 'Technician') {
    return '/service/bays';
  }

  if (role === 'Parts Manager') {
    return '/service/inventory';
  }

  // 3. Sales & Showroom
  if (role === 'Sales Manager' || role === 'Sales Executive') {
    return '/sales';
  }

  // 4. Finance & Accounts
  if (role === 'Finance Officer') {
    return '/finance';
  }

  // 5. Insurance & Claims
  if (role === 'Insurance Officer') {
    return '/insurance';
  }

  // Department fallback
  if (dept.includes('Service') || dept.includes('Workshop')) return '/service';
  if (dept.includes('Sales')) return '/sales';
  if (dept.includes('Finance')) return '/finance';
  if (dept.includes('Insurance')) return '/insurance';

  return '/';
};
