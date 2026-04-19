'use client';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import { SessionManager } from '@/lib/session-manager';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAdminAccess = async () => {
      try {
        // First check if user is logged in and has admin role
        if (!SessionManager.isAuthenticated() || !SessionManager.isAdmin()) {
          setIsAdmin(false);
          setIsValidating(false);
          return;
        }

        // Validate session with backend
        const isValid = await SessionManager.validateSession();
        setIsAdmin(isValid);
      } catch (error) {
        console.error('Session validation failed:', error);
        SessionManager.clearSession();
        setIsAdmin(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAdminAccess();
  }, []);

  if (isValidating) {
    return <div className="flex-1 flex items-center justify-center text-gray-500" style={{ background: '#0F1923' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#52B788] mx-auto mb-2"></div>
        <p>Validating access...</p>
      </div>
    </div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-white border-l" style={{ background: '#0F1923', borderColor: '#1E3A4A' }}>
         <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
         <p className="text-gray-400 mb-8 max-w-sm text-center">You must be logged in with an Admin account to access the Operations Center.</p>
         <button
           onClick={() => setIsLoginOpen(true)}
           className="px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
           style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}
         >
           Login as Admin
         </button>
         <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} defaultRole="admin" />
      </div>
    );
  }

  return <>{children}</>;
}
