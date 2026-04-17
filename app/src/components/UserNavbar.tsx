'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Bell, User, Leaf, Home, Package, ClipboardList, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/',              label: 'Home',          icon: Home },
  { href: '/products',      label: 'Products',      icon: Package },
  { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { href: '/orders',        label: 'Orders',        icon: ClipboardList },
];

export default function UserNavbar() {
  const pathname = usePathname();
  const [cartCount] = useState(3);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-[53px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-4">
        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`nav-link ${active ? 'active' : ''}`}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex items-center">
            {showSearch && (
              <input 
                type="text" 
                placeholder="Search organic products..." 
                autoFocus
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    window.location.href = `/products?search=${e.currentTarget.value}`;
                  }
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 h-9 w-56 px-4 rounded-full border outline-none shadow-sm text-sm bg-white"
                style={{ borderColor: '#2D6A4F', zIndex: 50, color: '#1B2D2A' }}
              />
            )}
            <button className="btn btn-ghost btn-icon" aria-label="Search" onClick={() => setShowSearch(!showSearch)}>
              <Search size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="btn btn-ghost btn-icon relative" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} style={{ color: '#6B7280' }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#E63946' }}></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl p-4 z-50 border" style={{ borderColor: '#E5E7EB' }}>
                <p className="text-sm font-bold mb-4 px-1" style={{ color: '#1B2D2A' }}>Notifications</p>
                <div className="space-y-4">
                  <div className="flex gap-3 px-1">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: '#52B788' }}></div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1B2D2A' }}>Delivery Arrived 🚚</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Your Fresh A2 Milk is at the door.</p>
                      <p className="text-xs mt-1 font-medium" style={{ color: '#9CA3AF' }}>10 mins ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 px-1">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-gray-300"></div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1B2D2A' }}>Subscription Renewed ✨</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Your Monthly Veg Box was renewed successfully.</p>
                      <p className="text-xs mt-1 font-medium" style={{ color: '#9CA3AF' }}>2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/cart" className="btn btn-ghost btn-icon relative" aria-label="Cart">
            <ShoppingCart size={20} style={{ color: '#6B7280' }} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: '#2D6A4F', fontSize: '0.65rem' }}>
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/profile" className="btn btn-ghost btn-icon" aria-label="Profile">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>
              P
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
