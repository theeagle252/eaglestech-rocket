'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/cartContext';
import { FEATURED_PRODUCTS, formatPrice, getWhatsAppLink } from '@/lib/data';

const PRODUCT = {
  id: 'iphone-17-pro-max',
  name: 'iPhone 17 Pro Max',
  brand: 'Apple',
  category: 'smartphones',
  price: 1850000,
  originalPrice: 2100000,
  discount: 12,
  inStock: true,
  rating: 4.9,
  reviews: 47,
  badge: 'New',
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_13d56481d-1776977065110.png", alt: 'iPhone 17 Pro Max front view showing titanium finish in studio lighting' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1b8623b45-1772991356571.png", alt: 'iPhone 17 Pro Max side profile showing camera system and buttons' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_171571d0d-1772455314835.png", alt: 'iPhone 17 Pro Max back showing triple camera array' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1b8623b45-1772991356571.png", alt: 'iPhone 17 Pro Max in hand showing display size and form factor' }],

  description: 'The iPhone 17 Pro Max represents the pinnacle of Apple\'s engineering. With a stunning titanium design, the most advanced camera system ever in an iPhone, and the powerful A19 Pro chip, this is the smartphone for those who demand the absolute best.',
  specs: [
  { label: 'Display', value: '6.9" Super Retina XDR OLED' },
  { label: 'Processor', value: 'Apple A19 Pro Chip' },
  { label: 'RAM', value: '8GB' },
  { label: 'Storage', value: '256GB / 512GB / 1TB' },
  { label: 'Camera', value: '50MP Main + 48MP Ultra Wide + 12MP Telephoto' },
  { label: 'Battery', value: '4,685 mAh' },
  { label: 'OS', value: 'iOS 19' },
  { label: 'Connectivity', value: '5G, Wi-Fi 7, Bluetooth 5.4' }],

  features: [
  'Titanium design — lighter and stronger than stainless steel',
  'ProMotion 120Hz adaptive display',
  'Action Button — fully customizable',
  'USB 3 speed with USB-C connector',
  'Emergency SOS via satellite',
  'Face ID — the most secure facial authentication'],

  deliveryInfo: 'Delivery within Ogun State: 1–2 business days. Other states: 2–5 business days.',
  pickupInfo: 'Pickup available at our Ogun State location. Ready within 2 hours of order confirmation.'
};

const MOCK_REVIEWS = [
{ id: 1, name: 'Emeka Obi', rating: 5, date: 'Aug 2026', text: 'Excellent product, arrived in perfect condition. EaglesTech packaging was very professional.' },
{ id: 2, name: 'Fatima Bello', rating: 5, date: 'Jul 2026', text: 'Best price I found in Nigeria. Delivery was fast and the phone is genuine. Highly recommend!' },
{ id: 3, name: 'Seun Adeyemi', rating: 4, date: 'Jul 2026', text: 'Great experience overall. The team helped me choose the right storage size for my needs.' }];


export default function ProductDetailContent() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: PRODUCT.id,
        name: PRODUCT.name,
        brand: PRODUCT.brand,
        price: PRODUCT.price,
        image: PRODUCT.images[0].src,
        alt: PRODUCT.images[0].alt
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = FEATURED_PRODUCTS.filter((p) => p.id !== PRODUCT.id && p.category === 'smartphones').slice(0, 4);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span>/</span>
        <Link href="/shop?category=smartphones" className="hover:text-primary transition-colors">Smartphones</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{PRODUCT.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <AppImage
              src={PRODUCT.images[selectedImage].src}
              alt={PRODUCT.images[selectedImage].alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw" />

            {PRODUCT.badge &&
            <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                {PRODUCT.badge}
              </div>
            }
            {PRODUCT.discount > 0 &&
            <div className="absolute top-4 right-4 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{PRODUCT.discount}%
              </div>
            }
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {PRODUCT.images.map((img, i) =>
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
              i === selectedImage ? 'border-primary' : 'border-border hover:border-primary/50'}`
              }
              aria-label={`View image ${i + 1}`}>

                <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">{PRODUCT.brand}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-3 leading-tight">
            {PRODUCT.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) =>
              <Icon key={s} name="StarIcon" size={16} variant={s <= Math.floor(PRODUCT.rating) ? 'solid' : 'outline'} className={s <= Math.floor(PRODUCT.rating) ? 'text-accent' : 'text-border'} />
              )}
            </div>
            <span className="text-sm font-semibold text-foreground">{PRODUCT.rating}</span>
            <span className="text-sm text-muted-foreground">({PRODUCT.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-extrabold text-foreground">{formatPrice(PRODUCT.price)}</span>
            {PRODUCT.originalPrice &&
            <span className="text-base text-muted-foreground line-through">{formatPrice(PRODUCT.originalPrice)}</span>
            }
          </div>
          {PRODUCT.discount > 0 &&
          <p className="text-sm font-semibold text-green-600 mb-4">
              You save {formatPrice(PRODUCT.originalPrice! - PRODUCT.price)} ({PRODUCT.discount}% off)
            </p>
          }

          {/* Stock */}
          <div className={`inline-flex items-center gap-1.5 text-sm font-semibold mb-5 ${PRODUCT.inStock ? 'text-green-600' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${PRODUCT.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            {PRODUCT.inStock ? 'In Stock' : 'Out of Stock'}
          </div>

          {/* Features preview */}
          <ul className="space-y-2 mb-6">
            {PRODUCT.features.slice(0, 3).map((f) =>
            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Icon name="CheckCircleIcon" size={16} className="text-primary shrink-0 mt-0.5" />
                {f}
              </li>
            )}
          </ul>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold text-foreground">Quantity:</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                aria-label="Decrease quantity">

                <Icon name="MinusIcon" size={16} />
              </button>
              <span className="w-12 text-center text-sm font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                aria-label="Increase quantity">

                <Icon name="PlusIcon" size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!PRODUCT.inStock}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              added ?
              'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-secondary'}`
              }>

              {added ?
              <><Icon name="CheckIcon" size={18} />Added to Cart!</> :

              <><Icon name="ShoppingCartIcon" size={18} />Add to Cart</>
              }
            </button>
            <Link
              href="/checkout"
              className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95">

              Buy Now
            </Link>
          </div>

          {/* Delivery info */}
          <div className="bg-muted rounded-xl p-4 space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <Icon name="TruckIcon" size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Delivery</p>
                <p className="text-xs text-muted-foreground">{PRODUCT.deliveryInfo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="MapPinIcon" size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Pickup</p>
                <p className="text-xs text-muted-foreground">{PRODUCT.pickupInfo}</p>
              </div>
            </div>
          </div>

          {/* WhatsApp Help */}
          <a
            href={getWhatsAppLink(`Hi EaglesTech, I need help with the ${PRODUCT.name}. Can you assist?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors">

            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Need help choosing? Chat with EaglesTech
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-hide">
          {(['description', 'specs', 'reviews'] as const).map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-colors border-b-2 -mb-px ${
            activeTab === tab ?
            'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
            }>

              {tab === 'reviews' ? `Reviews (${PRODUCT.reviews})` : tab}
            </button>
          )}
        </div>

        {activeTab === 'description' &&
        <div className="max-w-3xl">
            <p className="text-base text-foreground leading-relaxed mb-6">{PRODUCT.description}</p>
            <h3 className="text-base font-bold text-foreground mb-3">Key Features</h3>
            <ul className="space-y-2">
              {PRODUCT.features.map((f) =>
            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Icon name="CheckCircleIcon" size={16} className="text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
            )}
            </ul>
          </div>
        }

        {activeTab === 'specs' &&
        <div className="max-w-2xl">
            <div className="rounded-2xl border border-border overflow-hidden">
              {PRODUCT.specs.map((spec, i) =>
            <div key={spec.label} className={`flex gap-4 px-5 py-3.5 text-sm ${i % 2 === 0 ? 'bg-muted' : 'bg-background'}`}>
                  <span className="font-semibold text-foreground w-32 shrink-0">{spec.label}</span>
                  <span className="text-muted-foreground">{spec.value}</span>
                </div>
            )}
            </div>
          </div>
        }

        {activeTab === 'reviews' &&
        <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-4 p-5 bg-muted rounded-2xl mb-6">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-foreground">{PRODUCT.rating}</p>
                <div className="flex justify-center my-1">
                  {[1, 2, 3, 4, 5].map((s) =>
                <Icon key={s} name="StarIcon" size={14} variant="solid" className="text-accent" />
                )}
                </div>
                <p className="text-xs text-muted-foreground">{PRODUCT.reviews} reviews</p>
              </div>
            </div>
            {MOCK_REVIEWS.map((review) =>
          <div key={review.id} className="p-5 bg-background border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) =>
                <Icon key={s} name="StarIcon" size={13} variant={s <= review.rating ? 'solid' : 'outline'} className={s <= review.rating ? 'text-accent' : 'text-border'} />
                )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              </div>
          )}
          </div>
        }
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
        </div>
      </div>
    </div>);

}