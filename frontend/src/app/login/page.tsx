'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }
      if (data.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — dark green gradient */}
      <div className="hidden lg:flex lg:w-[60%] flex-col justify-between bg-gradient-to-br from-[#1a3d2b] via-[#1f4a33] to-[#2d5a3a] p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #5aab7a 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L7 15h5v4h8v-4h5L16 3z" fill="#5aab7a" />
              <rect x="13" y="19" width="6" height="8" rx="1" fill="#5aab7a" />
            </svg>
          </div>
          <span className="text-white font-bold text-base">LumberTrack Pro</span>
        </div>

        {/* Headline */}
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Precision Management<br />for the Modern Mill.
          </h1>
          <p className="text-[#7aab8a] text-base leading-relaxed max-w-md">
            Streamline your inventory, sales, and logistics with industrial-grade tools designed for physical raw materials.
          </p>
        </div>

        {/* Stats */}
        <div className="relative flex gap-10">
          <div>
            <p className="text-xs text-[#5a8a6a] font-bold tracking-widest mb-1">CURRENT OUTPUT</p>
            <p className="text-2xl font-bold text-white">1.2M BF / Month</p>
          </div>
          <div>
            <p className="text-xs text-[#5a8a6a] font-bold tracking-widest mb-1">SYSTEM STATUS</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
              <p className="text-2xl font-bold text-white">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — cream */}
      <div className="flex-1 flex flex-col justify-between px-10 py-12 bg-[#f5f4f0]">
        <div />

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-8">Access your yard dashboard and inventory records.</p>

          {/* Form card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-widest mb-1.5">USERNAME OR EMPLOYEE ID</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. JMILLER-04"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-500 tracking-widest">PASSWORD</label>
                <button type="button" className="text-xs font-semibold text-[#a0521e] hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-[#1a3d2b]" />
              Remember this workstation
            </label>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

            <button
              onClick={handleSubmit as any}
              disabled={loading}
              className="w-full bg-[#1a3d2b] hover:bg-[#142d20] disabled:opacity-60 text-white font-bold py-3.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Logging in...' : 'Login to Console'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-5">
            Need an account?{' '}
            <Link href="/register" className="font-bold text-gray-800 hover:underline">Register New Yard</Link>
          </p>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin Login
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">© 2024 LUMBERTRACK PRO SYSTEMS • V2.4.82</p>
      </div>
    </div>
  );
}
