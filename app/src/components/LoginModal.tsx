'use client';
import { useState } from 'react';
import { X, Smartphone, Mail } from 'lucide-react';
import { fetchFromAPI } from '../lib/api-client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'user' | 'admin';
}

export default function LoginModal({ isOpen, onClose, defaultRole = 'user' }: LoginModalProps) {
  const [roleTab, setRoleTab] = useState<'user' | 'admin'>(defaultRole);
  const [methodTab, setMethodTab] = useState<'phone' | 'email'>('email');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [inputValue, setInputValue] = useState('');
  const [otpValue, setOtpValue] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowTestOtp, setAllowTestOtp] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inputValue) return;
    
    setIsLoading(true);
    try {
      const data = await fetchFromAPI('/supabase/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier: inputValue, method: methodTab })
      });
      if (data.status === 'error') throw new Error(data.message);
      setAllowTestOtp(!!data.allowTestOtp);
      setStep('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP.');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpValue) return;

    setIsLoading(true);
    try {
      const data = await fetchFromAPI('/supabase/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ 
          identifier: inputValue, 
          otp: otpValue, 
          requested_role: roleTab,
          method: methodTab,
          allow_test_otp: allowTestOtp,
        })
      });
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      const userId = data.user_id || data.identifier;
      if (typeof window !== 'undefined') {
        localStorage.setItem('organic_user_role', data.role);
        localStorage.setItem('organic_user_id', userId);
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP');
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
            Sign in to your account
          </p>

          {/* Role Tabs */}
          <div className="flex mt-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setRoleTab('user'); setStep('input'); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                roleTab === 'user' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => { setRoleTab('admin'); setStep('input'); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                roleTab === 'admin' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-slate-900'
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
                  methodTab === 'phone' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-slate-900'
                }`}
              >
                <Smartphone size={16} /> Phone
              </button>
              <button
                onClick={() => setMethodTab('email')}
                className={`flex items-center gap-2 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  methodTab === 'email' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-slate-900'
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
                  placeholder={methodTab === 'phone' ? '+91 98765 43210' : 'your.email@gmail.com'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              {errorMsg && <p className="text-xs text-red-500 mt-2">{errorMsg}</p>}
              <p className="text-xs text-gray-500 mt-2">
                {allowTestOtp
                  ? <>OTP will be sent via email. For testing, you can also use <strong>123456</strong> as the code.</>
                  : <>A one-time code will be sent to your email address. Check your inbox in a few moments.</>}
              </p>
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
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
