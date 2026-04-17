'use client';
import { useState, useEffect } from 'react';
import { MapPin, Clock, Wallet, CreditCard, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const slots = ['6AM - 9AM', '9AM - 12PM', '12PM - 3PM', '3PM - 6PM'];

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'dummy'>('wallet');
  const [selectedSlot, setSelectedSlot] = useState(slots[0]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('organic_user_role');
      if (role !== 'customer' && role !== 'admin') {
        router.push('/cart');
      }
    }
  }, [router]);

  const handlePlaceOrder = () => {
    if (paymentMethod === 'dummy') { setShowPayModal(true); return; }
    setPaymentState('processing');
    setTimeout(() => setPaymentState('success'), 1800);
  };

  const handleDummyPay = async () => {
    setPaymentState('processing');
    try {
      if (simulateFailure) {
        setTimeout(() => {
          setShowPayModal(false);
          setPaymentState('failed');
        }, 1500);
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/payment/razorpay-dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 575,
          receipt: "order_rcptid_11",
        })
      });
      
      if (!response.ok) throw new Error('Payment network error');
      
      const data = await response.json();
      console.log('Response from FastAPI Python Backend:', data);
      
      setShowPayModal(false);
      setPaymentState('success');
    } catch (error) {
      console.error(error);
      setShowPayModal(false);
      setPaymentState('failed');
    }
  };

  if (paymentState === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fadeIn">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-float" style={{ background: 'rgba(82,183,136,0.15)' }}>
          <CheckCircle size={48} style={{ color: '#52B788' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1B2D2A' }}>Order Placed! 🎉</h1>
        <p className="mb-2" style={{ color: '#6B7280' }}>Your order <strong>#ORD-1009</strong> has been confirmed.</p>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>Delivery tomorrow, 6AM–9AM</p>
        <div className="flex gap-4 justify-center">
          <Link href="/orders" className="btn btn-primary">Track Order</Link>
          <Link href="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (paymentState === 'failed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fadeIn">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(230,57,70,0.1)' }}>
          <X size={48} style={{ color: '#E63946' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1B2D2A' }}>Payment Failed</h1>
        <p className="mb-8" style={{ color: '#6B7280' }}>Simulated failure for testing. No money was deducted.</p>
        <button onClick={() => setPaymentState('idle')} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address + Slot + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#1B2D2A' }}><MapPin size={20} style={{ color: '#2D6A4F' }} /> Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="input-field" placeholder="Full Name" defaultValue="Priya Sharma" />
              <input className="input-field" placeholder="Phone" defaultValue="9876543210" />
              <input className="input-field sm:col-span-2" placeholder="Street Address" defaultValue="12 MG Road, Indiranagar" />
              <input className="input-field" placeholder="City" defaultValue="Bangalore" />
              <input className="input-field" placeholder="Pincode" defaultValue="560038" />
            </div>
          </div>

          {/* Delivery Slot */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#1B2D2A' }}><Clock size={20} style={{ color: '#2D6A4F' }} /> Delivery Slot — Tomorrow</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {slots.map(slot => (
                <button key={slot} id={`slot-${slot.replace(/\s/g,'')}`} onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${selectedSlot === slot ? 'text-white' : ''}`}
                  style={{ background: selectedSlot === slot ? 'linear-gradient(135deg,#2D6A4F,#40916C)' : '#F9FAFB', color: selectedSlot === slot ? 'white' : '#6B7280', border: '1.5px solid', borderColor: selectedSlot === slot ? '#2D6A4F' : '#E5E7EB' }}>
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#1B2D2A' }}><CreditCard size={20} style={{ color: '#2D6A4F' }} /> Payment Method</h2>
            <div className="space-y-3">
              {/* Wallet */}
              <button id="pay-wallet-btn" onClick={() => setPaymentMethod('wallet')} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'wallet' ? 'border-green-600' : 'border-gray-200'}`} style={{ background: paymentMethod === 'wallet' ? 'rgba(45,106,79,0.05)' : 'white' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,106,79,0.1)' }}>
                  <Wallet size={18} style={{ color: '#2D6A4F' }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: '#1B2D2A' }}>Pay from Wallet</p>
                  <p className="text-xs" style={{ color: '#52B788' }}>Balance: ₹540 available</p>
                </div>
                {paymentMethod === 'wallet' && <CheckCircle size={18} className="ml-auto" style={{ color: '#52B788' }} />}
              </button>
              {/* Dummy Payment */}
              <button id="pay-dummy-btn" onClick={() => setPaymentMethod('dummy')} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'dummy' ? 'border-amber-400' : 'border-gray-200'}`} style={{ background: paymentMethod === 'dummy' ? 'rgba(244,162,97,0.05)' : 'white' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(244,162,97,0.15)' }}>
                  <CreditCard size={18} style={{ color: '#F4A261' }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: '#1B2D2A' }}>Pay Online</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>⚠️ TEST MODE</span>
                </div>
                {paymentMethod === 'dummy' && <CheckCircle size={18} className="ml-auto" style={{ color: '#F4A261' }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl p-6 sticky top-36" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-lg mb-4" style={{ color: '#1B2D2A' }}>Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              {[['A2 Cow Milk × 2', '₹140'], ['Probiotic Curd × 1', '₹55'], ['Coconut Oil × 1', '₹380']].map(([item, price]) => (
                <div key={item} className="flex justify-between"><span style={{ color: '#6B7280' }}>{item}</span><span style={{ color: '#1B2D2A', fontWeight: 500 }}>{price}</span></div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm" style={{ borderColor: '#F3F4F6' }}>
              <div className="flex justify-between"><span style={{ color: '#6B7280' }}>Subtotal</span><span>₹575</span></div>
              <div className="flex justify-between"><span style={{ color: '#6B7280' }}>Delivery</span><span style={{ color: '#52B788' }}>FREE</span></div>
            </div>
            <div className="flex justify-between font-bold text-lg border-t mt-3 pt-3" style={{ borderColor: '#E5E7EB' }}>
              <span>Total</span><span style={{ color: '#2D6A4F' }}>₹575</span>
            </div>
            <button id="place-order-btn" onClick={handlePlaceOrder} disabled={paymentState === 'processing'} className="btn btn-primary btn-lg w-full mt-5 flex justify-center">
              {paymentState === 'processing' ? 'Processing...' : paymentMethod === 'wallet' ? '💳 Pay ₹575 from Wallet' : '🔐 Pay ₹575 Online'}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: '#9CA3AF' }}>
              {paymentMethod === 'dummy' ? '⚠️ Test mode — no real money' : '🔒 Secure wallet payment'}
            </p>
          </div>
        </div>
      </div>

      {/* Dummy Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-xl" style={{ color: '#1B2D2A' }}>Online Payment</h2>
              <button onClick={() => setShowPayModal(false)} className="btn btn-ghost btn-icon"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-2 mb-6 p-2 rounded-lg" style={{ background: '#FEF3C7' }}>
              <span className="text-xs font-bold" style={{ color: '#92400E' }}>⚠️ TEST MODE — No real payment will be made</span>
            </div>
            {/* Fake card */}
            <div className="p-5 rounded-2xl mb-5 text-white" style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>
              <p className="text-xs opacity-70 mb-4">Debit Card</p>
              <p className="font-mono text-lg tracking-widest mb-4">4242 4242 4242 4242</p>
              <div className="flex justify-between text-sm">
                <div><p className="opacity-70 text-xs">CARD HOLDER</p><p className="font-semibold">TEST USER</p></div>
                <div><p className="opacity-70 text-xs">EXPIRES</p><p className="font-semibold">12/28</p></div>
                <div><p className="opacity-70 text-xs">CVV</p><p className="font-semibold">123</p></div>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              <input className="input-field" defaultValue="TEST USER" placeholder="Card Holder Name" />
              <input className="input-field font-mono" defaultValue="4242 4242 4242 4242" placeholder="Card Number" />
              <div className="flex gap-3">
                <input className="input-field" defaultValue="12/28" placeholder="MM/YY" />
                <input className="input-field" defaultValue="123" placeholder="CVV" />
              </div>
            </div>
            {/* Simulate failure toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl mb-5" style={{ background: '#FEF3C7' }}>
              <span className="text-sm font-medium" style={{ color: '#92400E' }}>Simulate Payment Failure</span>
              <button id="failure-toggle" onClick={() => setSimulateFailure(!simulateFailure)} className={`w-10 h-6 rounded-full transition-all ${simulateFailure ? 'bg-red-500' : 'bg-gray-300'}`} style={{ position: 'relative' }}>
                <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: simulateFailure ? '22px' : '2px' }} />
              </button>
            </div>
            <button id="dummy-pay-confirm" onClick={handleDummyPay} className={`btn btn-lg w-full ${simulateFailure ? 'btn-danger' : 'btn-primary'} flex justify-center`}>
              {simulateFailure ? '⚡ Simulate Failure' : '✓ Pay ₹575 (Test)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
