import React from 'react';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutContent from './components/CheckoutContent';

export const metadata = {
  title: 'Checkout — EaglesTech',
  description: 'Complete your purchase securely. Fast delivery across Nigeria.',
};

export default function CheckoutPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-muted">
          <Header />
          <main className="pt-16">
            <CheckoutContent />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}