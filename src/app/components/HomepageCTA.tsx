'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getWhatsAppLink } from '@/lib/data';

export default function HomepageCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-14 md:py-20 bg-muted" id="contact">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="max-w-4xl mx-auto">
        <div
          className={`bg-green-gradient rounded-3xl p-10 md:p-16 text-center relative overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              Ready to Upgrade?
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to Upgrade<br />Your Tech?
            </h2>
            <p className="text-base text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
              Whether you need a new smartphone, laptop, accessory, repair or simply expert advice, EaglesTech is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 bg-accent text-accent-foreground font-bold rounded-full text-base hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/30"
              >
                Shop Now
              </Link>
              <a
                href={getWhatsAppLink('Hi EaglesTech, I need expert technology advice.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-full text-base hover:bg-white/20 active:scale-95 transition-all"
              >
                Talk to an Expert
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}