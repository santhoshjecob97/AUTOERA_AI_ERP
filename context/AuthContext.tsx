import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User as AppUser, UserRole, ViewState } from '../types';
import apiService from '../services/api';

/**
 * Role to ViewState Permissions Mapping
 */
const ROLE_PERMISSIONS_MAP: Record<string, ViewState[]> = {
  SUPER_ADMIN: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'ev', 'plans', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai', 'fleet-ai', 'workforce-ai', 'ev-ai', 'voice-ai'],
  ENTERPRISE_ADMIN: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'ev', 'plans', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai', 'fleet-ai', 'workforce-ai', 'ev-ai', 'voice-ai'],
  DEALER_PRINCIPAL: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'plans', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai'],
  GENERAL_MANAGER: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'plans', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai'],
  SERVICE_MANAGER: ['dashboard', 'service', 'service-ai', 'workforce', 'plans'],
  SERVICE_ADVISOR: ['dashboard', 'service', 'service-ai', 'plans'],
  TECHNICIAN: ['dashboard', 'service', 'service-ai'],
  SALES_MANAGER: ['dashboard', 'sales', 'sales-ai', 'workforce', 'plans'],
  SALES_EXECUTIVE: ['dashboard', 'sales', 'sales-ai', 'plans'],
  PARTS_MANAGER: ['dashboard', 'service', 'service-ai', 'plans'],
  FINANCE_OFFICER: ['dashboard', 'finance', 'finance-ai', 'plans'],
  INSURANCE_OFFICER: ['dashboard', 'insurance', 'insurance-ai', 'plans'],
};

const ROLE_DISPLAY_MAP: Record<string, UserRole> = {
  SUPER_ADMIN: 'Super Admin',
  ENTERPRISE_ADMIN: 'Enterprise Admin',
  DEALER_PRINCIPAL: 'Dealer Principal',
  GENERAL_MANAGER: 'General Manager',
  SERVICE_MANAGER: 'Service Manager',
  SERVICE_ADVISOR: 'Service Advisor',
  TECHNICIAN: 'Technician',
  SALES_MANAGER: 'Sales Manager',
  SALES_EXECUTIVE: 'Sales Executive',
  PARTS_MANAGER: 'Parts Manager',
  FINANCE_OFFICER: 'Finance Officer',
  INSURANCE_OFFICER: 'Insurance Officer',
};

// Map Django user response to frontend AppUser
export const mapDjangoUser = (data: any): AppUser => {
  const rawRole = (data.role || 'GENERAL_MANAGER').toUpperCase();
  const roleDisplay = ROLE_DISPLAY_MAP[rawRole] || (data.role as UserRole) || 'General Manager';
  const permissions = ROLE_PERMISSIONS_MAP[rawRole] || ['dashboard', 'service', 'sales', 'finance', 'insurance', 'plans'];

  return {
    id: String(data.id),
    username: data.username || '',
    name: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || 'Dealership User',
    email: data.email || '',
    role: roleDisplay,
    avatar: data.avatar_url || '',
    permissions,
    organizationId: data.organization ? String(data.organization) : undefined,
    organizationName: data.organization_name || 'Apex Mobility Group',
    branchId: data.branch ? String(data.branch) : undefined,
    branchName: data.branch_name || 'Indiranagar Main Branch',
    department: roleDisplay.includes('Service') || roleDisplay === 'Technician' ? 'Service & Workshop' :
                roleDisplay.includes('Sales') ? 'Sales & Showroom' :
                roleDisplay.includes('Finance') ? 'Finance & Accounts' :
                roleDisplay.includes('Insurance') ? 'Insurance & Claims' : 'General Management',
  };
};

export type AuthStatus = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR';

interface AuthContextType {
  user: AppUser | null;
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<AppUser>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => Promise<void>;
  retryInit: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('INITIALIZING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setAuthStatus('UNAUTHENTICATED');
      return;
    }

    setAuthStatus('INITIALIZING');
    setErrorMessage(null);

    // Timeout safeguard for backend cold start or network delay (5s timeout)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout to AutoEra API server')), 5000)
    );

    try {
      const fetchProfilePromise = apiService.get<any>('/api/v1/auth/me/');
      const userData = await Promise.race([fetchProfilePromise, timeoutPromise]);
      
      const mappedUser = mapDjangoUser(userData);
      setUser(mappedUser);
      setAuthStatus('AUTHENTICATED');
    } catch (err: any) {
      console.warn('Auth initialization error:', err?.message || err);
      // If unauthorized, clear tokens
      if (err?.status === 401 || err?.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAuthStatus('UNAUTHENTICATED');
      } else {
        // Network timeout / offline server
        setErrorMessage(err?.message || 'Unable to connect to AutoEra AI ERP backend.');
        setAuthStatus('UNAUTHENTICATED');
      }
    }
  }, []);

  // Listen for unauthorized events emitted by api.ts
  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setAuthStatus('UNAUTHENTICATED');
    };

    window.addEventListener('autoera:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('autoera:unauthorized', handleUnauthorized);
    };
  }, [initAuth]);

  const login = async (usernameOrEmail: string, password: string): Promise<AppUser> => {
    setErrorMessage(null);
    try {
      const response = await apiService.post<{
        access: string;
        refresh: string;
        user: any;
      }>('/api/v1/auth/login/', {
        username: usernameOrEmail.trim(),
        password,
      });

      if (!response?.access) {
        throw new Error('Invalid response from authentication server.');
      }

      localStorage.setItem('authToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }

      const mappedUser = mapDjangoUser(response.user);
      setUser(mappedUser);
      setAuthStatus('AUTHENTICATED');
      return mappedUser;
    } catch (error: any) {
      const msg = error?.message || error?.details?.error || 'Invalid credentials or connection error.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Authentication failed.');
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAuthStatus('UNAUTHENTICATED');
    setErrorMessage(null);
  };

  const updateUser = async (updates: Partial<AppUser>): Promise<void> => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const value: AuthContextType = {
    user,
    authStatus,
    isAuthenticated: authStatus === 'AUTHENTICATED' && !!user,
    isLoading: authStatus === 'INITIALIZING',
    errorMessage,
    login,
    logout,
    updateUser,
    retryInit: initAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
