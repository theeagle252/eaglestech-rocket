'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { STAGE_PRODUCTS, BUSINESS_CONFIG, formatPrice } from '@/lib/data';
import { getWhatsAppLink } from '@/lib/data';

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const goTo = (index: number) => {
    if (animating || index === activeIndex) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setAnimating(false);
    }, 350);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const next = (activeIndex + 1) % STAGE_PRODUCTS.length;
      goTo(next);
    }, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex]);

  const current = STAGE_PRODUCTS[activeIndex];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-green-gradient pt-16">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 blob-accent pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 blob-primary pointer-events-none opacity-40" aria-hidden="true" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-4rem)]">

          {/* Left: Text Content */}
          <div className={`flex flex-col items-start transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm text-white/80 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              <span>Trusted by {BUSINESS_CONFIG.studentsCount} students on campus</span>
            </div>

            {/* Headline */}
            <h1 className="text-hero font-extrabold text-white mb-4 leading-none tracking-tight">
              Technology<br />
              <span className="text-accent">That Works</span><br />
              For You.
            </h1>

            <p className="text-base md:text-lg text-white/70 mb-8 max-w-md leading-relaxed">
              Shop smartphones, laptops, gadgets and accessories, or get expert help choosing the right technology for your needs.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-accent text-accent-foreground font-bold rounded-full text-base flex items-center justify-center gap-2 hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/30"
              >
                Shop Now
                <Icon name="ArrowRightIcon" size={18} />
              </Link>
              <a
                href={getWhatsAppLink('Hi EaglesTech, I need help choosing the right tech for my needs.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-full text-base flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
              >
                Talk to an Expert
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 md:gap-8">
              {[
                { value: '500+', label: 'Products' },
                { value: '100+', label: 'Students Served' },
                { value: '4.9★', label: 'Average Rating' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Stage — single image, no floating cards */}
          <div className={`relative flex items-center justify-center transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Main Stage Card — full width, no side padding for floating cards */}
            <div className="relative w-full max-w-sm lg:max-w-md mx-auto mb-4">
              {/* Stage platform */}
              <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl" style={{ aspectRatio: '3/4' }}>
                {/* Product Image */}
                <div
                  className={`absolute inset-0 transition-all duration-350 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                  style={{ transitionDuration: '350ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                >
                  <AppImage
                    src={current.image}
                    alt={current.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Product info overlay */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-350 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDuration: '350ms' }}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-0.5">
                        {current.brand}
                      </p>
                      <h2 className="text-xl font-bold text-white leading-tight mb-1">
                        {current.name}
                      </h2>
                      <p className="text-sm text-white/70">{current.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-white/50 mb-0.5">From</p>
                      <p className="text-lg font-bold text-accent">{formatPrice(current.price)}</p>
                    </div>
                  </div>
                </div>

                {/* Tag badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold transition-all duration-350 ${
                    current.tagColor === 'accent' ? 'bg-accent text-accent-foreground' : 'bg-primary text-white'
                  } ${animating ? 'opacity-0' : 'opacity-100'}`}
                  style={{ transitionDuration: '350ms' }}
                >
                  {current.tag}
                </div>
              </div>
            </div>

            {/* Stage Dots */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {STAGE_PRODUCTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`View product ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-background" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} aria-hidden="true" />
    </section>
  );
}