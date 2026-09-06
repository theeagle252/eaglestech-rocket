'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { BUSINESS_CONFIG, formatPrice } from '@/lib/data';

const STUDENT_PRODUCTS = [
{ name: 'Casio FX-991EX', price: 18500, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1279ea302-1785303253939.png", alt: 'Casio scientific calculator on student notebook', badge: 'Exam Must-Have' },
{ name: 'Budget Smartphone', price: 85000, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f82a67b3-1772809433820.png", alt: 'Affordable smartphone on student desk', badge: 'Student Pick' },
{ name: 'USB Flash Drive', price: 5500, image: "https://images.unsplash.com/photo-1551818014-7c8ace9c1b5c", alt: 'USB flash drive on blue background', badge: null },
{ name: 'Oraimo Power Bank', price: 18000, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f134b893-1769474034429.png", alt: 'Portable power bank with charging cable', badge: 'Popular' }];

export default function StudentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-14 md:py-20 bg-background relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" aria-hidden="true" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 relative">

        {/* Section heading — above products */}
        <div className={`mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-sm font-semibold text-accent-foreground mb-4">
            <Icon name="AcademicCapIcon" size={16} className="text-accent" />
            <span>Campus Essentials</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-section-title font-extrabold text-foreground tracking-tight mb-3">
                Student Tech <span className="text-primary">Essentials</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                Everything a student needs — from scientific calculators for exam season to budget smartphones, power banks, and more. Trusted by {BUSINESS_CONFIG?.studentsCount} students on campus.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex -space-x-2">
                {['https://i.pravatar.cc/40?img=47', 'https://i.pravatar.cc/40?img=12', 'https://i.pravatar.cc/40?img=32']?.map((src, i) =>
                  <AppImage
                    key={i}
                    src={src}
                    alt={`Student ${i + 1}`}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white w-8 h-8 object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{BUSINESS_CONFIG?.studentsCount} students</span> trust EaglesTech
              </p>
            </div>
          </div>
        </div>

        {/* Product grid — full width below heading */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {STUDENT_PRODUCTS?.map((p) =>
            <Link
              key={p?.name}
              href="/shop"
              className="group relative bg-muted rounded-2xl overflow-hidden card-lift border border-border">
              {p?.badge &&
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                  {p?.badge}
                </span>
              }
              <div className="aspect-square overflow-hidden">
                <AppImage
                  src={p?.image}
                  alt={p?.alt}
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight mb-1">{p?.name}</p>
                <p className="text-sm font-bold text-primary">{formatPrice(p?.price)}</p>
              </div>
            </Link>
          )}
        </div>

        {/* CTA button */}
        <div className={`mt-8 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/shop?category=calculators"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-secondary active:scale-95 transition-all">
            Shop Student Essentials
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}