import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as AppUser, UserRole } from '../types';
import apiService from '../services/api';

/**
 * AuthContext — Django JWT Authentication
 *
 * Authentication flow:
 *   1. User submits email + password
 *   2. POST /api/v1/auth/login/ → { access, refresh, user }
 *   3. Tokens stored in localStorage
 *   4. api.ts interceptor injects Bearer token on every request
 *   5. On 401, token is cleared and user redirected to login
 */

// Map Django user response to frontend AppUser
const mapDjangoUser = (data: any): AppUser => {
  return {
    id: data.id,
    name: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || 'User',
    email: data.email || '',
    role: (data.role as UserRole) || 'General Manager',
    avatar: data.avatar_url,
    permissions: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'plans'] as any[],
  };
};

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a valid token and fetch user profile
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token by fetching current user profile
        const userData = await apiService.get<any>('/api/v1/auth/me/');
        setUser(mapDjangoUser(userData));
      } catch {
        // Token invalid or expired — clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Django LoginView expects { username, password }
      // We accept email from the UI and send it as username
      const response = await apiService.post<{
        access: string;
        refresh: string;
        user: any;
      }>('/api/v1/auth/login/', {
        username: email,
        password,
      });

      // Store JWT tokens
      localStorage.setItem('authToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);

      // Map and set user
      setUser(mapDjangoUser(response.user));
    } catch (error: any) {
      setIsLoading(false);
      // Extract error message from Django response
      const message =
        error?.details?.error?.non_field_errors?.[0] ||
        error?.details?.error ||
        error?.message ||
        'Invalid email or password.';
      throw new Error(typeof message === 'string' ? message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const updateUser = async (updates: Partial<AppUser>): Promise<void> => {
    if (!user) return;
    // Future: call PATCH /api/v1/auth/me/ or /api/v1/users/{id}/
    setUser({ ...user, ...updates });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
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
