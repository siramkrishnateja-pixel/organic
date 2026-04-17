'use client';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('organic_user_role');
    setIsAdmin(role === 'admin');
  }, []);

  if (isAdmin === null) {
    return <div className="flex-1 flex items-center justify-center text-gray-500" style={{ background: '#0F1923' }}>Loading access state...</div>;
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
