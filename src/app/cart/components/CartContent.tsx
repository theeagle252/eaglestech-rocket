'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/lib/cartContext';
import { formatPrice } from '@/lib/data';

const DELIVERY_FEE = 3000;

export default function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === 'student10') {
      setPromoApplied(true);
    }
  };

  const discount = promoApplied ? Math.round(totalPrice * 0.1) : 0;
  const grandTotal = totalPrice + DELIVERY_FEE - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-16">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Icon name="ShoppingCartIcon" size={36} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven't added anything yet. Browse our products and find something you love.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:bg-secondary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Shopping Cart
        </h1>
        <span className="text-sm text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-start">
              {/* Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{item.brand}</p>
                <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2 leading-snug">{item.name}</h3>
                <p className="text-base font-extrabold text-foreground">{formatPrice(item.price)}</p>
              </div>

              {/* Quantity + Remove */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Remove item"
                >
                  <Icon name="TrashIcon" size={15} />
                </button>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-sm font-bold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-sm font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors mt-2"
          >
            <Icon name="ArrowLeftIcon" size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Estimate</span>
                <span className="font-semibold text-foreground">{formatPrice(DELIVERY_FEE)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Promo (STUDENT10)</span>
                  <span className="font-semibold text-green-600">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-base font-extrabold text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Promo Code */}
            {!promoApplied && (
              <form onSubmit={handlePromo} className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-border transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {promoApplied && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200 mb-5">
                <Icon name="CheckCircleIcon" size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-green-700">Promo code applied! 10% off</span>
              </div>
            )}

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary active:scale-95 transition-all text-sm"
            >
              Proceed to Checkout
              <Icon name="ArrowRightIcon" size={16} />
            </Link>

            {/* Trust signals */}
            <div className="mt-4 flex flex-col gap-2">
              {['Secure checkout', 'Genuine products guaranteed', 'Easy returns'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="ShieldCheckIcon" size={13} className="text-primary shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}