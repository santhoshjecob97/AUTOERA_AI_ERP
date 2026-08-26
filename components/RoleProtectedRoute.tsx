import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';
import AccessDenied from './AccessDenied';

interface RoleProtectedRouteProps {
  permission: ViewState;
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

  // Super Admin / General Manager have universal access
  if (
    user.role === 'Super Admin' ||
    user.role === 'General Manager' ||
    user.role === 'Enterprise Admin' ||
    user.role === 'Dealer Principal'
  ) {
    return <>{children}</>;
  }

  // Check specific permission in user context
  const hasPermission = user.permissions?.includes(permission);

  if (!hasPermission) {
    return <AccessDenied requiredPermission={permission} />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
