'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { products } from '@/lib/mock-data/products';
import { mySubscriptions } from '@/lib/mock-data/subscriptions';
import { fetchFromAPI } from '@/lib/api-client';
import { Calendar, Pause, Play, X, SkipForward, RefreshCw, ArrowRight } from 'lucide-react';

type Status = 'active' | 'paused' | 'cancelled';

type Subscription = {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  schedule: string;
  status: Status;
  startDate: string;
  nextDelivery: string;
  deliveryAddress: string;
  monthlyValue: number;
};

export default function SubscriptionsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mySubs, setMySubs] = useState<Subscription[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [error, setError] = useState<string | null>(null);

  const availableSubscriptions = products.filter((p) => p.isSubscriptionEligible).slice(0, 6);
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userId = localStorage.getItem('organic_user_id');
    if (!userId) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    async function loadUserSubscriptions() {
      setIsLoggedIn(true);
      try {
        const data = await fetchFromAPI(`/user/${userId}/subscriptions`);
        const apiSubscriptions: any[] = Array.isArray(data) ? data : data.subscriptions || [];
        const mapped = apiSubscriptions.map((sub) => {
          const product = productMap[sub.product_id] || { image: '/products/milk.png' };
          return {
            id: sub.id,
            userId: sub.user_id,
            customerName: 'You',
            customerPhone: '',
            productId: sub.product_id,
            productName: sub.product_name,
            productImage: product.image,
            quantity: sub.quantity,
            schedule: sub.schedule,
            status: sub.status as Status,
            startDate: sub.created_at,
            nextDelivery: sub.next_delivery_date,
            deliveryAddress: sub.delivery_address || 'Your default address',
            monthlyValue: sub.quantity * 70,
          };
        });

        setMySubs(mapped);
        setStatuses(Object.fromEntries(mapped.map((s) => [s.id, s.status])));
      } catch (_err: any) {
        const fallback = mySubscriptions.filter((sub) => sub.userId === userId);
        if (fallback.length > 0) {
          setMySubs(fallback);
          setStatuses(Object.fromEntries(fallback.map((s) => [s.id, s.status])));
          setError('Could not reach the API. Showing your cached subscription preview instead.');
        } else {
          setError('Unable to load your subscriptions right now.');
          setMySubs([]);
          setStatuses({});
        }
      } finally {
        setLoading(false);
      }
    }

    loadUserSubscriptions();
  }, []);

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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52B788]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Subscriptions</h1>
          <p className="section-subtitle">Explore organic subscription plans and see your active recurring deliveries when logged in.</p>
        </div>
        <a href="/products" className="btn btn-primary btn-sm"><RefreshCw size={15} /> Browse Subscription Products</a>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1B2D2A' }}>Available Subscription Offers</h2>
            <p className="text-sm text-gray-500">Attract new customers with curated organic subscription plans from certified farms.</p>
          </div>
          {!isLoggedIn && (
            <div className="text-right text-sm text-gray-500">Login to view your personal subscriptions.</div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSubscriptions.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-green-200 block">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-50 mb-4">
                <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge badge-success">Subscribe</span>
                  {product.tag && <span className="badge badge-muted">{product.tag}</span>}
                </div>
                <h3 className="font-semibold text-lg" style={{ color: '#1B2D2A' }}>{product.name}</h3>
                <p className="text-xs text-gray-500">{product.farmName} · {product.farmLocation}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-green-700">₹{product.price}</span>
                  <span className="text-xs text-gray-500">/{product.unit}</span>
                </div>
                <button className="btn btn-primary btn-sm w-full mt-3 flex items-center justify-center gap-1" onClick={(e) => e.preventDefault()}>
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {isLoggedIn ? (
        mySubs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-5xl mb-4">📦</p>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1B2D2A' }}>No active subscriptions yet</h2>
            <p className="text-sm text-gray-500 mb-6">When you sign up, your recurring orders will appear here along with pause/resume controls.</p>
            <a href="/products" className="btn btn-primary">Subscribe Today</a>
          </div>
        ) : (
          <>
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
          </>
        )
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B2D2A' }}>Login to see your subscriptions</h2>
          <p className="text-sm text-gray-500 mb-6">Once you sign in, we will show your active recurring orders here.</p>
          <a href="/" className="btn btn-primary">Login / Register</a>
        </div>
      )}
    </div>
  );
}
