'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { BUSINESS_CONFIG } from '@/lib/data';

export default function Footer() {
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const shopLinks = [
    { href: '/shop?category=smartphones', label: 'Smartphones' },
    { href: '/shop?category=laptops', label: 'Laptops' },
    { href: '/shop?category=accessories', label: 'Accessories' },
    { href: '/shop?category=gadgets', label: 'Gadgets' },
    { href: '/shop?category=gaming', label: 'Gaming' },
    { href: '/shop?category=calculators', label: 'Calculators' },
  ];

  const companyLinks = [
    { href: '/#about', label: 'About Us' },
    { href: '/#repairs', label: 'Repairs' },
    { href: '/#contact', label: 'Contact' },
    { href: '#', label: 'FAQs' },
  ];

  const legalLinks = [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="bg-secondary text-white/80 border-t border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12 md:py-16">
        {/* Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
              <span className="font-bold text-lg text-white">EaglesTech</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {BUSINESS_CONFIG.tagline}
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              {BUSINESS_CONFIG.address}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Icon name="PhoneIcon" size={14} className="text-accent shrink-0" />
                {BUSINESS_CONFIG.phone}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Icon name="EnvelopeIcon" size={14} className="text-accent shrink-0" />
                {BUSINESS_CONFIG.email}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Icon name="MapPinIcon" size={14} className="text-accent shrink-0 mt-0.5" />
                {BUSINESS_CONFIG.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center md:text-left">
            &copy; {year} EaglesTech Global Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map(link => (
              <Link key={link.label} href={link.href} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { icon: 'ChatBubbleOvalLeftIcon', label: 'WhatsApp', href: '#' },
              { icon: 'EnvelopeIcon', label: 'Email', href: '#' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Icon name={s.icon as never} size={16} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}