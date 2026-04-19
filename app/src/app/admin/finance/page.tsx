'use client';
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { fetchFromAPI } from '@/lib/api-client';
import { TrendingUp, TrendingDown, DollarSign, Percent, Plus } from 'lucide-react';

// Lazy load Recharts components for better performance
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then((m) => m.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((m) => m.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((m) => m.Legend), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((m) => m.Cell), { ssr: false });

type MonthlyPnLItem = {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
};

type RevenueCategory = {
  name: string;
  value: number;
  color: string;
};

type DashboardData = {
  revenueByCategory: RevenueCategory[];
  monthlyPnL: MonthlyPnLItem[];
};

const expenses = [
  { id: 1, category: 'Production Cost', subCategory: 'Milk Processing', amount: 28000, date: '2026-04-01', description: 'Daily milk processing costs' },
  { id: 2, category: 'Logistics', subCategory: 'Fuel', amount: 12000, date: '2026-04-01', description: 'Delivery vehicle fuel' },
  { id: 3, category: 'Operations', subCategory: 'Packaging', amount: 8500, date: '2026-04-05', description: 'Eco-friendly packaging material' },
  { id: 4, category: 'Operations', subCategory: 'Staff Salaries', amount: 35000, date: '2026-04-01', description: 'Monthly salaries' },
];

export default function AdminFinancePage() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadFinanceData() {
      try {
        const data = await fetchFromAPI('/admin/dashboard');
        // Use the full response which contains dashboardKPIs, monthlyPnL, revenueByCategory, etc.
        setDashboardData(data);
      } catch (err: any) {
        setError('Unable to load finance data. Please refresh to retry.');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    }

    loadFinanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52B788]"></div>
      </div>
    );
  }

  const memoizedChartData = useMemo(() => {
    const monthlyPnL = dashboardData?.monthlyPnL || [];
    const revenueByCategory = dashboardData?.revenueByCategory || [];
    const latestMonth = monthlyPnL[monthlyPnL.length - 1] || { revenue: 0, expense: 0, profit: 0 };
    const margin = latestMonth.profit && latestMonth.revenue ? ((latestMonth.profit / latestMonth.revenue) * 100).toFixed(1) : '0';
    return { monthlyPnL, revenueByCategory, latestMonth, margin };
  }, [dashboardData]);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance & P&L</h1>
          <p style={{ color: '#64748B' }}>April 2026 · Monthly summary</p>
        </div>
        <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> Log Expense
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Expense Form */}
      {showExpenseForm && (
        <div className="admin-card mb-6 animate-fadeIn">
          <h3 className="font-bold text-white mb-4">Log Expense</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[['Category', 'text', 'Production / Logistics / Operations'], ['Sub-Category', 'text', 'e.g. Fuel, Packaging'],
              ['Amount (₹)', 'number', '0'], ['Date', 'date', ''], ['Description', 'text', 'Optional description']].map(([l, t, p]) => (
              <div key={l as string}>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>{l}</label>
                <input type={t as string} placeholder={p as string} className="input-field text-sm" style={{ background: '#0F1923', borderColor: '#1E3A4A', color: '#E2E8F0' }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary">Save Expense</button>
            <button onClick={() => setShowExpenseForm(false)} className="btn btn-ghost" style={{ color: '#64748B' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${(memoizedChartData.latestMonth.revenue/1000).toFixed(1)}K`, icon: DollarSign, color: '#52B788', trend: 'up' },
          { label: 'Total Expenses', value: `₹${(memoizedChartData.latestMonth.expense/1000).toFixed(1)}K`, icon: TrendingDown, color: '#E63946', trend: 'down' },
          { label: 'Net Profit', value: `₹${(memoizedChartData.latestMonth.profit/1000).toFixed(1)}K`, icon: TrendingUp, color: '#2D6A4F', trend: 'up' },
          { label: 'Profit Margin', value: `${memoizedChartData.margin}%`, icon: Percent, color: '#F4A261', trend: 'up' },
        ].map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: trend === 'up' ? '#52B788' : '#E63946' }}>
                {trend === 'up' ? '↑' : '↓'} MTD
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* P&L Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="admin-card lg:col-span-2">
          <h2 className="font-bold text-white mb-5">6-Month P&L Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={memoizedChartData.monthlyPnL}>
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip formatter={(v) => `₹${((v as number)/1000).toFixed(1)}K`} contentStyle={{ background: '#162032', border: '1px solid #1E3A4A', borderRadius: 12, color: '#E2E8F0' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2D6A4F" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="expense" stroke="#E63946" strokeWidth={2.5} dot={{ r: 4 }} name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#52B788" strokeWidth={2.5} dot={{ r: 4 }} name="Profit" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-card">
          <h2 className="font-bold text-white mb-4">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={memoizedChartData.revenueByCategory} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                {memoizedChartData.revenueByCategory.map((entry, i: number) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${((v as number)/1000).toFixed(1)}K`} contentStyle={{ background: '#162032', border: '1px solid #1E3A4A', borderRadius: 12, color: '#E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {memoizedChartData.revenueByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <span style={{ color: '#94A3B8' }}>{cat.name}</span>
                </div>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>₹{(cat.value/1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense records */}
      <div className="admin-card">
        <h2 className="font-bold text-white mb-4">Expense Records — April 2026</h2>
        <table className="data-table data-table-dark w-full">
          <thead><tr>{['Date', 'Category', 'Sub-Category', 'Description', 'Amount'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td style={{ color: '#94A3B8' }}>{e.date}</td>
                <td><span className="badge badge-muted">{e.category}</span></td>
                <td style={{ color: '#94A3B8' }}>{e.subCategory}</td>
                <td style={{ color: '#94A3B8' }}>{e.description}</td>
                <td className="font-bold" style={{ color: '#E63946' }}>₹{e.amount.toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="font-bold text-right" style={{ color: '#94A3B8', paddingRight: 24 }}>Total Expenses</td>
              <td className="font-extrabold" style={{ color: '#E63946' }}>₹{expenses.reduce((a, e) => a + e.amount, 0).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
