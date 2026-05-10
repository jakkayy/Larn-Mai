'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarMenu = [
  {
    name: 'Overview',
    href: '/admin/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Weighbridge',
    href: '/admin/weight',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /><path d="M6.3 9h11.4L20 20H4L6.3 9z" />
        <line x1="4" y1="20" x2="20" y2="20" />
      </svg>
    ),
  },
  {
    name: 'Sales History',
    href: '/admin/transactions',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
      </svg>
    ),
  },
  {
    name: 'Bill Registry',
    href: '/admin/bills',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    name: 'Inventory',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const topNavTabs = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Transactions', href: '/admin/transactions' },
  { name: 'Inventory', href: '/admin/bills' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0efeb]">
      {/* Sidebar */}
      <div className="w-[220px] flex-shrink-0 bg-[#1a3d2b] flex flex-col">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L8 14h4v6h8v-6h4L16 4z" fill="#5aab7a" />
              <rect x="14" y="20" width="4" height="6" rx="1" fill="#5aab7a" />
            </svg>
            <p className="text-white font-bold text-sm">LumberTrack</p>
          </div>
          <p className="text-[#4a7a5a] text-xs mt-1 pl-9">Yard Manager v2.4</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-0.5">
          {sidebarMenu.map((item) => {
            const active = pathname === item.href;
            const disabled = item.href === '#';
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : disabled
                    ? 'text-[#3a6a4a] cursor-not-allowed pointer-events-none'
                    : 'text-[#6aaa7a] hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* New Transaction */}
        <div className="px-4 py-4">
          <Link
            href="/admin/weight"
            className="w-full bg-[#7a4a28] hover:bg-[#6a3a18] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <span className="text-base leading-none">+</span>
            New Transaction
          </Link>
        </div>

        {/* Bottom */}
        <div className="px-3 pb-5 pt-3 border-t border-[#2a5a3a] space-y-0.5">
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/admin/settings'
                ? 'bg-white/10 text-white'
                : 'text-[#6aaa7a] hover:text-white hover:bg-white/10'
            }`}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6aaa7a] hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Support
          </a>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 h-14 flex items-center gap-6 flex-shrink-0">
          <span className="font-bold text-gray-900 text-base">LumberTrack Pro</span>

          <nav className="flex gap-1 flex-1">
            {topNavTabs.map((tab) => {
              const active =
                tab.href === '/admin/dashboard'
                  ? pathname === '/admin/dashboard'
                  : tab.href === '/admin/transactions'
                  ? pathname === '/admin/transactions'
                  : pathname === '/admin/bills';
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-[#1a3d2b] text-[#1a3d2b]'
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
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-8 pr-4 py-1.5 text-sm bg-gray-100 rounded-lg border-none outline-none w-44 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Bell */}
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Gear */}
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 bg-[#1a3d2b] rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            A
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
