'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { Star, MapPin, Shield, ChevronLeft, Minus, Plus, Calendar, Zap } from 'lucide-react';
import { use } from 'react';
import { products as mockProducts } from '@/lib/mock-data/products';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<'buy' | 'subscribe'>('buy');
  const [schedule, setSchedule] = useState('daily');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchFromAPI(`/product/catalog/${unwrappedParams.id}`);
        setProduct(data.product);
      } catch (_err: any) {
        const fallback = mockProducts.find((item) => item.id === unwrappedParams.id);
        if (fallback) {
          setProduct(fallback);
          setWarning('Unable to reach the product API. Showing offline product data.');
          setError(null);
        } else {
          setError('Unable to reach the product API or find the item offline.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [unwrappedParams.id]);

  const handleAdd = () => { setAdded(true); setTimeout(() => setAdded(false), 2000); };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52B788]"></div>
      </div>
    );
  }

  if (error || (!product && !warning)) {
    return <div className="text-red-500 pt-20 text-center">Failed to load product: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/products" className="flex items-center gap-2 text-sm mb-6" style={{ color: '#6B7280' }}>
        <ChevronLeft size={16} /> Back to Products
      </Link>

      {warning && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {warning}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="relative h-96 rounded-3xl overflow-hidden bg-gray-50">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
            {product.tag && <span className="badge badge-success absolute top-5 left-5 text-sm py-1 px-4">{product.tag}</span>}
          </div>
          {/* Farm trust info */}
          <div className="mt-4 p-4 rounded-2xl" style={{ background: 'rgba(45,106,79,0.06)', border: '1px solid rgba(45,106,79,0.15)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#2D6A4F' }}>🌿 Farm Transparency</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} style={{ color: '#2D6A4F', marginTop: 2 }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#1B2D2A' }}>{product.farmName}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{product.farmLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield size={14} style={{ color: '#2D6A4F', marginTop: 2 }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#1B2D2A' }}>{product.certification}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Verified certification</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= Math.round(product.rating) ? '#F4A261' : '#E5E7EB'} stroke="none" />)}
            <span className="text-sm font-semibold ml-1">{product.rating}</span>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>({product.reviews} reviews)</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1B2D2A' }}>{product.name}</h1>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{product.description}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold" style={{ color: '#2D6A4F' }}>₹{product.price}</span>
            <span style={{ color: '#6B7280' }}>per {product.unit}</span>
            <span className="badge badge-success ml-2">{product.stock} in stock</span>
          </div>

          {/* Mode Toggle */}
          {product.isSubscriptionEligible && (
            <div className="flex rounded-2xl overflow-hidden mb-6" style={{ border: '1.5px solid #E5E7EB' }}>
              <button id="buy-once-tab" onClick={() => setMode('buy')} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${mode === 'buy' ? 'text-white' : ''}`} style={{ background: mode === 'buy' ? 'linear-gradient(135deg,#2D6A4F,#40916C)' : 'white', color: mode === 'buy' ? 'white' : '#6B7280' }}>
                <Zap size={15} /> Buy Once
              </button>
              <button id="subscribe-tab" onClick={() => setMode('subscribe')} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all`} style={{ background: mode === 'subscribe' ? 'linear-gradient(135deg,#F4A261,#E9C46A)' : 'white', color: mode === 'subscribe' ? 'white' : '#6B7280' }}>
                <Calendar size={15} /> Subscribe & Save 10%
              </button>
            </div>
          )}

          {/* Subscribe schedule */}
          {mode === 'subscribe' && (
            <div className="mb-5 p-4 rounded-2xl animate-fadeIn" style={{ background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.25)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#b05e1a' }}>Delivery Schedule</p>
              <div className="flex gap-2">
                {[['daily', 'Every Day'], ['alternate_day', 'Every 2nd Day'], ['custom', 'Custom']].map(([val, lbl]) => (
                  <button key={val} onClick={() => setSchedule(val)} className={`btn btn-sm ${schedule === val ? 'btn-secondary' : ''}`}
                    style={{ border: schedule !== val ? '1.5px solid #F4A261' : 'none', color: schedule !== val ? '#b05e1a' : 'white', background: schedule !== val ? 'white' : undefined, borderRadius: '999px', fontSize: '0.78rem' }}>
                    {lbl}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#6B7280' }}>You save ₹{Math.round(product.price * 0.1)} per order · Pause or cancel anytime</p>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold" style={{ color: '#1B2D2A' }}>Quantity</p>
            <div className="flex items-center rounded-2xl overflow-hidden" style={{ border: '1.5px solid #E5E7EB' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50" style={{ borderRight: '1px solid #E5E7EB' }}><Minus size={16} /></button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50" style={{ borderLeft: '1px solid #E5E7EB' }}><Plus size={16} /></button>
            </div>
            <span className="text-sm" style={{ color: '#6B7280' }}>₹{(product.price * qty * (mode === 'subscribe' ? 0.9 : 1)).toFixed(0)} total</span>
          </div>

          <button id="add-to-cart-btn" onClick={handleAdd} className={`btn btn-lg w-full ${added ? '' : 'btn-primary'}`} style={added ? { background: '#52B788' } : {}}>
            {added ? '✓ Added to Cart!' : mode === 'subscribe' ? '📅 Subscribe Now' : '🛒 Add to Cart'}
          </button>

          {/* Tags */}
          <div className="flex gap-2 mt-5 flex-wrap">
            <span className="badge badge-organic">{product.certification}</span>
            <span className="badge badge-info">🔬 Purity Tested</span>
            <span className="badge badge-success">🌱 No Pesticides</span>
          </div>
        </div>
      </div>
    </div>
  );
}
