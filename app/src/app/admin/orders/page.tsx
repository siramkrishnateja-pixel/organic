'use client';
import { useState } from 'react';
import { orders } from '@/lib/mock-data/orders';
import { Search, Filter, Download } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-info', out_for_delivery: 'badge-info',
  delivered: 'badge-success', failed: 'badge-danger', cancelled: 'badge-muted', refunded: 'badge-muted',
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => o.id.includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase()));

  const selectedOrder = orders.find(o => o.id === selected);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p style={{ color: '#64748B' }}>{orders.length} total orders · {orders.filter(o => o.status === 'pending').length} pending</p>
        </div>
        <button className="btn btn-sm flex items-center gap-2" style={{ background: '#162032', color: '#94A3B8', border: '1px solid #1E3A4A', borderRadius: '12px' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
          <input className="input-field pl-9 text-sm" style={{ background: '#162032', borderColor: '#1E3A4A', color: '#E2E8F0' }} placeholder="Search orders or customers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'delivered', 'out_for_delivery', 'failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : ''}`}
              style={{ borderRadius: '999px', border: statusFilter !== s ? '1px solid #1E3A4A' : 'none', background: statusFilter !== s ? '#162032' : undefined, color: statusFilter !== s ? '#64748B' : 'white', textTransform: 'capitalize', fontSize: '0.78rem' }}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-x-auto" style={{ border: '1px solid #1E3A4A', width: '100%' }}>
        <table className="data-table data-table-dark w-full">
          <thead>
            <tr>
              {['Order ID', 'Customer', 'Items', 'Amount', 'Type', 'Status', 'Date', 'Action'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(order.id)}>
                <td className="font-mono text-sm" style={{ color: '#52B788' }}>{order.id}</td>
                <td>
                  <p className="font-medium text-sm text-white">{order.customerName}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{order.customerPhone}</p>
                </td>
                <td className="text-sm" style={{ color: '#94A3B8', maxWidth: '180px' }}>
                  {order.items.map(i => i.name).join(', ').slice(0, 40)}…
                </td>
                <td className="font-bold text-white">₹{order.totalAmount}</td>
                <td><span className={`badge ${order.orderType === 'subscription' ? 'badge-primary' : 'badge-muted'}`}>{order.orderType === 'subscription' ? '📅 Sub' : '🛒 Once'}</span></td>
                <td><span className={`badge ${statusColors[order.status] || 'badge-muted'}`}>{order.status.replace(/_/g, ' ')}</span></td>
                <td className="text-xs" style={{ color: '#64748B' }}>{order.createdAt.split('T')[0]}</td>
                <td>
                  <select onClick={e => e.stopPropagation()} className="text-xs rounded-lg px-2 py-1" style={{ background: '#0F1923', color: '#94A3B8', border: '1px solid #1E3A4A' }}>
                    <option>Update Status</option>
                    <option>confirmed</option><option>out_for_delivery</option>
                    <option>delivered</option><option>failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: '#64748B' }}>No orders match your filters</div>
        )}
      </div>

      {/* Detail panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-slideInLeft" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md p-6 overflow-y-auto" style={{ background: '#162032', borderLeft: '1px solid #1E3A4A' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-white">{selectedOrder.id}</h2>
              <button onClick={() => setSelected(null)} className="text-white text-xl">✕</button>
            </div>
            <span className={`badge ${statusColors[selectedOrder.status]}`}>{selectedOrder.status.replace(/_/g, ' ')}</span>
            <div className="mt-6 space-y-4">
              <div className="admin-card">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>Customer</p>
                <p className="text-white font-semibold">{selectedOrder.customerName}</p>
                <p style={{ color: '#64748B' }}>{selectedOrder.customerPhone}</p>
              </div>
              <div className="admin-card">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>Items</p>
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm mb-2">
                    <span style={{ color: '#94A3B8' }}>{item.name} ×{item.quantity}</span>
                    <span className="text-white font-semibold">₹{item.subtotal}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 mt-2" style={{ borderColor: '#1E3A4A' }}>
                  <span style={{ color: '#94A3B8' }}>Total</span>
                  <span style={{ color: '#52B788' }}>₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
              <div className="admin-card text-sm space-y-2">
                <p style={{ color: '#94A3B8' }}>📍 {selectedOrder.deliveryAddress}</p>
                <p style={{ color: '#94A3B8' }}>🕐 {selectedOrder.deliverySlot} · {selectedOrder.deliveryDate}</p>
                <p style={{ color: '#94A3B8' }}>💳 {selectedOrder.paymentMethod === 'dummy' ? 'Online (Test)' : 'Wallet'}</p>
              </div>
              <select className="input-field text-sm" style={{ background: '#0F1923', borderColor: '#1E3A4A', color: '#E2E8F0' }}>
                <option>Update Status</option>
                <option>confirmed</option><option>out_for_delivery</option><option>delivered</option><option>failed</option>
              </select>
              <button className="btn btn-primary w-full">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
