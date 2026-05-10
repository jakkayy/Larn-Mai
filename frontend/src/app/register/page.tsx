'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '', password: '', name: '', phone: '',
    type_car: '', model_car: '', color_car: '', license_plate: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('กรุณายอมรับข้อกำหนดก่อนดำเนินการ'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed'); return; }
      router.push('/dashboard');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — dark green */}
      <div className="hidden lg:flex lg:w-[58%] flex-col justify-between bg-gradient-to-br from-[#1a3d2b] via-[#243d2a] to-[#3a5a2a] p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative flex items-center gap-2">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L7 15h5v4h8v-4h5L16 3z" fill="#5aab7a" />
              <rect x="13" y="19" width="6" height="8" rx="1" fill="#5aab7a" />
            </svg>
          </div>
          <span className="text-white font-bold">LumberTrack Pro</span>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-5">
            Precision in Every<br />Board Foot.
          </h1>
          <p className="text-[#7aab8a] text-base leading-relaxed max-w-sm">
            Join the leading network for industrial timber logistics. Register your vehicle today to streamline your yard entry and transactions.
          </p>
        </div>

        <div className="relative flex gap-10">
          <div>
            <p className="text-2xl font-bold text-white">1.2M</p>
            <p className="text-xs text-[#5a8a6a] font-bold tracking-widest mt-1">TONS LOGGED</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-2xl font-bold text-white">150+</p>
            <p className="text-xs text-[#5a8a6a] font-bold tracking-widest mt-1">MILLS ACTIVE</p>
          </div>
        </div>
      </div>

      {/* Right — white */}
      <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#1a3d2b] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M16 3L7 15h5v4h8v-4h5L16 3z" fill="#5aab7a" />
                <rect x="13" y="19" width="6" height="8" rx="1" fill="#5aab7a" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">LumberTrack Pro</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Vehicle Registration</h2>
          <p className="text-gray-400 text-sm mb-7">Create your hauler profile to access the Yard Manager console.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username + Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">USERNAME</label>
                <input type="text" value={form.username} onChange={set('username')} placeholder="yourname01" required
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">PASSWORD</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">FULL NAME</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Johnathan Doe" required
                className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">PHONE NUMBER</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">VEHICLE TYPE</label>
              <input type="text" value={form.type_car} onChange={set('type_car')} placeholder="e.g. รถบรรทุก 10 ล้อ" required
                className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
            </div>

            {/* Model + Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">VEHICLE MODEL & COLOR</label>
                <input type="text" value={form.model_car} onChange={set('model_car')} placeholder="Peterbilt 389" required
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">&nbsp;</label>
                <input type="text" value={form.color_car} onChange={set('color_car')} placeholder="White" required
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
              </div>
            </div>

            {/* License Plate */}
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">LICENSE PLATE</label>
              <input type="text" value={form.license_plate} onChange={set('license_plate')} placeholder="ABC-1234" required
                className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#1a3d2b] flex-shrink-0" />
              <span>
                I agree to the <span className="font-bold text-gray-900">Safety Protocols</span> and{' '}
                <span className="font-bold text-gray-900">Privacy Policy</span> of the timber mill.
              </span>
            </label>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3d2b] hover:bg-[#142d20] disabled:opacity-60 text-white font-bold py-3.5 rounded-lg text-sm tracking-wide transition-colors">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#a0521e] hover:underline">Log In</Link>
          </p>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
            <span>SUPPORT</span>
            <span>ENGLISH</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
