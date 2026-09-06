import React from 'react';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductDetailContent from './components/ProductDetailContent';

export const metadata = {
  title: 'iPhone 17 Pro Max — EaglesTech | Buy Smartphones Nigeria',
  description: 'Buy the iPhone 17 Pro Max at EaglesTech. Genuine product, fast delivery across Nigeria. Expert advice available.',
};

export default function ProductDetailPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <ProductDetailContent />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}