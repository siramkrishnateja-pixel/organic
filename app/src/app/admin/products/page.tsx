'use client';
import Image from 'next/image';
import { products } from '@/lib/mock-data/products';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [prods, setProds] = useState(products);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <p style={{ color: '#64748B' }}>{prods.length} products across 4 categories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-6 animate-fadeIn">
          <h3 className="font-bold text-white mb-4">New Product</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[['Product Name','text','e.g. Organic Turmeric'], ['Category','text','dairy / vegetables / oils / farm'],
              ['Price (₹)','number','0'], ['Unit','text','e.g. 500gm'], ['Stock','number','0'],
              ['Farm Name','text',''], ['Farm Location','text',''], ['Certification','text','NPOP / India Organic']].map(([l,t,p]) => (
              <div key={l as string}>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>{l}</label>
                <input type={t as string} placeholder={p as string} className="input-field text-sm" style={{ background: '#0F1923', borderColor: '#1E3A4A', color: '#E2E8F0' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Product Image</label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-green-600 transition-colors" style={{ borderColor: '#1E3A4A' }}>
                <p className="text-xs" style={{ color: '#64748B' }}>📷 Click to upload</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Subscription Eligible</label>
              <div className="flex gap-3 mt-2">
                {['Yes', 'No'].map(v => <button key={v} className="btn btn-sm" style={{ background: v === 'Yes' ? '#2D6A4F' : '#0F1923', color: v === 'Yes' ? 'white' : '#64748B', border: '1px solid #1E3A4A', borderRadius: '8px' }}>{v}</button>)}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary">Save Product</button>
            <button onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ color: '#64748B' }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prods.map(product => (
          <div key={product.id} className="admin-card flex gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-800">
              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image.startsWith('http')} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm text-white leading-tight">{product.name}</p>
                <div className="flex gap-1 shrink-0">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:bg-opacity-10" style={{ color: '#64748B' }}><Edit size={13} /></button>
                  <button onClick={() => setProds(p => p.filter(x => x.id !== product.id))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500 hover:bg-opacity-20" style={{ color: '#64748B' }}><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-sm" style={{ color: '#52B788' }}>₹{product.price}</span>
                <span className="text-xs" style={{ color: '#64748B' }}>/ {product.unit}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{product.category}</span>
                <span className="text-xs" style={{ color: product.stock < 30 ? '#E63946' : '#64748B' }}>Stock: {product.stock}</span>
                {product.isSubscriptionEligible && <span className="text-xs" style={{ color: '#F4A261' }}>📅</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
