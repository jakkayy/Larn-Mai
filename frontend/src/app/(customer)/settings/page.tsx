'use client';

import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  phone: string;
  model_car: string;
  color_car: string;
  license_plate: string;
  type_car: string;
  username: string;
}

const API = 'http://localhost:8000/api';

export default function CustomerSettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '', phone: '', model_car: '', color_car: '', license_plate: '', type_car: '', username: '',
  });
  const [original, setOriginal] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/users/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const u = data.user ?? data;
        const c = u.customer ?? {};
        const p: UserProfile = {
          username:      u.username ?? '',
          name:          c.name ?? '',
          phone:         c.phone ?? '',
          model_car:     c.model_car ?? '',
          color_car:     c.color_car ?? '',
          license_plate: c.license_plate ?? '',
          type_car:      c.type_car ?? '',
        };
        setProfile(p);
        setOriginal(p);
      })
      .catch(() => {});
  }, []);

  const set = (key: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'บันทึกไม่สำเร็จ');
        return;
      }
      setOriginal(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { if (original) setProfile(original); setError(''); };

  const initials = profile.name ? profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f0]">
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your industrial profile and fleet information for Yard operations.</p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-xl bg-[#7a4a28] flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50">
                <svg width="13" height="13" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <p className="font-bold text-gray-900 text-lg">{profile.name || '—'}</p>
            <p className="text-xs font-bold text-[#a0521e] tracking-widest mt-1">YARD MANAGER V2.4</p>
            <div className="mt-5 w-full space-y-3 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>@{profile.username || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>{profile.type_car || 'Regional Mill'}</span>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <h3 className="font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">FULL NAME</label>
                  <input type="text" value={profile.name} onChange={set('name')}
                    className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">PHONE NUMBER</label>
                  <input type="tel" value={profile.phone} onChange={set('phone')}
                    className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Vehicle & Logistics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8l6-3v13l-6-3" />
                </svg>
                <h3 className="font-bold text-gray-900">Vehicle & Logistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">CAR MODEL</label>
                  <input type="text" value={profile.model_car} onChange={set('model_car')}
                    className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">VEHICLE COLOR</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-800" />
                    <input type="text" value={profile.color_car} onChange={set('color_car')}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">LICENSE PLATE</label>
                  <input type="text" value={profile.license_plate} onChange={set('license_plate')}
                    className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]" />
                </div>
                <div className="flex items-end">
                  <div className="w-full border border-gray-200 rounded-lg py-3 px-4 flex items-center gap-2">
                    <svg width="15" height="15" fill="none" stroke="#a0521e" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-xs font-bold text-[#a0521e] tracking-widest">VERIFIED FLEET</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Error / success */}
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
            {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">บันทึกสำเร็จ</div>}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancel}
                className="px-5 py-2.5 border border-[#a0521e] text-[#a0521e] font-bold text-sm rounded-lg hover:bg-orange-50 transition-colors">
                Cancel Changes
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2.5 bg-[#1a3d2b] hover:bg-[#142d20] disabled:opacity-60 text-white font-bold text-sm rounded-lg transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-[#fdf3e8] border border-[#e8d0b0] rounded-xl p-5 flex gap-3">
          <svg width="18" height="18" fill="none" stroke="#a0521e" strokeWidth="2" className="flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="font-bold text-gray-800 text-sm">Data Precision & Security</p>
            <p className="text-gray-500 text-sm mt-0.5">
              All fleet information is synchronized with the weighbridge system. Ensure license plates are accurate to avoid delays during lumber intake and sales verification.
            </p>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-gray-200 bg-white px-8 py-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3 font-semibold">
          <span>LUMBERTRACK PRO V2.4.1</span>
          <span>•</span>
          <span>SYSTEM STATUS: OPTIMAL</span>
        </div>
        <div className="flex gap-5 font-semibold">
          <button className="hover:text-gray-700 flex items-center gap-1.5">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            EXPORT LOGS
          </button>
          <button className="hover:text-gray-700 flex items-center gap-1.5">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            PRINT BADGE
          </button>
        </div>
      </div>
    </div>
  );
}
