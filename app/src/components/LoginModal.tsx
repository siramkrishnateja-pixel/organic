'use client';
import { useState } from 'react';
import { X, Smartphone, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'user' | 'admin';
}

export default function LoginModal({ isOpen, onClose, defaultRole = 'user' }: LoginModalProps) {
  const [roleTab, setRoleTab] = useState<'user' | 'admin'>(defaultRole);
  const [methodTab, setMethodTab] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [inputValue, setInputValue] = useState('');
  const [otpValue, setOtpValue] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('organic_user_role', roleTab);
        window.location.reload();
      }
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
            Sign in to your account
          </p>

          {/* Role Tabs */}
          <div className="flex mt-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setRoleTab('user'); setStep('input'); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                roleTab === 'user' ? 'bg-white shadow-sm text-green-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => { setRoleTab('admin'); setStep('input'); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                roleTab === 'admin' ? 'bg-white shadow-sm text-green-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Method Tabs */}
          {step === 'input' && (
            <div className="flex gap-4 mb-6 border-b border-gray-100 pb-2">
              <button
                onClick={() => setMethodTab('phone')}
                className={`flex items-center gap-2 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  methodTab === 'phone' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'
                }`}
              >
                <Smartphone size={16} /> Phone
              </button>
              <button
                onClick={() => setMethodTab('email')}
                className={`flex items-center gap-2 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  methodTab === 'email' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'
                }`}
              >
                <Mail size={16} /> Email
              </button>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1B2D2A' }}>
                  {methodTab === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <input
                  type={methodTab === 'phone' ? 'tel' : 'email'}
                  placeholder={methodTab === 'phone' ? '+91 98765 43210' : 'you@example.com'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1B2D2A' }}>
                  Enter OTP
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Code sent to {inputValue}. <button type="button" onClick={() => setStep('input')} className="text-green-600 underline">Edit</button>
                </p>
                <input
                  type="text"
                  placeholder="• • • • • •"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}
              >
                Verify & Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
