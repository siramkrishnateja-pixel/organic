'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShoppingBag, RefreshCw, TrendingUp, Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { dashboardKPIs, ordersChartDataThisWeek, ordersChartDataLastWeek, revenueByCategory, lowStockAlerts, expiringBatches, monthlyPnL } from '@/lib/mock-data/dashboard';

const fallbackDashboardData = {
  dashboardKPIs,
  ordersChartDataThisWeek,
  ordersChartDataLastWeek,
  revenueByCategory,
  lowStockAlerts,
  expiringBatches,
  monthlyPnL,
};

export default function AdminDashboard() {
  const [selectedWeek, setSelectedWeek] = useState('this');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchFromAPI('/admin/dashboard');
        if (data?.offline) {
          setDashboardData(fallbackDashboardData);
        } else {
          setDashboardData(data ?? fallbackDashboardData);
        }
      } catch (err: any) {
        console.error('Failed to load dashboard:', err);
        setDashboardData(fallbackDashboardData);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52B788]"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-red-500 pt-20">Failed to load dashboard: {error}</div>;
  }

  const { dashboardKPIs, ordersChartDataThisWeek, ordersChartDataLastWeek, revenueByCategory, lowStockAlerts, expiringBatches, monthlyPnL } = dashboardData;

  const kpiCards = [
    { label: "Today's Orders", value: dashboardKPIs.todayOrders, change: dashboardKPIs.todayOrdersChange, icon: ShoppingBag, color: '#2D6A4F', href: '/admin/orders' },
    { label: 'Active Subscriptions', value: dashboardKPIs.activeSubscriptions, change: dashboardKPIs.activeSubscriptionsChange, icon: RefreshCw, color: '#3B82F6', href: '/admin/subscriptions' },
    { label: 'Revenue (MTD)', value: `₹${(dashboardKPIs.revenueMonth/1000).toFixed(1)}K`, change: dashboardKPIs.revenueMonthChange, icon: TrendingUp, color: '#F4A261', href: '/admin/finance' },
    { label: 'New Customers', value: dashboardKPIs.newCustomers, change: dashboardKPIs.newCustomersChange, icon: Users, color: '#52B788', href: '/admin/customers' },
  ];

  const currentChartData = selectedWeek === 'this' ? ordersChartDataThisWeek : ordersChartDataLastWeek;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p style={{ color: '#64748B' }}>Thursday, April 17, 2026 · Good morning, Admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map(({ label, value, change, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="admin-card animate-fadeInUp block hover:bg-[#1E3A4A] transition-colors cursor-pointer" style={{ textDecoration: 'none' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(82,183,136,0.1)', color: '#52B788' }}>
                +{change}%
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Orders trend */}
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Orders & Revenue — {selectedWeek === 'this' ? 'This Week' : 'Last Week'}</h2>
            <select 
              className="text-xs rounded-lg px-3 py-1.5" 
              style={{ background: '#0F1923', color: '#64748B', border: '1px solid #1E3A4A' }}
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="this">This Week</option><option value="last">Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={currentChartData}>
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#162032', border: '1px solid #1E3A4A', borderRadius: 12, color: '#E2E8F0' }} />
              <Bar dataKey="orders" fill="#2D6A4F" radius={[6, 6, 0, 0]} name="Orders" />
              <Bar dataKey="revenue" fill="#40916C" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by category */}
        <div className="admin-card">
          <h2 className="font-bold text-white mb-5">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revenueByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {revenueByCategory.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${((v as number)/1000).toFixed(1)}K`} contentStyle={{ background: '#162032', border: '1px solid #1E3A4A', borderRadius: 12, color: '#E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {revenueByCategory.map((cat: any) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span style={{ color: '#94A3B8' }}>{cat.name}</span>
                </div>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>₹{(cat.value/1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly P&L Trend */}
      <div className="admin-card mb-8">
        <h2 className="font-bold text-white mb-5">6-Month P&L Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyPnL}>
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
            <Tooltip formatter={(v) => `₹${((v as unknown as number)/1000).toFixed(1)}K`} contentStyle={{ background: '#162032', border: '1px solid #1E3A4A', borderRadius: 12, color: '#E2E8F0' }} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: '#2D6A4F' }} name="Revenue" />
            <Line type="monotone" dataKey="expense" stroke="#E63946" strokeWidth={2.5} dot={{ fill: '#E63946' }} name="Expenses" />
            <Line type="monotone" dataKey="profit" stroke="#52B788" strokeWidth={2.5} dot={{ fill: '#52B788' }} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Low stock */}
        <div className="admin-card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><AlertTriangle size={16} style={{ color: '#F4A261' }} /> Low Stock ({lowStockAlerts.length})</h3>
          <div className="space-y-3">
            {lowStockAlerts.map((a: any) => (
              <div key={a.product} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{a.product}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{a.category}</p>
                </div>
                <span className="badge badge-warning">{a.stock} left</span>
              </div>
            ))}
          </div>
        </div>
        {/* Expiring */}
        <div className="admin-card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock size={16} style={{ color: '#E63946' }} /> Expiring Soon ({expiringBatches.length})</h3>
          <div className="space-y-3">
            {expiringBatches.map((b: any) => (
              <div key={b.batch} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{b.product}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{b.batch}</p>
                </div>
                <span className="badge badge-danger">{b.expiresIn}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Quick stats */}
        <div className="admin-card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><CheckCircle size={16} style={{ color: '#52B788' }} /> Today&apos;s Status</h3>
          <div className="space-y-3">
            {[
              ['Pending Orders', dashboardKPIs.pendingOrders, 'badge-warning'],
              ['Failed Deliveries', dashboardKPIs.failedDeliveries, 'badge-danger'],
              ['Completed', `${dashboardKPIs.todayOrders - dashboardKPIs.pendingOrders - dashboardKPIs.failedDeliveries}`, 'badge-success'],
            ].map(([label, val, cls]) => (
              <div key={label as string} className="flex items-center justify-between">
                <p className="text-sm" style={{ color: '#94A3B8' }}>{label}</p>
                <span className={`badge ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
