import React from 'react';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShopContent from './components/ShopContent';

export const metadata = {
  title: 'Shop — EaglesTech | Smartphones, Laptops & Accessories Nigeria',
  description: 'Browse hundreds of smartphones, laptops, accessories and gadgets. Filter by category, price and brand. Fast delivery across Nigeria.',
};

export default function ShopPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <ShopContent />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}