'use client';
import { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { fetchFromAPI } from '../lib/api-client';
import { SessionManager } from '../lib/session-manager';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'user' | 'admin';
}

const TEST_PASSWORD = 'password123';
const TEST_USERS = [
  'test@example.com',
  'testuser@gmail.com',
  'demo@organic.local',
  'admin@organic.local',
  'customer@organic.local',
];

export default function LoginModal({ isOpen, onClose, defaultRole = 'user' }: LoginModalProps) {
  const [roleTab, setRoleTab] = useState<'user' | 'admin'>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mockLoginActive, setMockLoginActive] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchFromAPI('/supabase/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          requested_role: roleTab,
        }),
      });

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      const userId = data.user_id || data.identifier || email;
      const token = data.token || `token-${userId}-${Date.now()}`;
      if (typeof window !== 'undefined') {
        SessionManager.setSession(token, { id: userId, role: data.role, email });
        localStorage.setItem('organic_user_role', data.role);
        localStorage.setItem('organic_user_id', userId);
        window.location.reload();
      }
    } catch (err: any) {
      if (TEST_USERS.includes(email.toLowerCase()) && password === TEST_PASSWORD) {
        setMockLoginActive(true);
        const userId = email.toLowerCase();
        const token = `token-${userId}-${Date.now()}`;
        if (typeof window !== 'undefined') {
          SessionManager.setSession(token, { id: userId, role: roleTab, email });
          localStorage.setItem('organic_user_role', roleTab);
          localStorage.setItem('organic_user_id', userId);
          window.location.reload();
        }
        return;
      }
      setErrorMsg(err.message || 'Unable to log in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-center" style={{ color: '#1B2D2A' }}>
            Welcome Back
          </h2>
          <p className="text-sm text-center mt-1" style={{ color: '#6B7280' }}>
            Sign in with your email and password
          </p>

          <div className="flex mt-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setRoleTab('user')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                roleTab === 'user' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRoleTab('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                roleTab === 'admin' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1B2D2A' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1B2D2A' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white font-medium transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {errorMsg && <p className="text-xs text-red-500 mt-2">{errorMsg}</p>}

            <p className="text-xs text-gray-500 mt-2">
              {mockLoginActive
                ? 'Fallback login active. You are signed in with offline credentials.'
                : 'Use your registered email and password. For local demo mode, try admin@organic.local / password123 or test@example.com / password123.'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
