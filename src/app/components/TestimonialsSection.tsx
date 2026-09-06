'use client';
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { TESTIMONIALS, BUSINESS_CONFIG } from '@/lib/data';

export default function TestimonialsSection() {
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
        <div className={`text-center mb-10 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">What Customers Say</p>
          <h2 className="text-section-title font-extrabold text-foreground tracking-tight mb-3">
            Trusted by {BUSINESS_CONFIG?.studentsCount} Students
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4,5]?.map(s => (
              <Icon key={s} name="StarIcon" size={18} variant="solid" className="text-accent" />
            ))}
            <span className="ml-2 text-sm font-semibold text-foreground">4.9/5 average</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS?.map((t, i) => (
            <div
              key={t?.id}
              className={`bg-muted rounded-2xl p-6 border border-border card-lift transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5]?.map(s => (
                  <Icon key={s} name="StarIcon" size={14} variant={s <= t?.rating ? 'solid' : 'outline'} className={s <= t?.rating ? 'text-accent' : 'text-border'} />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5 line-clamp-3">
                &ldquo;{t?.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <AppImage
                  src={t?.avatar}
                  alt={`${t?.name} profile photo`}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover border-2 border-white"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{t?.name}</p>
                  <p className="text-xs text-muted-foreground">{t?.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}