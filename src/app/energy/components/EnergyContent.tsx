'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { ENERGY_PRODUCTS, ENERGY_SUBCATEGORIES, formatPrice, getAvailabilityLabel, EnergyProduct } from '@/lib/data';

const ENERGY_BRANDS = [...new Set(ENERGY_PRODUCTS.map((p) => p.brand))];

function EnergyProductCard({ product }: {product: EnergyProduct;}) {
  const avail = getAvailabilityLabel(product.availability);
  const canOrder = product.availability === 'in-stock' || product.availability === 'low-stock';

  return (
    <Link
      href={`/energy/${product.id}`}
      className="group relative bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <AppImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        
        {product.badge &&
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            {product.badge}
          </div>
        }
        {product.discount > 0 &&
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{product.discount}%
          </div>
        }
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{product.brand}</p>
        <h3 className="text-sm font-bold text-foreground leading-snug mb-2 line-clamp-2 flex-1">{product.name}</h3>

        {/* Availability */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 ${avail.color}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${product.availability === 'in-stock' ? 'bg-green-500' : product.availability === 'low-stock' ? 'bg-amber-500' : 'bg-red-500'}`} />
          {avail.label}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-extrabold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice &&
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          }
        </div>

        {/* CTA */}
        <div
          className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
          canOrder ?
          'bg-primary text-primary-foreground group-hover:bg-secondary' :
          'bg-muted text-muted-foreground cursor-not-allowed'}`
          }>
          
          {canOrder ? 'View & Order' : product.availability === 'coming-soon' ? 'Coming Soon' : 'Out of Stock'}
        </div>
      </div>
    </Link>);

}

export default function EnergyContent() {
  const [selectedSub, setSelectedSub] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [availOnly, setAvailOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleBrand = (b: string) =>
  setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const filtered = useMemo(() => {
    let result = [...ENERGY_PRODUCTS];
    if (selectedSub !== 'all') result = result.filter((p) => p.subcategory === selectedSub);
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (availOnly) result = result.filter((p) => p.availability === 'in-stock' || p.availability === 'low-stock');
    result = result.filter((p) => p.price <= maxPrice);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.searchKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selectedSub, selectedBrands, maxPrice, availOnly, searchQuery]);

  const featured = ENERGY_PRODUCTS.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 pt-24 pb-16">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-sm font-medium mb-6">
                <span className="text-lg">⚡</span>
                <span>Energy & Power Solutions</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Power That<br />
                <span className="text-amber-400">Never Stops.</span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
                Solar panels, inverters, power stations and backup solutions — built for Nigerian homes and businesses. Stop depending on NEPA.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6">
                {[
                { icon: '☀️', label: 'Solar Solutions' },
                { icon: '🔋', label: 'Battery Backup' },
                { icon: '⚡', label: 'Inverter Systems' },
                { icon: '🌀', label: 'Rechargeable Fans' }].
                map((s) =>
                <div key={s.label} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Display Images */}
            <div className="hidden lg:flex items-center justify-center gap-4">
              {/* itel PowerTank card */}
              <div className="relative w-44 h-56 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex-shrink-0">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_4e37562ba-1788553139582.png"
                  alt="itel PowerTank portable power station with multiple charging ports"
                  fill
                  className="object-cover"
                  sizes="176px" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">itel</p>
                  <p className="text-sm font-bold text-white leading-tight">PowerTank</p>
                  <p className="text-xs text-white/60">Portable Power</p>
                </div>
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                  🔋 New
                </div>
              </div>

              {/* Solar Panel card */}
              <div className="relative w-44 h-56 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex-shrink-0 mt-8">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_4d65fb4a1-1788553138877.png"
                  alt="Solar panel installed outdoors generating clean renewable energy"
                  fill
                  className="object-cover"
                  sizes="176px" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Solar</p>
                  <p className="text-sm font-bold text-white leading-tight">Panel</p>
                  <p className="text-xs text-white/60">Clean Energy</p>
                </div>
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                  ☀️ Solar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-background" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* Featured Products Strip */}
      {featured.length > 0 &&
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-foreground">Featured Energy Products</h2>
            <span className="text-xs text-muted-foreground font-medium">{featured.length} products</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <EnergyProductCard key={p.id} product={p} />)}
          </div>
        </section>
      }

      {/* Main Catalog */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-foreground">All Energy Products</h2>
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-input text-sm font-medium text-foreground">
            
            <Icon name="FunnelIcon" size={16} />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search solar, inverter, itel, battery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
          
          {searchQuery &&
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            
              <Icon name="XMarkIcon" size={16} />
            </button>
          }
        </div>

        {/* Subcategory Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {ENERGY_SUBCATEGORIES.map((sub) =>
          <button
            key={sub.id}
            onClick={() => setSelectedSub(sub.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedSub === sub.id ?
            'bg-primary text-primary-foreground shadow-sm' :
            'bg-muted text-muted-foreground hover:text-foreground'}`
            }>
            
              {sub.name}
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <EnergyFilterPanel
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              availOnly={availOnly}
              setAvailOnly={setAvailOnly} />
            
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ?
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Icon name="MagnifyingGlassIcon" size={28} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search term.</p>
                <button
                onClick={() => {setSelectedSub('all');setSelectedBrands([]);setSearchQuery('');setAvailOnly(false);setMaxPrice(1000000);}}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                
                  Clear Filters
                </button>
              </div> :

            <>
                <p className="text-sm text-muted-foreground mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {filtered.map((p) => <EnergyProductCard key={p.id} product={p} />)}
                </div>
              </>
            }
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {filterOpen &&
      <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <Icon name="XMarkIcon" size={22} className="text-foreground" />
              </button>
            </div>
            <EnergyFilterPanel
            selectedBrands={selectedBrands}
            toggleBrand={(b) => {toggleBrand(b);}}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            availOnly={availOnly}
            setAvailOnly={setAvailOnly} />
          
          </div>
        </div>
      }
    </div>);

}

interface FilterProps {
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  availOnly: boolean;
  setAvailOnly: (v: boolean) => void;
}

function EnergyFilterPanel({ selectedBrands, toggleBrand, maxPrice, setMaxPrice, availOnly, setAvailOnly }: FilterProps) {
  return (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Brand</h4>
        <div className="space-y-2">
          {ENERGY_BRANDS.map((b) =>
          <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
              type="checkbox"
              checked={selectedBrands.includes(b)}
              onChange={() => toggleBrand(b)}
              className="w-4 h-4 accent-primary rounded" />
            
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{b}</span>
            </label>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Max Price</h4>
        <input
          type="range"
          min={0}
          max={1000000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary" />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>₦0</span>
          <span className="font-semibold text-foreground">Up to ₦{maxPrice.toLocaleString('en-NG')}</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Availability</h4>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={availOnly}
            onChange={(e) => setAvailOnly(e.target.checked)}
            className="w-4 h-4 accent-primary rounded" />
          
          <span className="text-sm font-medium text-foreground">In Stock Only</span>
        </label>
      </div>
    </div>);

}