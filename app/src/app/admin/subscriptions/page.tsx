'use client';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { subscriptions as mockSubscriptions } from '@/lib/mock-data/subscriptions';

const statusColors: Record<string, string> = { active: 'badge-success', paused: 'badge-warning', cancelled: 'badge-muted' };

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const data = await fetchFromAPI('/admin/subscriptions');
        if (data.offline) {
          setSubs(mockSubscriptions);
        } else {
          setSubs(data.subscriptions || mockSubscriptions);
        }
      } catch (err: any) {
        console.error('Failed to load subscriptions:', err);
        setSubs(mockSubscriptions);
      } finally {
        setLoading(false);
      }
    }
    loadSubscriptions();
  }, []);

  const toggle = (id: string) => setSubs(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } as typeof s : s));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52B788]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 pt-20">Failed to load subscriptions: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p style={{ color: '#64748B' }}>{subs.filter(s => s.status === 'active').length} active · {subs.filter(s => s.status === 'paused').length} paused · {subs.filter(s => s.status === 'cancelled').length} cancelled</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[['Active', subs.filter(s=>s.status==='active').length, '#52B788'], ['Paused', subs.filter(s=>s.status==='paused').length, '#F4A261'], ['Cancelled', subs.filter(s=>s.status==='cancelled').length, '#64748B']].map(([l,v,c]) => (
          <div key={l as string} className="admin-card text-center">
            <p className="text-3xl font-extrabold" style={{ color: c as string }}>{v}</p>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{l} Subscriptions</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-x-auto" style={{ border: '1px solid #1E3A4A', width: '100%' }}>
        <table className="data-table data-table-dark w-full">
          <thead>
            <tr>{['Sub ID', 'Customer', 'Product', 'Schedule', 'Next Delivery', 'Monthly Value', 'Status', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {subs.map(sub => (
              <tr key={sub.id}>
                <td className="font-mono text-sm" style={{ color: '#52B788' }}>{sub.id}</td>
                <td>
                  <p className="font-medium text-sm text-white">{sub.customerName}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{sub.customerPhone}</p>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-800">
                      <Image src={sub.productImage} alt={sub.productName} fill className="object-cover" unoptimized={sub.productImage.startsWith('http')} />
                    </div>
                    <span className="text-sm text-white">{sub.productName}</span>
                  </div>
                </td>
                <td className="text-sm" style={{ color: '#94A3B8', textTransform: 'capitalize' }}>{sub.schedule.replace(/_/g,' ')} ×{sub.quantity}</td>
                <td className="text-sm text-white">{sub.nextDelivery}</td>
                <td className="font-bold" style={{ color: '#52B788' }}>₹{sub.monthlyValue > 0 ? sub.monthlyValue.toLocaleString() : '—'}</td>
                <td><span className={`badge ${statusColors[sub.status]}`}>{sub.status}</span></td>
                <td>
                  {sub.status !== 'cancelled' && (
                    <button onClick={() => toggle(sub.id)} className="btn btn-sm flex items-center gap-1" style={{ background: '#0F1923', color: '#94A3B8', border: '1px solid #1E3A4A', borderRadius: '8px', padding: '4px 12px', fontSize: '0.78rem' }}>
                      {sub.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
