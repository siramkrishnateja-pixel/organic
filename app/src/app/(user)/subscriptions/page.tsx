'use client';
import Image from 'next/image';
import { useState } from 'react';
import { subscriptions } from '@/lib/mock-data/subscriptions';
import { Calendar, Pause, Play, X, SkipForward, RefreshCw } from 'lucide-react';

const mySubIds = ['SUB-001', 'SUB-002'];
const mySubs = subscriptions.filter(s => mySubIds.includes(s.id));

type Status = 'active' | 'paused' | 'cancelled';

export default function SubscriptionsPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(mySubs.map(s => [s.id, s.status as Status]))
  );

  const toggle = (id: string) => setStatuses(prev => ({ ...prev, [id]: prev[id] === 'active' ? 'paused' : 'active' }));

  const upcoming = [
    { date: 'Apr 18', day: 'Thu', items: ['A2 Milk × 2'] },
    { date: 'Apr 19', day: 'Fri', items: ['A2 Milk × 2'] },
    { date: 'Apr 20', day: 'Sat', items: ['A2 Milk × 2'] },
    { date: 'Apr 21', day: 'Sun', items: ['A2 Milk × 2'] },
    { date: 'Apr 22', day: 'Mon', items: ['A2 Milk × 2'] },
    { date: 'Apr 23', day: 'Tue', items: ['A2 Milk × 2'] },
    { date: 'Apr 24', day: 'Wed', items: ['A2 Milk × 2'] },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">My Subscriptions</h1>
          <p className="section-subtitle">Manage your recurring deliveries</p>
        </div>
        <a href="/products" className="btn btn-primary btn-sm"><RefreshCw size={15} /> New Subscription</a>
      </div>

      {/* Active Subscriptions */}
      <div className="space-y-4 mb-10">
        {mySubs.map(sub => {
          const status = statuses[sub.id];
          return (
            <div key={sub.id} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex gap-4 items-start">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <Image src={sub.productImage} alt={sub.productName} fill className="object-cover" unoptimized={sub.productImage.startsWith('http')} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-lg" style={{ color: '#1B2D2A' }}>{sub.productName}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>Qty: {sub.quantity} · {sub.schedule === 'daily' ? 'Daily' : 'Every 2nd day'}</p>
                    </div>
                    <span className={`badge ${status === 'active' ? 'badge-success' : status === 'paused' ? 'badge-warning' : 'badge-muted'}`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Calendar size={14} style={{ color: '#6B7280' }} />
                    <span className="text-sm" style={{ color: '#6B7280' }}>Next delivery: <strong>{sub.nextDelivery}</strong></span>
                    <span className="text-sm ml-2" style={{ color: '#2D6A4F', fontWeight: 600 }}>₹{sub.quantity * 70}/delivery</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                <button onClick={() => toggle(sub.id)} className={`btn btn-sm ${status === 'active' ? 'btn-outline' : 'btn-primary'} flex items-center gap-1`}>
                  {status === 'active' ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Resume</>}
                </button>
                <button className="btn btn-sm btn-outline flex items-center gap-1"><SkipForward size={13} /> Skip Next</button>
                <button className="btn btn-sm flex items-center gap-1 ml-auto" style={{ color: '#E63946', border: '1.5px solid #fca5a5', borderRadius: '999px', padding: '6px 16px', fontSize: '0.8rem' }}>
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Calendar */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: '#1B2D2A' }}>
          <Calendar size={20} style={{ color: '#2D6A4F' }} /> Upcoming Deliveries
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {upcoming.map(({ date, day, items }) => (
            <div key={date} className="text-center rounded-xl p-3" style={{ background: 'rgba(45,106,79,0.07)', border: '1px solid rgba(45,106,79,0.1)' }}>
              <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>{day}</p>
              <p className="font-bold text-sm my-1" style={{ color: '#1B2D2A' }}>{date.split(' ')[1]}</p>
              <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs" style={{ background: '#2D6A4F', color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>✓</div>
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>{items[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
