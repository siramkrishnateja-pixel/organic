'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { products } from '@/lib/mock-data/products';
import { Minus, Plus, Trash2, Tag, Wallet, ArrowRight } from 'lucide-react';
import LoginModal from '@/components/LoginModal';

const initialCart = [
  { product: products[0], qty: 2 },
  { product: products[2], qty: 1 },
  { product: products[7], qty: 1 },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discountPct: number} | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('organic_user_role');
      if (role === 'customer' || role === 'admin') {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleApplyCoupon = () => {
    if (coupon === 'WELCOME5') {
       setAppliedCoupon({code: 'WELCOME5', discountPct: 0.05});
       setShowSubModal(true);
    } else if (coupon === 'ORGANIC10') {
       setAppliedCoupon({code: 'ORGANIC10', discountPct: 0.10});
       setShowSubModal(true);
    } else {
       alert("Invalid or expired coupon code");
    }
  };

  const updateQty = (id: string, delta: number) => setCart(c => c.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = (id: string) => setCart(c => c.filter(i => i.product.id !== id));
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discountPct) : 0;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-xl font-bold mb-2" style={{ color: '#1B2D2A' }}>Your cart is empty</p>
          <Link href="/products" className="btn btn-primary mt-4">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, qty }) => (
              <div key={product.id} className="bg-white rounded-2xl p-5 flex gap-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('http')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: '#6B7280' }}>{product.farmName}</p>
                  <p className="font-semibold" style={{ color: '#1B2D2A' }}>{product.name}</p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>₹{product.price} / {product.unit}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid #E5E7EB' }}>
                      <button onClick={() => updateQty(product.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                      <span className="w-8 text-center font-bold text-sm">{qty}</span>
                      <button onClick={() => updateQty(product.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
                    </div>
                    <span className="font-bold" style={{ color: '#2D6A4F' }}>₹{product.price * qty}</span>
                    <button onClick={() => remove(product.id)} className="ml-auto btn btn-ghost btn-icon" style={{ color: '#E63946' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 sticky top-36" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 className="font-bold text-lg mb-5" style={{ color: '#1B2D2A' }}>Order Summary</h2>

              {/* Wallet balance */}
              <div className="flex items-center justify-between p-3 rounded-xl mb-4" style={{ background: 'rgba(45,106,79,0.07)', border: '1px solid rgba(45,106,79,0.15)' }}>
                <div className="flex items-center gap-2">
                  <Wallet size={16} style={{ color: '#2D6A4F' }} />
                  <span className="text-sm font-medium">Wallet Balance</span>
                </div>
                <span className="font-bold" style={{ color: '#2D6A4F' }}>₹540</span>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input id="coupon-input" className="input-field pl-8 text-sm py-2" placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} />
                </div>
                <button id="apply-coupon-btn" onClick={handleApplyCoupon} className="btn btn-outline btn-sm">Apply</button>
              </div>
              {appliedCoupon && <p className="text-xs mb-3" style={{ color: '#52B788' }}>✓ {appliedCoupon.code} applied — {appliedCoupon.discountPct * 100}% off!</p>}

              {/* Price breakdown */}
              <div className="space-y-3 border-t pt-4 mb-4" style={{ borderColor: '#F3F4F6' }}>
                {[
                  ['Subtotal', `₹${subtotal}`],
                  ['Discount', appliedCoupon ? `-₹${discount}` : '—'],
                  ['Delivery', deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>{label}</span>
                    <span style={{ color: value.startsWith('-') ? '#52B788' : '#1B2D2A', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
                {subtotal > 500 && (
                  <p className="text-xs" style={{ color: '#52B788' }}>🎉 Free delivery on orders above ₹500</p>
                )}
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4 mb-5" style={{ borderColor: '#E5E7EB' }}>
                <span>Total</span>
                <span style={{ color: '#2D6A4F' }}>₹{total}</span>
              </div>

              {isLoggedIn ? (
                <Link href="/checkout" id="checkout-btn" className="btn btn-primary btn-lg w-full flex justify-center">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              ) : (
                <button id="checkout-login-btn" onClick={() => setIsLoginOpen(true)} className="btn btn-primary btn-lg w-full flex justify-center">
                  Login to Checkout <ArrowRight size={18} />
                </button>
              )}
              <Link href="/products" className="btn btn-ghost w-full text-center mt-2 text-sm">Continue Shopping</Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Subscription Upsell Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4 text-center animate-fadeInUp">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#1B2D2A' }}>You saved ₹{discount}!</h3>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Want to maximize your savings? Become a subscriber to lock in a <strong>flat 15% discount</strong> on all daily deliveries! No lock-ins, pause anytime.
            </p>
            <div className="space-y-3">
              <Link href="/subscriptions" className="btn btn-primary w-full flex justify-center py-3">
                Explore Subscriptions
              </Link>
              <button 
                onClick={() => setShowSubModal(false)} 
                className="w-full text-sm font-semibold transition-colors mt-2"
                style={{ color: '#6B7280' }}
              >
                No thanks, continue to checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} defaultRole="user" />
    </div>
  );
}
