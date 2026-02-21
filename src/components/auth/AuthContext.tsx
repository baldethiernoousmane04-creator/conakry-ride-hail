import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
  updateRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userRole = (session.user.user_metadata.role as UserRole) || 'customer';
          setRole(userRole);
          localStorage.setItem('wongaye_role', userRole);
        } else {
          const savedRole = localStorage.getItem('wongaye_role') as UserRole;
          if (savedRole) setRole(savedRole);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userRole = (session.user.user_metadata.role as UserRole) || 'customer';
        setRole(userRole);
        localStorage.setItem('wongaye_role', userRole);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('wongaye_role', newRole);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};