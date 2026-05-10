'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        setError(data.message || 'Invalid username or password');
        return;
      }
      if (data.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        {/* Left panel — dark green */}
        <div className="hidden lg:flex lg:w-[58%] flex-col bg-[#1a3d2b] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, #5aab7a 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Logo */}
          <div className="relative px-10 pt-10 flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L7 15h5v4h8v-4h5L16 3z" fill="#5aab7a" />
              <rect x="13" y="19" width="6" height="8" rx="1" fill="#5aab7a" />
            </svg>
            <span className="text-white font-bold text-lg tracking-tight">ลานไม้</span>
          </div>

          {/* Headline */}
          <div className="relative flex-1 flex flex-col justify-center px-10">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-5">
              Precision.<br />Integrity.<br />Control.
            </h1>
            <p className="text-[#7aab8a] text-base max-w-sm leading-relaxed">
              ระบบจัดการลานไม้ครบวงจร ควบคุมการรับ-ขายไม้ บิล และน้ำหนัก ด้วยระบบที่ปลอดภัย
            </p>
          </div>

          {/* System Status */}
          <div className="relative px-10 pb-10">
            <div className="bg-[#0f2d1c] rounded-xl p-5">
              <p className="text-[#4a7a5a] text-xs font-bold tracking-widest mb-3">SYSTEM STATUS</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-white text-sm">All yard nodes operational (v2.4.0)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — white */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white">
          <div className="max-w-md w-full mx-auto">
            <span className="inline-block bg-[#e8f0eb] text-[#1a3d2b] text-xs font-bold tracking-widest px-4 py-2 rounded-full mb-7">
              SYSTEM LOGIN
            </span>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              ใช้ชื่อผู้ใช้และรหัสผ่านที่ได้รับจากผู้ดูแลระบบ
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                  USERNAME
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="กรอกชื่อผู้ใช้"
                    required
                    autoComplete="username"
                    className="w-full border border-gray-200 rounded-lg py-4 px-4 pl-12 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b] text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full border border-gray-200 rounded-lg py-4 px-4 pl-12 bg-gray-50 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b] text-sm"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a3d2b] hover:bg-[#142d20] disabled:opacity-60 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm tracking-widest"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ →'}
              </button>
            </form>

            {/* Security badges */}
            <div className="mt-10 flex items-center gap-8 text-gray-300">
              <div className="flex items-center gap-2 text-xs">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <div className="font-bold text-gray-400 text-xs">256-BIT</div>
                  <div className="text-xs">ENCRYPTION</div>
                </div>
              </div>
              <div className="text-xs font-bold">SECURE SESSION</div>
              <div className="text-xs">
                <div className="font-bold text-gray-400">LOGS</div>
                <div>MONITORED</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        ระบบนี้สงวนสิทธิ์เฉพาะผู้ได้รับอนุญาตเท่านั้น การเข้าถึงโดยไม่ได้รับอนุญาตอาจมีโทษตามกฎหมาย
      </div>
    </div>
  );
}
