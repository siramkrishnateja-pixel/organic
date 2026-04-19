'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Shield, Leaf, Truck, Star, ChevronRight, CheckCircle } from 'lucide-react';
import { fetchFromAPI } from '@/lib/api-client';
import { products as mockProducts } from '@/lib/mock-data/products';

const categories = [
  { id: 'all', name: 'All Products', icon: '🛒' },
  { id: 'dairy', name: 'Milk & Dairy', icon: '🥛' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
  { id: 'oils', name: 'Organic Oils', icon: '🫒' }
];

const trustPoints = [
  { icon: '🌿', title: 'Certified Organic', desc: 'NPOP & India Organic certified farms' },
  { icon: '🚚', title: 'Farm to Door', desc: 'Harvested & delivered same day' },
  { icon: '🔬', title: 'Quality Tested', desc: 'Every batch tested for purity' },
  { icon: '♻️', title: 'Zero Waste', desc: 'Demand-driven production' },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchFromAPI('/product/catalog');
        if (data.status === 'success') {
          setProducts(data.products || []);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Failed to load products');
        setProducts(mockProducts);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 6);
  const filtered = activeCategory === 'all' ? featuredProducts : featuredProducts.filter(p => p.category.toLowerCase().includes(activeCategory));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fresh products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Unable to load products</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-bg text-white relative" style={{ padding: '72px 0 80px' }}>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <span className="badge badge-success mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Leaf size={12} /> Fresh Organic Delivery
              </span>
              <h1 className="text-5xl font-extrabold leading-tight mb-4">
                Pure Organic.<br />
                <span style={{ color: '#E9C46A' }}>Delivered Daily.</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '480px' }}>
                Subscribe to fresh A2 milk, organic ghee, cold-pressed oils and farm-fresh vegetables — straight from certified farms to your doorstep.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/products" className="btn btn-secondary btn-lg animate-float">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link href="/subscriptions" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                  Subscribe & Save
                </Link>
              </div>
              <div className="flex gap-6 mt-10">
                {[['12+', 'Products'], ['287', 'Subscribers'], ['4.8★', 'Rating']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-2xl font-bold" style={{ color: '#E9C46A' }}>{val}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero image */}
            <div className="hidden lg:flex justify-center items-center animate-fadeInUp delay-200">
              <div className="relative">
                <div className="w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/products/milk.png" alt="Fresh Organic Milk" width={280} height={280} className="object-contain drop-shadow-2xl" />
                </div>
                {/* Floating badges */}
                <div className="glass absolute top-6 -left-8 rounded-2xl p-3 text-sm font-semibold flex items-center gap-2" style={{ color: '#1B2D2A' }}>
                  <CheckCircle size={16} className="text-green-600" /> NPOP Certified
                </div>
                <div className="glass absolute bottom-10 -right-6 rounded-2xl p-3 text-sm font-semibold" style={{ color: '#1B2D2A' }}>
                  🚚 Same Day Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Sourced from certified organic farms across India</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map((cat, i) => (
            <Link key={cat.id} href={`/products?cat=${cat.id}`}
              className={`card-lift p-6 rounded-2xl text-center cursor-pointer animate-fadeInUp delay-${(i+1)*100}`}
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '2px solid transparent' }}>
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-semibold text-sm" style={{ color: '#1B2D2A' }}>{cat.name}</p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                {products.filter(p => p.category === cat.id).length} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Today&apos;s Fresh Picks</h2>
            <p className="section-subtitle">Harvested this morning, delivered today</p>
          </div>
          <Link href="/products" className="btn btn-outline btn-sm hidden md:flex">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`btn btn-sm shrink-0 ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '999px', fontSize: '0.8rem' }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <Link key={product.id} href={`/products/${product.id}`} className={`product-card block animate-fadeInUp delay-${(i % 3 + 1) * 100}`}>
              <div className="relative h-52 bg-gray-50">
                <Image src={product.image_url || product.image || '/products/placeholder.png'} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                <span className="sub-tag absolute top-3 right-3">Subscribe</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>{product.farm_info || `${product.farmName || ''}${product.farmLocation ? ` · ${product.farmLocation}` : ''}`}</p>
                <h3 className="font-semibold text-base mb-1" style={{ color: '#1B2D2A' }}>{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} fill="#F4A261" stroke="none" />
                  <span className="text-xs font-medium">{product.rating || 4.5}</span>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>({product.reviews || 0})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold" style={{ color: '#2D6A4F' }}>₹{product.price}</span>
                    <span className="text-xs ml-1" style={{ color: '#6B7280' }}>/ {product.unit}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={e => e.preventDefault()}>Add</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="hero-bg text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Why Families Trust Us</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>From certified farms to your kitchen — transparency at every step</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustPoints.map((t, i) => (
              <div key={i} className="trust-badge animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-3xl">{t.icon}</span>
                <p className="font-bold text-sm">{t.title}</p>
                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="rounded-3xl p-10 text-center shadow-md mb-8" style={{ background: 'linear-gradient(135deg,#F4A261,#E9C46A)' }}>
          <h2 className="text-3xl font-bold text-white mb-3">Subscribe & Save Up to 15%</h2>
          <p className="text-white mb-6" style={{ opacity: 0.9 }}>Daily or alternate-day delivery. Pause anytime. No lock-ins.</p>
          <Link href="/subscriptions" className="btn btn-lg shadow-sm" style={{ background: 'white', color: '#2D6A4F' }}>
            Start Subscription <ArrowRight size={18} />
          </Link>
        </div>

        {/* Promo Coupon Banner */}
        <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(82, 183, 136, 0.1)', border: '2px dashed #52B788' }}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-green-700 shadow-sm">
              Exclusive Offer
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1B2D2A' }}>
              Special Rewards for You
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              We love treating our community! Use code <strong className="text-green-700">WELCOME5</strong> on your 1st purchase for a <strong>5% flat discount</strong>. 
              As a gesture of our appreciation, after your 29th purchase, you will automatically unlock another <strong>5% lifetime discount</strong> on all future orders!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
