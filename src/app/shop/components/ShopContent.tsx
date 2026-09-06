'use client';
import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/AppIcon';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/data';

const BRANDS = ['Apple', 'Samsung', 'Dell', 'HP', 'Xiaomi', 'Oraimo', 'Anker', 'Casio', 'JBL', 'Sony'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2500000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filtered = useMemo(() => {
    let result = [...ALL_PRODUCTS];
    if (selectedCategory !== 'all') result = result.filter(p => p.category === selectedCategory);
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (inStockOnly) result = result.filter(p => p.inStock);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (searchQuery) result = result.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [selectedCategory, selectedBrands, priceRange, inStockOnly, sortBy, searchQuery]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-1">Shop All Products</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-input text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-input text-muted-foreground hover:text-foreground'}`}
              aria-label="Grid view"
            >
              <Icon name="Squares2X2Icon" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-10 h-10 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-input text-muted-foreground hover:text-foreground'}`}
              aria-label="List view"
            >
              <Icon name="ListBulletIcon" size={16} />
            </button>
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-input text-sm font-medium text-foreground"
          >
            <Icon name="FunnelIcon" size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel
            selectedCategory={selectedCategory}
            setSelectedCategory={v => { setSelectedCategory(v); setPage(1); }}
            selectedBrands={selectedBrands}
            toggleBrand={brand => { toggleBrand(brand); setPage(1); }}
            priceRange={priceRange}
            setPriceRange={v => { setPriceRange(v); setPage(1); }}
            inStockOnly={inStockOnly}
            setInStockOnly={v => { setInStockOnly(v); setPage(1); }}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="MagnifyingGlassIcon" size={28} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search term.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedBrands([]); setSearchQuery(''); setInStockOnly(false); }}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ?'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5' :'flex flex-col gap-4'
              }>
                {paginated.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-8 py-3 border border-border rounded-full text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Load More ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <Icon name="XMarkIcon" size={22} className="text-foreground" />
              </button>
            </div>
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={v => { setSelectedCategory(v); setPage(1); setFilterOpen(false); }}
              selectedBrands={selectedBrands}
              toggleBrand={brand => { toggleBrand(brand); setPage(1); }}
              priceRange={priceRange}
              setPriceRange={v => { setPriceRange(v); setPage(1); }}
              inStockOnly={inStockOnly}
              setInStockOnly={v => { setInStockOnly(v); setPage(1); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
}

function FilterPanel({
  selectedCategory, setSelectedCategory,
  selectedBrands, toggleBrand,
  priceRange, setPriceRange,
  inStockOnly, setInStockOnly,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
          >
            All Products
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
            >
              <span>{cat.name}</span>
              <span className={`text-xs ${selectedCategory === cat.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={2500000}
            step={10000}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>₦0</span>
            <span className="font-semibold text-foreground">Up to ₦{priceRange[1].toLocaleString('en-NG')}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Brand</h4>
        <div className="space-y-1.5">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Availability</h4>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}