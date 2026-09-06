import React from 'react';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import Header from '@/components/Header';
import SignInContent from './components/SignInContent';

export const metadata = {
  title: 'Sign In — EaglesTech',
  description: 'Sign in to your EaglesTech account to track orders, save wishlist and checkout faster.',
};

export default function SignInPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-muted">
          <Header />
          <main className="pt-16">
            <SignInContent />
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}