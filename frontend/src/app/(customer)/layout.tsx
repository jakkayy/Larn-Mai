'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navTabs = [
  { name: 'Dashboard',    href: '/dashboard' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Inventory',    href: '#' },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f0]">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
          <span className="font-bold text-gray-900 text-base flex-shrink-0">LumberTrack Pro</span>

          <nav className="flex gap-1 flex-1">
            {navTabs.map((tab) => {
              const active = pathname === tab.href;
              const disabled = tab.href === '#';
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-[#1a3d2b] text-[#1a3d2b]'
                      : disabled
                      ? 'border-transparent text-gray-300 pointer-events-none'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search orders..." className="pl-8 pr-4 py-1.5 text-sm bg-gray-100 rounded-lg border-none outline-none w-44 text-gray-700 placeholder-gray-400" />
          </div>

          {/* Bell */}
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Settings */}
          <Link href="/settings" className={`p-2 rounded-lg transition-colors ${pathname === '/settings' ? 'bg-gray-100 text-[#1a3d2b]' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#7a4a28] flex items-center justify-center text-white text-xs font-bold cursor-pointer flex-shrink-0">
            U
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
