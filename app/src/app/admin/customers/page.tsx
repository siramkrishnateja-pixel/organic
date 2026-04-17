'use client';
import React, { useState } from 'react';
import { customers } from '@/lib/mock-data/customers';
import { Search, Wallet, Package, RefreshCw } from 'lucide-react';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );
  const selectedCustomer = customers.find(c => c.id === selected);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p style={{ color: '#64748B' }}>{customers.length} registered · {customers.filter(c => c.activeSubscriptions > 0).length} with active subscriptions</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[['Total Customers', customers.length, '#2D6A4F'], ['Active Subscribers', customers.filter(c => c.activeSubscriptions > 0).length, '#3B82F6'], ['Avg. Wallet Balance', `₹${Math.round(customers.reduce((a, c) => a + c.walletBalance, 0) / customers.length)}`, '#F4A261']].map(([l, v, c]) => (
          <div key={l as string} className="admin-card text-center">
            <p className="text-2xl font-extrabold" style={{ color: c as string }}>{v}</p>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{l}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
        <input className="input-field pl-9 text-sm" style={{ background: '#162032', borderColor: '#1E3A4A', color: '#E2E8F0' }} placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1E3A4A' }}>
        <table className="data-table data-table-dark w-full">
          <thead><tr>{['Customer', 'Phone', 'Orders', 'Subscriptions', 'Total Spent', 'Wallet', 'Status', 'Details'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(c.id)}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>{c.name[0]}</div>
                    <div>
                      <p className="font-medium text-sm text-white">{c.name}</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#94A3B8' }}>{c.phone}</td>
                <td className="font-bold text-white">{c.totalOrders}</td>
                <td><span className={`badge ${c.activeSubscriptions > 0 ? 'badge-success' : 'badge-muted'}`}>{c.activeSubscriptions}</span></td>
                <td style={{ color: '#52B788', fontWeight: 600 }}>₹{c.totalSpent.toLocaleString()}</td>
                <td style={{ color: c.walletBalance > 0 ? '#E2E8F0' : '#64748B', fontWeight: 600 }}>₹{c.walletBalance}</td>
                <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-muted'}`}>{c.status}</span></td>
                <td>
                  <button className="btn btn-sm" style={{ background: '#0F1923', color: '#94A3B8', border: '1px solid #1E3A4A', borderRadius: '8px', padding: '4px 12px', fontSize: '0.75rem' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer detail panel */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-slideInLeft" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-sm p-6 overflow-y-auto" style={{ background: '#162032', borderLeft: '1px solid #1E3A4A' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <h2 className="font-bold text-xl text-white">{selectedCustomer.name}</h2>
              <button onClick={() => setSelected(null)} className="text-white">✕</button>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>{selectedCustomer.name[0]}</div>
            <p className="text-center text-sm mb-6" style={{ color: '#64748B' }}>{selectedCustomer.phone} · Joined {selectedCustomer.joinedDate}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {([
                { Icon: Package, label: 'Orders', val: selectedCustomer.totalOrders },
                { Icon: RefreshCw, label: 'Subs', val: selectedCustomer.activeSubscriptions },
                { Icon: Wallet, label: 'Spent', val: `₹${(selectedCustomer.totalSpent/1000).toFixed(1)}K` },
              ] as { Icon: React.ElementType; label: string; val: string | number }[]).map(({ Icon, label, val }) => (
                <div key={label} className="admin-card text-center p-3">
                  <Icon size={16} className="mx-auto mb-1" style={{ color: '#52B788' }} />
                  <p className="font-bold text-white text-sm">{val}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="admin-card mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>WALLET BALANCE</p>
              <p className="text-2xl font-extrabold" style={{ color: '#52B788' }}>₹{selectedCustomer.walletBalance}</p>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-sm btn-primary flex-1">+ Credit</button>
                <button className="btn btn-sm flex-1" style={{ background: '#0F1923', color: '#E63946', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '12px' }}>− Debit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
