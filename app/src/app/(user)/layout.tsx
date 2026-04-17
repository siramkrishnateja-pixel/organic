import PlatformTabs from '@/components/PlatformTabs';
import UserNavbar from '@/components/UserNavbar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      <PlatformTabs />
      <UserNavbar />
      <main>{children}</main>
      <footer className="mt-16 py-8 text-center" style={{ borderTop: '1px solid #E5E7EB' }}>
        <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>
          © 2026 OrganicFarm · Pure · Fresh · Trustworthy
        </p>
      </footer>
    </div>
  );
}
