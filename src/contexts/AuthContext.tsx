'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext<any>({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  // Returns true if admin, false otherwise
  // Uses SECURITY DEFINER RPC to bypass RLS — most reliable approach
  const fetchAdminStatus = async (userId: string, authUser?: any): Promise<boolean> => {
    try {
      // Primary check: call SECURITY DEFINER RPC function (bypasses RLS)
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('check_user_is_admin', { p_user_id: userId });

      if (!rpcError && rpcResult === true) {
        setIsAdmin(true);
        return true;
      }

      // Fallback: direct table query (may be blocked by RLS, but worth trying)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
        return true;
      }

      // Last resort: check auth metadata
      const userToCheck = authUser;
      if (userToCheck) {
        const metaRole =
          userToCheck.app_metadata?.role ||
          userToCheck.user_metadata?.role ||
          userToCheck.raw_app_meta_data?.role ||
          userToCheck.raw_user_meta_data?.role;
        if (metaRole === 'admin') {
          setIsAdmin(true);
          return true;
        }
      }

      setIsAdmin(false);
      return false;
    } catch {
      setIsAdmin(false);
      return false;
    }
  };

  // Ensure a user_profiles row exists for OAuth users (Google sign-in)
  const ensureUserProfile = async (authUser: any) => {
    if (!authUser) return;
    try {
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (!existing) {
        // Profile doesn't exist yet — create it (trigger may have missed it)
        await supabase.from('user_profiles').insert({
          id: authUser.id,
          email: authUser.email || '',
          full_name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split('@')[0] ||
            'User',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          role: 'customer',
        });
      }
    } catch {
      // Ignore — profile may already exist or trigger handled it
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        ensureUserProfile(session.user);
        fetchAdminStatus(session.user.id, session.user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await ensureUserProfile(session.user);
        await fetchAdminStatus(session.user.id, session.user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/Password Sign In — returns { isAdmin } so callers can redirect correctly
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Fetch admin status immediately after sign-in
    let adminStatus = false;
    if (data.user) {
      adminStatus = await fetchAdminStatus(data.user.id, data.user);
    }
    return { ...data, isAdmin: adminStatus };
  };

  // Email/Password Sign Up — creates a new account for new customers
  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          role: 'customer',
        },
      },
    });
    if (error) throw error;
    // If user is immediately confirmed (no email verification required), ensure profile exists
    if (data.user && data.session) {
      await ensureUserProfile(data.user);
    }
    return data;
  };

  // Google OAuth Sign In
  const signInWithGoogle = async (redirectTo?: string) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback${redirectTo ? `?next=${redirectTo}` : ''}`,
      },
    });
    if (error) throw error;
    return data;
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Get Current User
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  // Compatibility helpers for existing components using old authContext
  const isSignedIn = !!user;
  const userProfile = user ? {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || '',
    role: isAdmin ? 'admin' : 'customer',
  } : null;

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getCurrentUser,
    isAdmin,
    isSignedIn,
    // Legacy compat
    name: userProfile?.name,
    email: userProfile?.email,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
