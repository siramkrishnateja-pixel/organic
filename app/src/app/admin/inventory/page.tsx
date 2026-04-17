'use client';
import { useState } from 'react';
import { inventory } from '@/lib/mock-data/inventory';
import { AlertTriangle, Plus } from 'lucide-react';

const statusStyle: Record<string, string> = { fresh: 'badge-success', expiring_soon: 'badge-danger', expired: 'badge-muted' };

export default function AdminInventoryPage() {
  const [showForm, setShowForm] = useState(false);
  const expiring = inventory.filter(i => i.status === 'expiring_soon');

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory & Production</h1>
          <p style={{ color: '#64748B' }}>Track stock, batches, expiry and wastage</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> Log Production
        </button>
      </div>

      {/* Alerts */}
      {expiring.length > 0 && (
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)' }}>
          <AlertTriangle size={20} style={{ color: '#E63946' }} />
          <p className="text-sm" style={{ color: '#E63946' }}>
            <strong>{expiring.length} batches expiring soon:</strong> {expiring.map(b => b.productName).join(', ')}
          </p>
        </div>
      )}

      {/* Production entry form */}
      {showForm && (
        <div className="admin-card mb-6 animate-fadeIn">
          <h3 className="font-bold text-white mb-4">Log New Production Batch</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[['Product', 'text', 'Select product…'], ['Batch Number', 'text', 'e.g. BATCH-M-2029'], ['Quantity (units)', 'number', '0'],
              ['Production Date', 'date', ''], ['Expiry Date', 'date', ''], ['Notes', 'text', 'Optional notes…']].map(([label, type, placeholder]) => (
              <div key={label as string}>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>{label}</label>
                <input type={type as string} placeholder={placeholder as string} className="input-field text-sm" style={{ background: '#0F1923', borderColor: '#1E3A4A', color: '#E2E8F0' }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary">Save Batch</button>
            <button onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ color: '#64748B' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1E3A4A' }}>
        <table className="data-table data-table-dark w-full">
          <thead>
            <tr>{['Product', 'Category', 'Batch', 'Qty', 'Produced', 'Expires', 'Days Left', 'Wastage', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td className="font-medium text-white">{item.productName}</td>
                <td><span className="badge badge-muted">{item.category}</span></td>
                <td className="font-mono text-xs" style={{ color: '#64748B' }}>{item.batchNumber}</td>
                <td className="font-bold text-white">{item.quantity}</td>
                <td className="text-sm" style={{ color: '#94A3B8' }}>{item.productionDate}</td>
                <td className="text-sm" style={{ color: item.daysToExpiry <= 2 ? '#E63946' : '#94A3B8', fontWeight: item.daysToExpiry <= 2 ? 700 : 400 }}>{item.expiryDate}</td>
                <td>
                  <span style={{ color: item.daysToExpiry <= 2 ? '#E63946' : item.daysToExpiry <= 5 ? '#F4A261' : '#52B788', fontWeight: 700 }}>
                    {item.daysToExpiry}d
                  </span>
                </td>
                <td>
                  <span style={{ color: item.wastage > 0 ? '#F4A261' : '#52B788' }}>{item.wastage > 0 ? `${item.wastage} units` : '—'}</span>
                </td>
                <td><span className={`badge ${statusStyle[item.status]}`}>{item.status.replace(/_/g, ' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
