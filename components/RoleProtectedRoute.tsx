import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';
import AccessDenied from './AccessDenied';

interface RoleProtectedRouteProps {
  permission: ViewState | ViewState[];
  children: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  permission,
  children,
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Corporate Leadership / Super Admin / General Manager have universal operational access
  if (
    user.role === 'Super Admin' ||
    user.role === 'General Manager' ||
    user.role === 'Branch Manager' ||
    user.role === 'Enterprise Admin' ||
    user.role === 'Dealer Principal' ||
    user.role === 'CEO' ||
    user.role === 'COO' ||
    user.role === 'CTO' ||
    user.role === 'Admin' ||
    (user.role === 'OEM User' && (permission === 'oem' || (Array.isArray(permission) && permission.includes('oem')))) ||
    permission === 'developer' ||
    (Array.isArray(permission) && permission.includes('developer'))
  ) {
    return <>{children}</>;
  }

  // Check specific permission in user context
  const perms = Array.isArray(permission) ? permission : [permission];
  const hasPermission = perms.some(p => user.permissions?.includes(p));

  if (!hasPermission) {
    return <AccessDenied requiredPermission={perms[0]} />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
