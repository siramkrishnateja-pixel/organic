'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, RefreshCw, Package, Boxes, Users, TrendingUp, Settings, ChevronRight } from 'lucide-react';

const adminLinks = [
  { href: '/admin',                label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/orders',         label: 'Orders',        icon: ShoppingBag },
  { href: '/admin/subscriptions',  label: 'Subscriptions', icon: RefreshCw },
  { href: '/admin/inventory',      label: 'Inventory',     icon: Boxes },
  { href: '/admin/products',       label: 'Products',      icon: Package },
  { href: '/admin/customers',      label: 'Customers',     icon: Users },
  { href: '/admin/finance',        label: 'Finance / P&L', icon: TrendingUp },
  { href: '/admin/settings',       label: 'Settings',      icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar w-64 flex-shrink-0 flex flex-col z-30 h-full overflow-y-auto border-r" style={{ borderColor: '#1E3A4A' }}>
      <div className="p-4 border-b" style={{ borderColor: '#1E3A4A' }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Operations Center</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {adminLinks.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-link nav-link-dark ${active ? 'active' : ''} justify-between`}>
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {label}
              </span>
              {active && <ChevronRight size={14} style={{ color: '#52B788' }} />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 m-3 rounded-xl" style={{ background: 'rgba(45,106,79,0.1)', border: '1px solid rgba(45,106,79,0.2)' }}>
        <p className="text-xs font-semibold" style={{ color: '#52B788' }}>Phase 1 — Testing</p>
        <p className="text-xs mt-1" style={{ color: '#64748B' }}>Dummy payments active</p>
      </div>
    </aside>
  );
}
