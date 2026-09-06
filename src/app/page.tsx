import React from 'react';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from './components/HeroSection';
import TrustStrip from './components/TrustStrip';
import CategoryGrid from './components/CategoryGrid';
import FeaturedProducts from './components/FeaturedProducts';
import StudentSection from './components/StudentSection';
import ServicesTriptych from './components/ServicesTriptych';
import TestimonialsSection from './components/TestimonialsSection';
import HomepageCTA from './components/HomepageCTA';

export default function HomePage() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <HeroSection />
            <TrustStrip />
            <CategoryGrid />
            <FeaturedProducts />
            <StudentSection />
            <ServicesTriptych />
            <TestimonialsSection />
            <HomepageCTA />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}