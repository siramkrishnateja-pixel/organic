'use client';
import { useState } from 'react';
import { orders } from '@/lib/mock-data/orders';
import { Eye } from 'lucide-react';

const myOrders = orders.filter(o => o.userId === 'u1');

const statusColors: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-info', out_for_delivery: 'badge-info',
  delivered: 'badge-success', failed: 'badge-danger', cancelled: 'badge-muted', refunded: 'badge-muted',
};

export default function OrdersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? myOrders : myOrders.filter(o => o.status === filter);
  const selectedOrder = orders.find(o => o.id === selected);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="section-title mb-2">My Orders</h1>
      <p className="section-subtitle mb-6">Track and manage your deliveries</p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'delivered', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm shrink-0 ${filter === f ? 'btn-primary' : ''}`}
            style={{ borderRadius: '999px', border: filter !== f ? '1.5px solid #E5E7EB' : 'none', background: filter !== f ? 'white' : undefined, color: filter !== f ? '#6B7280' : 'white', textTransform: 'capitalize' }}>
            {f === 'all' ? 'All Orders' : f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold" style={{ color: '#1B2D2A' }}>{order.id}</span>
                  <span className={`badge ${statusColors[order.status] || 'badge-muted'}`}>{order.status.replace(/_/g, ' ')}</span>
                  <span className="badge badge-muted">{order.orderType === 'subscription' ? '📅 Sub' : '🛒 Once'}</span>
                </div>
                <p className="text-sm" style={{ color: '#6B7280' }}>{order.createdAt.split('T')[0]} · {order.deliverySlot} · ₹{order.totalAmount}</p>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                </p>
              </div>
              <button id={`view-order-${order.id}`} onClick={() => setSelected(order.id)} className="btn btn-outline btn-sm flex items-center gap-1">
                <Eye size={14} /> Details
              </button>
            </div>
            {order.status === 'out_for_delivery' && (
              <div className="mt-3 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <span className="animate-pulse-soft text-lg">🚚</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1d4ed8' }}>Out for Delivery</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Expected by {order.deliverySlot}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-4xl mb-3">📦</p><p className="font-semibold" style={{ color: '#6B7280' }}>No orders found</p></div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: '#1B2D2A' }}>{selectedOrder.id}</h2>
              <button onClick={() => setSelected(null)} className="btn btn-ghost btn-icon">✕</button>
            </div>
            <span className={`badge ${statusColors[selectedOrder.status]}`}>{selectedOrder.status.replace(/_/g, ' ')}</span>
            <div className="mt-4 space-y-3">
              {selectedOrder.items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>{item.name} ×{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4" style={{ borderColor: '#F3F4F6' }}>
              <div className="flex justify-between font-bold"><span>Total</span><span style={{ color: '#2D6A4F' }}>₹{selectedOrder.totalAmount}</span></div>
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>📍 {selectedOrder.deliveryAddress}</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>🕐 {selectedOrder.deliverySlot} · {selectedOrder.deliveryDate}</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>💳 {selectedOrder.paymentMethod === 'dummy' ? 'Online (Test)' : 'Wallet'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
