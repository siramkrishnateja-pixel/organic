'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, ShoppingBag, Settings } from 'lucide-react';

export default function PlatformTabs() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 py-3 shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: '#1B2D2A' }}>
            Organic<span style={{ color: '#2D6A4F' }}>Farm</span>
          </span>
        </Link>

        {/* Platform Tabs */}
        <div className="flex items-center">
          <Link
            href="/"
            className={`platform-tab flex items-center gap-2 ${!isAdmin ? 'active' : ''}`}
          >
            <ShoppingBag size={16} />
            Customer Shop
          </Link>
          <Link
            href="/admin"
            className={`platform-tab flex items-center gap-2 ${isAdmin ? 'active' : ''}`}
          >
            <Settings size={16} />
            Admin Panel
          </Link>
        </div>

        {/* Right side placeholder */}
        <div className="w-32" />
      </div>
    </div>
  );
}
