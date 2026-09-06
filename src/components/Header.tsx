'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { ALL_PRODUCTS, ENERGY_PRODUCTS, formatPrice } from '@/lib/data';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, isAdmin, signOut, isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Instant search across all products including energy
  const searchResults = useMemo(() => {
    if (!searchQuery?.trim()) return [];
    const q = searchQuery?.toLowerCase();

    const regularMatches = ALL_PRODUCTS?.filter(p =>
      p?.name?.toLowerCase()?.includes(q) ||
      p?.brand?.toLowerCase()?.includes(q) ||
      p?.category?.toLowerCase()?.includes(q)
    )?.slice(0, 4)?.map(p => ({
      id: p?.id,
      name: p?.name,
      brand: p?.brand,
      price: p?.price,
      image: p?.image,
      alt: p?.alt,
      href: `/product-detail?id=${p?.id}`,
      category: p?.category,
    }));

    const energyMatches = ENERGY_PRODUCTS?.filter(p =>
      p?.name?.toLowerCase()?.includes(q) ||
      p?.brand?.toLowerCase()?.includes(q) ||
      p?.model?.toLowerCase()?.includes(q) ||
      p?.subcategory?.toLowerCase()?.includes(q) ||
      p?.description?.toLowerCase()?.includes(q) ||
      p?.searchKeywords?.some(k => k?.toLowerCase()?.includes(q))
    )?.slice(0, 4)?.map(p => ({
      id: p?.id,
      name: p?.name,
      brand: p?.brand,
      price: p?.price,
      image: p?.images?.[0]?.src,
      alt: p?.images?.[0]?.alt,
      href: `/energy/${p?.id}`,
      category: 'Energy & Power',
    }));

    return [...regularMatches, ...energyMatches]?.slice(0, 6);
  }, [searchQuery]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/energy', label: '⚡ Energy' },
    { href: '#repairs', label: 'Repairs' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <AppLogo size={36} />
              <span className="font-bold text-lg text-foreground tracking-tight hidden sm:block">
                EaglesTech
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks?.map(link => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link?.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                aria-label="Search products"
              >
                <Icon name="MagnifyingGlassIcon" size={20} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                aria-label={`Cart, ${totalItems} items`}
              >
                <Icon name="ShoppingCartIcon" size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Admin badge */}
              {isAdmin && (
                <Link
                  href="/admin-login"
                  className="hidden lg:flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent-foreground text-xs font-semibold rounded-full border border-accent/30 hover:bg-accent/30 transition-colors"
                >
                  <Icon name="StarIcon" size={12} variant="solid" className="text-accent" />
                  Admin
                </Link>
              )}

              {/* User */}
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground hidden lg:block">
                    {user?.name?.split(' ')?.[0]}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in-login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* CTA */}
              <Link
                href="/shop"
                className="ml-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-secondary transition-colors duration-200 shadow-sm"
              >
                Shop Now
              </Link>
            </div>

            {/* Mobile Right Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-foreground"
                aria-label="Search"
              >
                <Icon name="MagnifyingGlassIcon" size={20} />
              </button>
              <Link
                href="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-foreground"
                aria-label="Cart"
              >
                <Icon name="ShoppingCartIcon" size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-foreground"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <Icon name={menuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-border shadow-xl p-6 space-y-4 animate-slide-up">
            {navLinks?.map(link => (
              <Link
                key={link?.href}
                href={link?.href}
                className="block text-base font-semibold text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                onClick={() => setMenuOpen(false)}
              >
                {link?.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              {isSignedIn ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Signed in as {user?.name}
                  </span>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in-login"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/shop"
                className="w-full text-center px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-full"
                onClick={() => setMenuOpen(false)}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 animate-slide-up">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Icon name="MagnifyingGlassIcon" size={22} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search smartphones, solar panels, inverters..."
                className="flex-1 text-base font-medium text-foreground placeholder:text-muted-foreground outline-none bg-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e?.target?.value)}
                autoFocus
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Instant Search Results */}
            {searchQuery?.trim() && searchResults?.length > 0 ? (
              <div className="pt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {searchResults?.length} result{searchResults?.length !== 1 ? 's' : ''} found
                </p>
                <div className="space-y-1">
                  {searchResults?.map(result => (
                    <Link
                      key={result?.id}
                      href={result?.href}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <AppImage src={result?.image} alt={result?.alt} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{result?.name}</p>
                        <p className="text-xs text-muted-foreground">{result?.brand} · {result?.category}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground shrink-0">{formatPrice(result?.price)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery?.trim() && searchResults?.length === 0 ? (
              <div className="pt-4 text-center text-sm text-muted-foreground">
                No products found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="pt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['iPhone 17', 'Samsung Galaxy', 'MacBook', 'Solar Panel', 'Inverter', 'Power Station', 'Oraimo Earbuds', 'Casio Calculator']?.map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 bg-muted text-sm font-medium text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}