'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/lib/cartContext';
import { formatPrice } from '@/lib/data';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  discount?: number;
  image: string;
  alt: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  badge?: string | null;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      alt: product.alt,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(w => !w);
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden card-lift relative">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-sm">
          {product.badge}
        </div>
      )}

      {/* Discount badge */}
      {product.discount && product.discount > 0 && (
        <div className="absolute top-3 right-10 z-10 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
          -{product.discount}%
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Icon
          name="HeartIcon"
          size={16}
          variant={wishlisted ? 'solid' : 'outline'}
          className={wishlisted ? 'text-red-500' : 'text-muted-foreground'}
        />
      </button>

      {/* Image */}
      <Link href="/product-detail" className="block overflow-hidden aspect-square bg-muted">
        <AppImage
          src={product.image}
          alt={product.alt}
          fill
          className="object-cover img-zoom"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <Link href="/product-detail">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors mb-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Icon
                  key={star}
                  name="StarIcon"
                  size={12}
                  variant={star <= Math.floor(product.rating!) ? 'solid' : 'outline'}
                  className={star <= Math.floor(product.rating!) ? 'text-accent' : 'text-border'}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock */}
        {!product.inStock && (
          <p className="text-xs font-medium text-red-500 mb-2">Out of Stock</p>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            added
              ? 'bg-green-500 text-white'
              : product.inStock
              ? 'bg-primary text-primary-foreground hover:bg-secondary active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {added ? (
            <span className="flex items-center justify-center gap-1.5">
              <Icon name="CheckIcon" size={16} />
              Added!
            </span>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Unavailable'
          )}
        </button>
      </div>
    </div>
  );
}