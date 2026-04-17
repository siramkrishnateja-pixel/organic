import PlatformTabs from '@/components/PlatformTabs';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0F1923' }}>
      <div className="flex-shrink-0 relative z-50">
        <PlatformTabs />
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden min-w-0" style={{ background: '#0F1923' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
