'use client';
import { User, Wallet, MapPin, Bell, ChevronRight, TrendingUp, Package, RefreshCw } from 'lucide-react';

const walletTxns = [
  { id: 1, type: 'debit', label: 'Order ORD-1001', amount: 140, date: 'Apr 17', balance: 400 },
  { id: 2, type: 'credit', label: 'Wallet Top-up', amount: 500, date: 'Apr 15', balance: 540 },
  { id: 3, type: 'debit', label: 'Order ORD-1000', amount: 115, date: 'Apr 14', balance: 40 },
  { id: 4, type: 'credit', label: 'Refund ORD-0998', amount: 70, date: 'Apr 12', balance: 155 },
];

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="rounded-3xl p-8 mb-6 text-white" style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F,#40916C)' }}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>P</div>
          <div>
            <h1 className="text-2xl font-bold">Priya Sharma</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>+91 9876543210 · priya.sharma@gmail.com</p>
            <div className="flex gap-4 mt-3">
              {[['48', 'Orders'], ['1', 'Subscription'], ['4.9★', 'Rating']].map(([v, l]) => (
                <div key={l}><p className="font-bold" style={{ color: '#E9C46A' }}>{v}</p><p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{l}</p></div>
              ))}
            </div>
          </div>
          <button className="btn ml-auto" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '999px', padding: '8px 20px', fontSize: '0.85rem' }}>Edit Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: '#1B2D2A' }}><Wallet size={20} style={{ color: '#2D6A4F' }} /> Wallet</h2>
            <button className="btn btn-primary btn-sm">+ Add Money</button>
          </div>
          <div className="rounded-2xl p-5 mb-4 text-white" style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>
            <p className="text-sm opacity-75">Available Balance</p>
            <p className="text-4xl font-extrabold mt-1">₹540</p>
          </div>
          <div className="space-y-3">
            {walletTxns.map(txn => (
              <div key={txn.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1B2D2A' }}>{txn.label}</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{txn.date}</p>
                </div>
                <span className="font-bold text-sm" style={{ color: txn.type === 'credit' ? '#52B788' : '#E63946' }}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Settings */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, label: 'Total Orders', val: '48', color: '#2D6A4F' },
              { icon: RefreshCw, label: 'Active Subs', val: '1', color: '#F4A261' },
              { icon: Wallet, label: 'Total Spent', val: '₹12.4K', color: '#3B82F6' },
              { icon: TrendingUp, label: 'Member Since', val: 'Jan 2026', color: '#52B788' },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="bg-white rounded-xl p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Icon size={18} style={{ color }} />
                <p className="font-bold text-lg mt-1" style={{ color: '#1B2D2A' }}>{val}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Settings items */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {[
              { icon: MapPin, label: 'Saved Addresses', sub: '1 address saved' },
              { icon: Bell, label: 'Notifications', sub: 'SMS & in-app enabled' },
              { icon: User, label: 'Account Settings', sub: 'Edit name, email, phone' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <button key={label} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors" style={{ borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,106,79,0.08)' }}>
                  <Icon size={18} style={{ color: '#2D6A4F' }} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#1B2D2A' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{sub}</p>
                </div>
                <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
