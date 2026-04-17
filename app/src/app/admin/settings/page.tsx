'use client';
import { Save, Bell, Clock, Tag, Store } from 'lucide-react';

const slots = ['6AM-9AM', '9AM-12PM', '12PM-3PM', '3PM-6PM'];
const coupons = [
  { code: 'ORGANIC10', type: 'percentage', value: 10, uses: 47, active: true },
  { code: 'WELCOME50', type: 'flat', value: 50, uses: 112, active: true },
  { code: 'DAIRY20', type: 'percentage', value: 20, uses: 23, active: false },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p style={{ color: '#64748B' }}>Configure your business preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="admin-card">
          <h2 className="font-bold text-white mb-5 flex items-center gap-2"><Store size={18} style={{ color: '#2D6A4F' }} /> Business Info</h2>
          <div className="space-y-4">
            {[['Business Name', 'OrganicFarm Pvt Ltd'], ['Owner Name', 'Admin User'], ['Email', 'admin@organicfarm.in'], ['Phone', '+91 9000000000'], ['GST Number', '29ABCDE1234F1Z5'], ['Address', '123 Farm Road, Bangalore - 560001']].map(([l, v]) => (
              <div key={l as string}>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>{l}</label>
                <input defaultValue={v as string} className="input-field text-sm" style={{ background: '#0F1923', borderColor: '#1E3A4A', color: '#E2E8F0' }} />
              </div>
            ))}
            <button className="btn btn-primary flex items-center gap-2"><Save size={15} /> Save Business Info</button>
          </div>
        </div>

        {/* Delivery Slots */}
        <div className="admin-card">
          <h2 className="font-bold text-white mb-5 flex items-center gap-2"><Clock size={18} style={{ color: '#F4A261' }} /> Delivery Slots</h2>
          <div className="space-y-3">
            {slots.map(slot => (
              <div key={slot} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#0F1923', border: '1px solid #1E3A4A' }}>
                <span className="text-sm text-white font-medium">{slot}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#64748B' }}>Max: 50 orders</span>
                  <div className="w-10 h-5 rounded-full bg-green-600 relative cursor-pointer">
                    <span className="absolute right-1 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-bold text-white mt-6 mb-4 flex items-center gap-2"><Bell size={18} style={{ color: '#3B82F6' }} /> Notifications</h2>
          {[['Order Confirmation SMS', true], ['Delivery Alert SMS', true], ['Subscription Reminder', false], ['Low Stock Email', true]].map(([l, v]) => (
            <div key={l as string} className="flex items-center justify-between py-2">
              <span className="text-sm" style={{ color: '#94A3B8' }}>{l}</span>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer ${v ? 'bg-green-600' : 'bg-gray-600'}`}>
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: v ? '22px' : '2px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Coupons */}
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white flex items-center gap-2"><Tag size={18} style={{ color: '#52B788' }} /> Coupon Management</h2>
            <button className="btn btn-primary btn-sm">+ New Coupon</button>
          </div>
          <table className="data-table data-table-dark w-full">
            <thead><tr>{['Code', 'Discount', 'Uses', 'Status', 'Action'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.code}>
                  <td className="font-mono font-bold" style={{ color: '#52B788' }}>{c.code}</td>
                  <td style={{ color: '#E2E8F0' }}>{c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}</td>
                  <td style={{ color: '#94A3B8' }}>{c.uses} uses</td>
                  <td><span className={`badge ${c.active ? 'badge-success' : 'badge-muted'}`}>{c.active ? 'Active' : 'Disabled'}</span></td>
                  <td>
                    <button className="btn btn-sm" style={{ background: '#0F1923', color: c.active ? '#E63946' : '#52B788', border: '1px solid #1E3A4A', borderRadius: '8px', padding: '4px 12px', fontSize: '0.75rem' }}>
                      {c.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
