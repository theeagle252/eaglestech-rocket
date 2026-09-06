import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import { AuthProvider } from '@/contexts/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'EaglesTech — Affordable Tech. Premium Experience.',
  description: 'Shop smartphones, laptops, gadgets and accessories in Nigeria. Expert repairs, tech consultation, and fast delivery. Trusted by 100+ students on campus.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'EaglesTech — Affordable Tech. Premium Experience.',
    description: 'Nigeria\'s premium tech partner. Buy, fix, and consult with EaglesTech.',
    images: [{ url: '/assets/images/IMG-20260802-WA0021-1787654220491.jpg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable} data-scroll-behavior="smooth">
      <body className={plusJakartaSans.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
</body>
    </html>
  );
}