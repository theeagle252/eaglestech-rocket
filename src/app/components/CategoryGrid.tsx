'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { CATEGORIES } from '@/lib/data';

export default function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-14 md:py-20 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Browse by Category</p>
          <h2 className="text-section-title font-extrabold text-foreground tracking-tight">
            What Are You Looking For?
          </h2>
        </div>

        {/* BENTO GRID AUDIT:
            Array: [Smartphones, Laptops, Accessories, Gadgets, Gaming, Calculators] — 6 cards
            Row 1: [col-1: Smartphones cs-1] [col-2: Laptops cs-1] [col-3: Accessories cs-1]
            Row 2: [col-1: Gadgets cs-1] [col-2: Gaming cs-1] [col-3: Calculators cs-1]
            Placed 6/6 cards ✓
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES?.map((cat, i) => (
            <Link
              key={cat?.id}
              href={`/shop?category=${cat?.id}`}
              className={`group relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted card-lift transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <AppImage
                src={cat?.image}
                alt={cat?.alt}
                fill
                className="object-cover img-zoom"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-white leading-tight mb-0.5">
                  {cat?.name}
                </h3>
                <p className="text-xs text-white/60 hidden md:block">{cat?.count} products</p>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}