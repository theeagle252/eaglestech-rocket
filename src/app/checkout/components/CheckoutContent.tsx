'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/data';
import { orderService } from '@/lib/supabaseService';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

type DeliveryMethod = 'delivery' | 'pickup';
type PaymentMethod = 'paystack' | 'flutterwave' | 'bank';
type OrderStatus = 'idle' | 'placing' | 'placed';

export default function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const { isSignedIn, user, userProfile } = useAuth();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderError, setOrderError] = useState('');
  const [form, setForm] = useState({
    fullName: userProfile?.name || '',
    phone: '',
    email: userProfile?.email || '',
    address: '',
    state: 'Ogun',
    city: '',
    notes: '',
  });

  const DELIVERY_FEE = deliveryMethod === 'delivery' ? 3000 : 0;
  const grandTotal = totalPrice + DELIVERY_FEE;

  const updateForm = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    setOrderStatus('placing');

    try {
      const result = await orderService.create({
        userId: user?.id || '',
        customerName: form.fullName,
        customerEmail: form.email,
        customerPhone: form.phone,
        deliveryMethod,
        deliveryAddress: form.address,
        deliveryState: form.state,
        deliveryCity: form.city,
        notes: form.notes,
        subtotal: totalPrice,
        deliveryFee: DELIVERY_FEE,
        grandTotal,
        paymentMethod,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          brand: item.brand || '',
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      });
      setOrderNumber(result.orderNumber || result.order_number || '');
      setOrderStatus('placed');
      clearCart();
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
      setOrderStatus('idle');
    }
  };

  // If not signed in, show sign-in prompt
  if (!isSignedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-card rounded-3xl border border-border p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Icon name="LockClosedIcon" size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground mb-2">Sign in to Checkout</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            You need to sign in with your Google account to complete your purchase. Your order details will be saved securely.
          </p>
          <Link
            href="/sign-in-login"
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary transition-colors mb-3"
          >
            <Icon name="UserCircleIcon" size={20} />
            Sign in with Google
          </Link>
          <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  // Order placed confirmation
  if (orderStatus === 'placed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-card rounded-3xl border border-border p-8 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Icon name="CheckCircleIcon" size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Order Placed!</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Thank you, <span className="font-semibold text-foreground">{form.fullName || userProfile?.name}</span>!
          </p>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your order has been received and saved. EaglesTech will confirm and process it shortly.
          </p>
          <div className="bg-muted rounded-xl p-4 text-left mb-6 space-y-2">
            {orderNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-bold text-primary">{orderNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Status</span>
              <span className="font-semibold text-primary">Pending Confirmation</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">{formatPrice(grandTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Method</span>
              <span className="font-semibold text-foreground capitalize">{deliveryMethod}</span>
            </div>
          </div>
          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">Your cart is empty</h2>
        <Link href="/shop" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Signed in as */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                {userProfile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Signed in as {userProfile?.name}</p>
                <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
              </div>
              <Icon name="CheckCircleIcon" size={20} className="text-green-500 ml-auto shrink-0" />
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={e => updateForm('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Adaeze Okonkwo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => updateForm('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => updateForm('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Delivery Method</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {([
                  { value: 'delivery', label: 'Home Delivery', icon: 'TruckIcon', desc: '1–5 business days' },
                  { value: 'pickup', label: 'Pickup', icon: 'MapPinIcon', desc: 'Ready in 2 hours' },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDeliveryMethod(opt.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      deliveryMethod === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon name={opt.icon as never} size={20} className={deliveryMethod === opt.value ? 'text-primary' : 'text-muted-foreground'} />
                    <p className={`text-sm font-bold mt-2 ${deliveryMethod === opt.value ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Delivery Address</label>
                    <input
                      type="text"
                      required={deliveryMethod === 'delivery'}
                      value={form.address}
                      onChange={e => updateForm('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="12 University Road, Abeokuta"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">State</label>
                      <select
                        value={form.state}
                        onChange={e => updateForm('state', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      >
                        {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => updateForm('city', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Abeokuta"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Order Notes (Optional)</h2>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => updateForm('notes', e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground mb-1">Payment Method</h2>
              <p className="text-xs text-muted-foreground mb-4">Select your preferred payment method.</p>
              <div className="space-y-2.5">
                {([
                  { value: 'paystack', label: 'Paystack', desc: 'Pay with card, bank transfer or USSD' },
                  { value: 'flutterwave', label: 'Flutterwave', desc: 'Multiple payment options' },
                  { value: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer — details provided after order' },
                ] as const).map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-sm font-bold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {orderError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-600">
                <Icon name="ExclamationCircleIcon" size={18} className="shrink-0" />
                {orderError}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="text-base font-bold text-foreground mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <AppImage src={item.image} alt={item.alt} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-foreground shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold text-foreground">
                    {deliveryMethod === 'pickup' ? 'Free (Pickup)' : formatPrice(DELIVERY_FEE)}
                  </span>
                </div>
                <div className="border-t border-border pt-2.5 flex justify-between">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-base font-extrabold text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={orderStatus === 'placing'}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {orderStatus === 'placing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  <>
                    <Icon name="LockClosedIcon" size={16} />
                    Place Order — {formatPrice(grandTotal)}
                  </>
                )}
              </button>

              <div className="mt-4 flex flex-col gap-2">
                {['SSL Secured checkout', '100% genuine products', 'Easy refund policy'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="ShieldCheckIcon" size={13} className="text-primary shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}