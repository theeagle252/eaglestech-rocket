'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { getWhatsAppLink } from '@/lib/data';

const SERVICES = [
  {
    id: 'buy',
    label: 'BUY',
    icon: 'ShoppingBagIcon',
    title: 'Get Quality Technology Products',
    description: 'Browse hundreds of smartphones, laptops, accessories and gadgets. Every product is selected for reliability and value.',
    cta: 'Shop Now',
    href: '/shop',
    bg: 'bg-primary',
    textColor: 'text-white',
    ctaBg: 'bg-white text-primary hover:bg-white/90',
  },
  {
    id: 'fix',
    label: 'FIX',
    icon: 'WrenchScrewdriverIcon',
    title: 'Professional Device Repairs',
    description: 'Screen damage, battery problems, software issues — EaglesTech provides reliable technical assistance for your devices.',
    cta: 'Request a Repair',
    href: '/#repairs',
    bg: 'bg-secondary',
    textColor: 'text-white',
    ctaBg: 'bg-accent text-accent-foreground hover:bg-accent/90',
  },
  {
    id: 'consult',
    label: 'CONSULT',
    icon: 'ChatBubbleLeftRightIcon',
    title: 'Expert Technology Guidance',
    description: 'Not sure what to buy? Tell us your budget and needs. Our tech experts will help you find the perfect device.',
    cta: 'Talk to an Expert',
    href: getWhatsAppLink('Hi EaglesTech, I need technology consultation.'),
    bg: 'bg-muted',
    textColor: 'text-foreground',
    ctaBg: 'bg-primary text-primary-foreground hover:bg-secondary',
    external: true,
  },
];

export default function ServicesTriptych() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="repairs" className="py-14 md:py-20 bg-muted">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className={`text-center mb-10 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">How We Help</p>
          <h2 className="text-section-title font-extrabold text-foreground tracking-tight">
            EaglesTech Is Your<br />
            <span className="text-primary">Technology Partner</span>
          </h2>
          <p className="text-base text-muted-foreground mt-3 max-w-lg mx-auto">
            We don't just sell technology. We help you make the right technology decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className={`${service.bg} rounded-3xl p-7 md:p-8 flex flex-col transition-all duration-500 card-lift ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`inline-flex items-center gap-2 mb-6`}>
                <span className={`text-xs font-black uppercase tracking-widest ${service.textColor} opacity-50`}>
                  {service.label}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                service.id === 'consult' ? 'bg-primary/10' : 'bg-white/10'
              }`}>
                <Icon
                  name={service.icon as never}
                  size={24}
                  className={service.id === 'consult' ? 'text-primary' : 'text-white'}
                />
              </div>
              <h3 className={`text-xl font-bold mb-3 leading-tight ${service.textColor}`}>
                {service.title}
              </h3>
              <p className={`text-sm leading-relaxed mb-6 flex-1 ${
                service.id === 'consult' ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                {service.description}
              </p>
              {service.external ? (
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all active:scale-95 ${service.ctaBg}`}
                >
                  {service.cta}
                  <Icon name="ArrowRightIcon" size={15} />
                </a>
              ) : (
                <Link
                  href={service.href}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all active:scale-95 ${service.ctaBg}`}
                >
                  {service.cta}
                  <Icon name="ArrowRightIcon" size={15} />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Repair form */}
        <div id="repair-form" className="mt-12 bg-background rounded-3xl border border-border p-7 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-extrabold text-foreground mb-3">
                Your Device Has A Problem?<br />
                <span className="text-primary">Let's Fix It.</span>
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Fill the form and our technicians will get back to you within 2 hours during business hours.
              </p>
              <div className="space-y-2">
                {['Screen & Display Problems', 'Battery & Charging Issues', 'Software & System Errors', 'General Device Faults', 'Phone Diagnostics'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <RepairForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function RepairForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', deviceType: '', brand: '', model: '', problem: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon name="CheckCircleIcon" size={32} className="text-primary" />
        </div>
        <h4 className="text-lg font-bold text-foreground mb-2">Request Submitted!</h4>
        <p className="text-sm text-muted-foreground">We'll contact you within 2 hours during business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="col-span-2 sm:col-span-1 px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="col-span-2 sm:col-span-1 px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select
          required
          value={form.deviceType}
          onChange={e => setForm(f => ({ ...f, deviceType: e.target.value }))}
          className="px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">Device Type</option>
          <option>Smartphone</option>
          <option>Laptop</option>
          <option>Tablet</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          placeholder="Brand (e.g. Samsung)"
          value={form.brand}
          onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
          className="px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <input
        type="text"
        placeholder="Device Model (e.g. Galaxy A55)"
        value={form.model}
        onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
      />
      <textarea
        placeholder="Describe the problem..."
        required
        rows={3}
        value={form.problem}
        onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
      />
      <button
        type="submit"
        className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary active:scale-95 transition-all"
      >
        Request a Repair
      </button>
    </form>
  );
}