'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { EnergyProduct, ENERGY_PRODUCTS, formatPrice, getWhatsAppLink, getAvailabilityLabel, BUSINESS_CONFIG } from '@/lib/data';

interface Props {
  product: EnergyProduct;
}

export default function EnergyProductDetailContent({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [copied, setCopied] = useState(false);

  const avail = getAvailabilityLabel(product.availability);
  const canOrder = product.availability === 'in-stock' || product.availability === 'low-stock';

  const productUrl = typeof window !== 'undefined'
    ? window.location.href
    : `${process.env.NEXT_PUBLIC_SITE_URL}/energy/${product.id}`;

  const whatsappOrderMsg = `Hi EaglesTech! I'd like to order:\n\n*${product.name}*\nBrand: ${product.brand}\nModel: ${product.model}\nQuantity: ${quantity}\nPrice: ${formatPrice(product.price)} each\n\nProduct Link: ${BUSINESS_CONFIG.name} — /energy/${product.id}\n\nPlease confirm availability and delivery details. Thank you!`;

  const whatsappShareMsg = `Check out this product on EaglesTech:\n\n*${product.name}* by ${product.brand}\nPrice: ${formatPrice(product.price)}\n\n${productUrl}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(productUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} by ${product.brand} — ${formatPrice(product.price)}`,
        url: productUrl,
      });
    }
  };

  const relatedProducts = ENERGY_PRODUCTS.filter(p => product.relatedIds.includes(p.id)).slice(0, 4);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/energy" className="hover:text-primary transition-colors">Energy & Power</Link>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <AppImage
              src={product.images[selectedImage].src}
              alt={product.images[selectedImage].alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                {product.badge}
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    i === selectedImage ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-muted-foreground">Share:</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Icon name={copied ? 'CheckIcon' : 'LinkIcon'} size={14} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={getWhatsAppLink(whatsappShareMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
            >
              <Icon name="ChatBubbleLeftRightIcon" size={14} />
              WhatsApp
            </a>
            {typeof navigator !== 'undefined' && (navigator as Navigator & { share?: () => void }).share && (
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Icon name="ShareIcon" size={14} />
                Share
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-0.5">{product.brand}</p>
          <p className="text-xs text-muted-foreground mb-2">Model: {product.model}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Icon key={s} name="StarIcon" size={16} variant={s <= Math.floor(product.rating) ? 'solid' : 'outline'} className={s <= Math.floor(product.rating) ? 'text-amber-400' : 'text-border'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-extrabold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.discount > 0 && product.originalPrice && (
            <p className="text-sm font-semibold text-green-600 mb-4">
              You save {formatPrice(product.originalPrice - product.price)} ({product.discount}% off)
            </p>
          )}

          {/* Availability */}
          <div className={`inline-flex items-center gap-1.5 text-sm font-semibold mb-5 ${avail.color}`}>
            <div className={`w-2 h-2 rounded-full ${product.availability === 'in-stock' ? 'bg-green-500' : product.availability === 'low-stock' ? 'bg-amber-500' : 'bg-red-500'}`} />
            {avail.label}
          </div>

          {/* Warranty */}
          <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <Icon name="ShieldCheckIcon" size={18} className="text-amber-600 shrink-0" />
            <span className="text-sm font-medium text-amber-800">{product.warranty}</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold text-foreground">Quantity:</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                aria-label="Decrease quantity"
              >
                <Icon name="MinusIcon" size={16} />
              </button>
              <span className="w-12 text-center text-sm font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                disabled={!canOrder}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Icon name="PlusIcon" size={16} />
              </button>
            </div>
          </div>

          {/* Order on WhatsApp */}
          <div className="flex flex-col gap-3 mb-6">
            <a
              href={canOrder ? getWhatsAppLink(whatsappOrderMsg) : '#'}
              target={canOrder ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
                canOrder
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={e => !canOrder && e.preventDefault()}
            >
              <Icon name="ChatBubbleLeftRightIcon" size={20} />
              {canOrder ? 'Order on WhatsApp' : product.availability === 'coming-soon' ? 'Coming Soon' : 'Out of Stock'}
            </a>
            <p className="text-xs text-muted-foreground text-center">
              Order via WhatsApp — confirm payment and delivery details directly with us.
            </p>
          </div>

          {/* Delivery info */}
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Icon name="TruckIcon" size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Delivery</p>
                <p className="text-xs text-muted-foreground">Within Ogun State: 1–2 business days. Other states: 2–5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="MapPinIcon" size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Pickup</p>
                <p className="text-xs text-muted-foreground">Available at our Ogun State location. Ready within 2 hours of order confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs */}
      <div className="mb-16">
        <div className="flex border-b border-border mb-6">
          {(['description', 'specs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'specs' ? 'Technical Specs' : 'Description'}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr key={spec.label} className={i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}>
                    <td className="px-4 py-3 font-semibold text-foreground w-1/3 rounded-l-lg">{spec.label}</td>
                    <td className="px-4 py-3 text-muted-foreground rounded-r-lg">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-foreground mb-5">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <Link
                key={p.id}
                href={`/energy/${p.id}`}
                className="group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <AppImage
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-primary mb-0.5">{p.brand}</p>
                  <p className="text-xs font-semibold text-foreground line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-sm font-extrabold text-foreground">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
