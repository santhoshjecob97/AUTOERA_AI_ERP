import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../src/lib/supabase';
import { User as AppUser, UserRole } from '../types';
import { Session } from '@supabase/supabase-js';

// Map Supabase user to AppUser
const mapSupabaseUser = (session: Session | null): AppUser | null => {
  if (!session?.user) return null;

  const { user } = session;
  const metadata = user.user_metadata || {};

  return {
    id: user.id,
    name: metadata.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: (metadata.role as UserRole) || 'General Manager',
    avatar: metadata.avatar_url,
    permissions: ['dashboard', 'sales', 'service', 'finance', 'insurance', 'workforce', 'fleet', 'plans'] as any[]
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

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session));
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates: Partial<AppUser>): Promise<void> => {
    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.name,
        // Add other metadata updates here
      }
    });

    if (error) throw error;
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
