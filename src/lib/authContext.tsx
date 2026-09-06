'use client';
import React, { createContext, useContext } from 'react';
import { useAuth as useSupabaseAuth } from '@/contexts/AuthContext';

// Legacy compatibility shim — routes old useAuth calls to the Supabase AuthContext
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // This is now a pass-through — the real provider is in src/contexts/AuthContext.tsx
  return <>{children}</>;
}

export function useAuth(): AuthContextType {
  const supabaseAuth = useSupabaseAuth();

  return {
    user: supabaseAuth.userProfile,
    isAdmin: supabaseAuth.isAdmin,
    signIn: () => {}, // no-op — use signInWithGoogle or signIn from contexts/AuthContext
    signOut: supabaseAuth.signOut,
    isSignedIn: supabaseAuth.isSignedIn,
  };
}