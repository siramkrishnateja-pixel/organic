'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { products, categories } from '@/lib/mock-data/products';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [subOnly, setSubOnly] = useState(false);

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => !subOnly || p.isSubscriptionEligible)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : sortBy === 'price-desc' ? b.price - a.price : b.reviews - a.reviews);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Organic Products</h1>
        <p className="section-subtitle">All products from certified farms. Freshness guaranteed.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input id="product-search" className="input-field pl-11" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select id="sort-select" className="input-field" style={{ width: 'auto', cursor: 'pointer' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <button onClick={() => setSubOnly(!subOnly)} className={`btn btn-sm shrink-0 ${subOnly ? 'btn-primary' : 'btn-outline'}`}>
          🔄 Subscription Only
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat.id} id={`cat-${cat.id}`} onClick={() => setActiveCategory(cat.id)}
            className={`btn btn-sm shrink-0 ${activeCategory === cat.id ? 'btn-primary' : ''}`}
            style={{ borderRadius: '999px', border: activeCategory === cat.id ? 'none' : '1.5px solid #E5E7EB', background: activeCategory === cat.id ? undefined : 'white', color: activeCategory === cat.id ? 'white' : '#6B7280' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>{filtered.length} products found</p>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <Link key={product.id} href={`/products/${product.id}`} className="product-card block">
            <div className="relative h-48 bg-gray-50">
              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('http')} />
              {product.tag && <span className="absolute top-3 left-3 badge badge-success">{product.tag}</span>}
              {product.isSubscriptionEligible && <span className="sub-tag absolute top-3 right-3">📅 Sub</span>}
            </div>
            <div className="p-4">
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{product.farmName} · {product.farmLocation}</p>
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#1B2D2A' }}>{product.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <Star size={11} fill="#F4A261" stroke="none" />
                <span className="text-xs font-medium">{product.rating}</span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>({product.reviews})</span>
                <span className="badge badge-organic ml-auto">{product.certification}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold" style={{ color: '#2D6A4F' }}>₹{product.price}</span>
                  <span className="text-xs ml-1" style={{ color: '#9CA3AF' }}>/{product.unit}</span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={e => e.preventDefault()}>+ Add</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-semibold" style={{ color: '#1B2D2A' }}>No products found</p>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
