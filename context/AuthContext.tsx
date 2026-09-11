import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User as AppUser, UserRole, ViewState } from '../types';
import apiService from '../services/api';

/**
 * Role to ViewState Permissions Mapping — 16 Roles (Section 02)
 */
const ALL_EXECUTIVE_MODULES: ViewState[] = [
  'dashboard', 'daily-checklists', 'customer-360', 'vehicle-360', 'complaints',
  'sales', 'desking', 'sales-targets', 'used-cars',
  'service', 'workshop-command',
  'finance', 'general-ledger', 'insurance',
  'workforce', 'fleet', 'ev', 'oem', 'developer',
  'ai-os', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai', 'fleet-ai', 'workforce-ai', 'ev-ai', 'voice-ai',
  'database-arch', 'backend-arch', 'tech-stack', 'security', 'mobile-app', 'plans'
];

const ROLE_PERMISSIONS_MAP: Record<string, ViewState[]> = {
  // Corporate
  DEALER_PRINCIPAL: ALL_EXECUTIVE_MODULES,
  CEO: ALL_EXECUTIVE_MODULES,
  COO: ALL_EXECUTIVE_MODULES,
  CFO: ['dashboard', 'finance', 'general-ledger', 'insurance', 'sales', 'service', 'daily-checklists', 'plans'],
  CTO: ALL_EXECUTIVE_MODULES,
  GROUP_HR_HEAD: ['dashboard', 'workforce', 'workforce-ai', 'daily-checklists', 'plans'],
  GROUP_SALES_HEAD: ['dashboard', 'sales', 'sales-ai', 'desking', 'sales-targets', 'used-cars', 'customer-360', 'plans'],
  GROUP_SERVICE_HEAD: ['dashboard', 'service', 'service-ai', 'workshop-command', 'vehicle-360', 'parts-ai' as any, 'fleet', 'ev', 'plans'],
  SUPER_ADMIN: ALL_EXECUTIVE_MODULES,
  ENTERPRISE_ADMIN: ALL_EXECUTIVE_MODULES,
  OEM_USER: ['dashboard', 'oem', 'sales', 'service', 'fleet', 'ev', 'plans', 'vehicle-360'],

  // Branch Leadership
  BRANCH_MANAGER: ALL_EXECUTIVE_MODULES,
  GENERAL_MANAGER: ALL_EXECUTIVE_MODULES,
  SALES_MANAGER: ['dashboard', 'sales', 'sales-ai', 'workforce', 'plans', 'customer-360', 'vehicle-360', 'desking', 'sales-targets', 'used-cars', 'daily-checklists', 'complaints'],
  SERVICE_MANAGER: ['dashboard', 'service', 'service-ai', 'workforce', 'plans', 'customer-360', 'vehicle-360', 'workshop-command', 'daily-checklists', 'complaints'],
  WORKSHOP_MANAGER: ['dashboard', 'service', 'service-ai', 'workshop-command', 'vehicle-360', 'customer-360', 'daily-checklists'],
  PARTS_MANAGER: ['dashboard', 'service', 'service-ai', 'plans', 'workshop-command', 'vehicle-360', 'daily-checklists'],
  FINANCE_MANAGER: ['dashboard', 'finance', 'finance-ai', 'general-ledger', 'desking', 'plans', 'customer-360', 'vehicle-360'],
  INSURANCE_MANAGER: ['dashboard', 'insurance', 'insurance-ai', 'plans', 'customer-360', 'vehicle-360', 'complaints'],
  USED_CAR_MANAGER: ['dashboard', 'used-cars', 'sales', 'sales-ai', 'desking', 'plans', 'customer-360', 'vehicle-360'],
  CRM_MANAGER: ['dashboard', 'customer-360', 'vehicle-360', 'sales', 'sales-ai', 'complaints', 'plans'],
  HR_MANAGER: ['dashboard', 'workforce', 'workforce-ai', 'daily-checklists', 'plans'],
  FLEET_MANAGER: ['dashboard', 'fleet', 'fleet-ai', 'ev', 'plans', 'vehicle-360', 'customer-360'],

  // Operational
  SALES_EXECUTIVE: ['dashboard', 'sales', 'sales-ai', 'plans', 'customer-360', 'vehicle-360', 'desking'],
  TELECALLER: ['dashboard', 'sales', 'sales-ai', 'customer-360', 'vehicle-360', 'voice-ai'],
  CRM_EXECUTIVE: ['dashboard', 'sales', 'sales-ai', 'plans', 'customer-360', 'vehicle-360', 'complaints'],
  SERVICE_ADVISOR: ['dashboard', 'service', 'service-ai', 'plans', 'customer-360', 'vehicle-360', 'workshop-command', 'complaints'],
  TECHNICIAN: ['dashboard', 'service', 'service-ai', 'workshop-command', 'vehicle-360'],
  WARRANTY_EXECUTIVE: ['dashboard', 'service', 'service-ai', 'vehicle-360', 'customer-360', 'plans'],
  PARTS_EXECUTIVE: ['dashboard', 'service', 'workshop-command', 'vehicle-360', 'plans'],
  STOREKEEPER: ['dashboard', 'service', 'plans'],
  INSURANCE_EXECUTIVE: ['dashboard', 'insurance', 'insurance-ai', 'plans', 'customer-360', 'vehicle-360'],
  FINANCE_EXECUTIVE: ['dashboard', 'finance', 'finance-ai', 'plans', 'desking', 'customer-360'],
  FINANCE_OFFICER: ['dashboard', 'finance', 'finance-ai', 'plans', 'general-ledger', 'desking', 'customer-360'],
  USED_CAR_EXECUTIVE: ['dashboard', 'used-cars', 'desking', 'plans', 'customer-360', 'vehicle-360'],
  EV_TECHNICIAN: ['dashboard', 'ev', 'ev-ai', 'service', 'workshop-command', 'vehicle-360'],
  DRIVER: ['dashboard', 'fleet', 'vehicle-360'],
  ADMIN: ALL_EXECUTIVE_MODULES,
  VEHICLE_OWNER: ['dashboard', 'ev', 'plans', 'vehicle-360'],
};

const ROLE_DISPLAY_MAP: Record<string, UserRole> = {
  // Corporate
  DEALER_PRINCIPAL: 'Dealer Principal',
  CEO: 'CEO',
  COO: 'COO',
  CFO: 'CFO',
  CTO: 'CTO',
  GROUP_HR_HEAD: 'Group HR Head',
  GROUP_SALES_HEAD: 'Group Sales Head',
  GROUP_SERVICE_HEAD: 'Group Service Head',
  SUPER_ADMIN: 'Super Admin',
  ENTERPRISE_ADMIN: 'Enterprise Admin',
  OEM_USER: 'OEM User',

  // Branch
  BRANCH_MANAGER: 'Branch Manager',
  GENERAL_MANAGER: 'General Manager',
  SALES_MANAGER: 'Sales Manager',
  SERVICE_MANAGER: 'Service Manager',
  WORKSHOP_MANAGER: 'Workshop Manager',
  PARTS_MANAGER: 'Parts Manager',
  FINANCE_MANAGER: 'Finance Manager',
  INSURANCE_MANAGER: 'Insurance Manager',
  USED_CAR_MANAGER: 'Used Car Manager',
  CRM_MANAGER: 'CRM Manager',
  HR_MANAGER: 'HR Manager',
  FLEET_MANAGER: 'Fleet Manager',

  // Operational
  SALES_EXECUTIVE: 'Sales Executive',
  TELECALLER: 'Telecaller',
  CRM_EXECUTIVE: 'CRM Executive',
  SERVICE_ADVISOR: 'Service Advisor',
  TECHNICIAN: 'Technician',
  WARRANTY_EXECUTIVE: 'Warranty Executive',
  PARTS_EXECUTIVE: 'Parts Executive',
  STOREKEEPER: 'Storekeeper',
  INSURANCE_EXECUTIVE: 'Insurance Executive',
  FINANCE_EXECUTIVE: 'Finance Executive',
  FINANCE_OFFICER: 'Finance Officer',
  USED_CAR_EXECUTIVE: 'Used Car Executive',
  EV_TECHNICIAN: 'EV Technician',
  DRIVER: 'Driver',
  ADMIN: 'Admin',
  VEHICLE_OWNER: 'Vehicle Owner',
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

export const PILOT_DEMO_USERS: Record<string, AppUser> = {
  GENERAL_MANAGER: {
    id: 'pilot-gm-01',
    username: 'gm_apex',
    name: 'Anand Nambiar',
    email: 'gm@apexmobility.in',
    role: 'General Manager',
    avatar: '',
    permissions: [
      'dashboard', 'daily-checklists', 'customer-360', 'vehicle-360', 'complaints',
      'sales', 'desking', 'sales-targets', 'used-cars',
      'service', 'workshop-command',
      'finance', 'general-ledger', 'insurance',
      'workforce', 'fleet', 'ev', 'oem', 'developer',
      'ai-os', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai', 'fleet-ai', 'workforce-ai', 'ev-ai', 'voice-ai',
      'database-arch', 'backend-arch', 'tech-stack', 'security', 'mobile-app', 'plans'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'General Management'
  },
  SALES_MANAGER: {
    id: 'pilot-sm-01',
    username: 'salesm_apex',
    name: 'Rajesh Sharma',
    email: 'sales.manager@apexmobility.in',
    role: 'Sales Manager',
    avatar: '',
    permissions: [
      'dashboard', 'daily-checklists', 'customer-360', 'complaints',
      'sales', 'desking', 'sales-targets', 'used-cars',
      'ai-os', 'sales-ai', 'service-ai', 'workforce', 'plans'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'Sales & Showroom'
  },
  SERVICE_ADVISOR: {
    id: 'pilot-sa-01',
    username: 'sa_apex',
    name: 'Arun Sundaram',
    email: 'service.advisor@apexmobility.in',
    role: 'Service Advisor',
    avatar: '',
    permissions: [
      'dashboard', 'daily-checklists', 'customer-360', 'vehicle-360', 'complaints',
      'service', 'workshop-command',
      'ai-os', 'service-ai', 'plans'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'Service & Workshop'
  },
  TECHNICIAN: {
    id: 'pilot-tech-01',
    username: 'tech_apex',
    name: 'K. Karthik',
    email: 'technician@apexmobility.in',
    role: 'Technician',
    avatar: '',
    permissions: [
      'dashboard', 'vehicle-360', 'service', 'workshop-command',
      'ai-os', 'service-ai'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'Workshop Engineering'
  },
  FINANCE_OFFICER: {
    id: 'pilot-fin-01',
    username: 'fin_apex',
    name: 'Sunita Rao',
    email: 'finance@apexmobility.in',
    role: 'Finance Officer',
    avatar: '',
    permissions: [
      'dashboard', 'daily-checklists', 'customer-360',
      'finance', 'general-ledger', 'desking',
      'ai-os', 'finance-ai', 'service-ai', 'plans'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'Finance & Accounts'
  },
  INSURANCE_EXECUTIVE: {
    id: 'pilot-ins-01',
    username: 'ins_apex',
    name: 'Divya Menon',
    email: 'insurance@apexmobility.in',
    role: 'Insurance Executive',
    avatar: '',
    permissions: [
      'dashboard', 'daily-checklists', 'customer-360', 'complaints',
      'insurance',
      'ai-os', 'insurance-ai', 'service-ai', 'plans'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'Insurance & Claims'
  },
  SUPER_ADMIN: {
    id: 'pilot-admin-01',
    username: 'admin_apex',
    name: 'Vikram Malhotra',
    email: 'admin@apexmobility.in',
    role: 'Super Admin',
    avatar: '',
    permissions: [
      'dashboard', 'daily-checklists', 'customer-360', 'vehicle-360', 'complaints',
      'sales', 'desking', 'sales-targets', 'used-cars',
      'service', 'workshop-command',
      'finance', 'general-ledger', 'insurance',
      'workforce', 'fleet', 'ev', 'oem', 'developer',
      'ai-os', 'service-ai', 'sales-ai', 'finance-ai', 'insurance-ai', 'fleet-ai', 'workforce-ai', 'ev-ai', 'voice-ai',
      'database-arch', 'backend-arch', 'tech-stack', 'security', 'mobile-app', 'plans'
    ],
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: 'Platform Engineering'
  }
};

export const getOrCreatePilotUser = (roleIdentifier: string): AppUser => {
  if (PILOT_DEMO_USERS[roleIdentifier]) {
    return PILOT_DEMO_USERS[roleIdentifier];
  }

  const byRole = Object.values(PILOT_DEMO_USERS).find(u => u.role === roleIdentifier);
  if (byRole) return byRole;

  const roleKey = Object.entries(ROLE_DISPLAY_MAP).find(([key, disp]) => 
    key === roleIdentifier || disp === roleIdentifier
  )?.[0] || roleIdentifier.toUpperCase().replace(/\s+/g, '_');

  const roleDisplay = ROLE_DISPLAY_MAP[roleKey] || (roleIdentifier as UserRole) || 'General Manager';
  const permissions = ROLE_PERMISSIONS_MAP[roleKey] || ['dashboard', 'service', 'sales', 'finance', 'insurance', 'plans'];

  return {
    id: `pilot-${roleKey.toLowerCase().replace(/_/g, '-')}-01`,
    username: `${roleKey.toLowerCase()}_apex`,
    name: `Apex ${roleDisplay}`,
    email: `${roleKey.toLowerCase().replace(/_/g, '.')}@apexmobility.in`,
    role: roleDisplay,
    avatar: '',
    permissions: permissions,
    organizationId: 'org-apex-01',
    organizationName: 'Apex Mobility Group',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Main (BLR)',
    department: roleDisplay.includes('Sales') || roleDisplay.includes('Telecaller') ? 'Sales & Showroom' :
                roleDisplay.includes('Service') || roleDisplay.includes('Technician') || roleDisplay.includes('Workshop') || roleDisplay.includes('Parts') ? 'Service & Workshop' :
                roleDisplay.includes('Finance') ? 'Finance & Accounts' :
                roleDisplay.includes('Insurance') ? 'Insurance & Claims' :
                roleDisplay.includes('HR') ? 'Human Resources' : 'General Management'
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
  switchRole: (role: UserRole) => void;
  retryInit: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('INITIALIZING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initAuth = useCallback(async () => {
    // Check for saved pilot role or auth token
    const savedPilotRole = localStorage.getItem('pilotRole');
    const token = localStorage.getItem('authToken');

    if (savedPilotRole) {
      const userProfile = getOrCreatePilotUser(savedPilotRole);
      setUser(userProfile);
      setAuthStatus('AUTHENTICATED');
      return;
    }

    if (!token) {
      // Default to General Manager pilot session for instant seamless demo access on Vercel
      const defaultUser = PILOT_DEMO_USERS.GENERAL_MANAGER;
      setUser(defaultUser);
      localStorage.setItem('pilotRole', 'GENERAL_MANAGER');
      setAuthStatus('AUTHENTICATED');
      return;
    }

    setAuthStatus('INITIALIZING');
    setErrorMessage(null);

    // Timeout safeguard for backend cold start or network delay (3s timeout)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout to AutoEra API server')), 3000)
    );

    try {
      const fetchProfilePromise = apiService.get<any>('/api/v1/auth/me/');
      const userData = await Promise.race([fetchProfilePromise, timeoutPromise]);
      
      const mappedUser = mapDjangoUser(userData);
      setUser(mappedUser);
      setAuthStatus('AUTHENTICATED');
    } catch (err: any) {
      console.warn('Auth initialization fallback to pilot demo profile:', err?.message || err);
      // Fallback seamlessly to General Manager demo user so Vercel never breaks
      const fallbackUser = PILOT_DEMO_USERS.GENERAL_MANAGER;
      setUser(fallbackUser);
      setAuthStatus('AUTHENTICATED');
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
    const cleaned = usernameOrEmail.trim().toLowerCase();

    // Direct Pilot Quick Match check
    const roleKeyMap: Record<string, string> = {
      'gm_apex': 'GENERAL_MANAGER',
      'salesm_apex': 'SALES_MANAGER',
      'sa_apex': 'SERVICE_ADVISOR',
      'tech_apex': 'TECHNICIAN',
      'fin_apex': 'FINANCE_OFFICER',
      'ins_apex': 'INSURANCE_EXECUTIVE',
      'admin_apex': 'SUPER_ADMIN',
      'gm@apex.in': 'GENERAL_MANAGER',
      'gm@apexmobility.in': 'GENERAL_MANAGER',
      'sales@apexmobility.in': 'SALES_MANAGER',
      'service@apexmobility.in': 'SERVICE_ADVISOR',
    };

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
      localStorage.removeItem('pilotRole');
      setAuthStatus('AUTHENTICATED');
      return mappedUser;
    } catch (error: any) {
      console.warn('Backend login unavailable, switching to Pilot Demo User:', error?.message);
      
      // Look up pilot profile or default to General Manager
      const roleKey = roleKeyMap[cleaned] || 
        (cleaned.includes('sale') ? 'SALES_MANAGER' :
         cleaned.includes('tech') ? 'TECHNICIAN' :
         cleaned.includes('serv') || cleaned.includes('sa') ? 'SERVICE_ADVISOR' :
         cleaned.includes('fin') ? 'FINANCE_OFFICER' :
         cleaned.includes('ins') ? 'INSURANCE_EXECUTIVE' : 'GENERAL_MANAGER');

      const pilotUser = PILOT_DEMO_USERS[roleKey] || PILOT_DEMO_USERS.GENERAL_MANAGER;
      localStorage.setItem('pilotRole', roleKey);
      setUser(pilotUser);
      setAuthStatus('AUTHENTICATED');
      return pilotUser;
    }
  };

  const switchRole = (role: UserRole): void => {
    const pilotUser = getOrCreatePilotUser(role);
    localStorage.setItem('pilotRole', pilotUser.role);
    setUser(pilotUser);
    setAuthStatus('AUTHENTICATED');
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('pilotRole');
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
    switchRole,
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
