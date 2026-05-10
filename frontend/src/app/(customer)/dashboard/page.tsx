'use client';

import Link from 'next/link';

const recentTransactions = [
  { date: 'May 24, 2024', id: '#TX-12091', customer: 'Northern Timber Co.',   product: 'Premium Pine 2×4',      volume: 4200, total: 1890.00,  status: 'SHIPPED' },
  { date: 'May 24, 2024', id: '#TX-12090', customer: 'Valley Furniture Works', product: 'Rough Sawn Oak',        volume: 1500, total: 3450.00,  status: 'IN-DRYING' },
  { date: 'May 23, 2024', id: '#TX-12089', customer: 'Home Builders Assoc.',  product: 'Treated Cedar Decking',  volume: 8000, total: 5120.00,  status: 'PENDING' },
  { date: 'May 23, 2024', id: '#TX-12088', customer: 'Riverside Millwork',    product: 'Maple Trim 1×6',         volume: 2100, total: 2415.00,  status: 'SHIPPED' },
];

const logistics = [
  { id: '#8291', product: 'Pine Sawn',  status: 'In Transit',  detail: 'Expected 2:00 PM', color: '#7a4a28' },
  { id: '#8294', product: 'Oak Logs',   status: 'Unloading',   detail: 'Bay 4',            color: '#4a7a28' },
  { id: '#8288', product: 'Cedar Trim', status: 'Stored',      detail: 'Rack B12',         color: '#6b7280' },
];

const revenueBars = [2, 3, 2.5, 4, 3.5, 5, 4.5, 6, 5, 7, 6, 8, 7, 9, 8, 10, 8, 9, 7, 8, 6, 7];

function statusStyle(s: string) {
  if (s === 'SHIPPED')   return 'bg-green-100 text-green-700';
  if (s === 'IN-DRYING') return 'bg-orange-100 text-orange-700';
  if (s === 'PENDING')   return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-600';
}

export default function CustomerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Yard Manager. Here is the summary for today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-[#a0521e] text-[#a0521e] font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-orange-50 transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            EXPORT REPORT
          </button>
          <Link href="/transactions" className="flex items-center gap-2 bg-[#1a3d2b] hover:bg-[#142d20] text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            NEW TRANSACTION
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 tracking-widest">TODAY'S INCOME</p>
            <svg width="22" height="22" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-3xl font-bold text-gray-900">$12,450.00</p>
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">+14%</span>
          </div>
          <div className="w-full h-px bg-gray-100 my-3" />
          <p className="text-xs text-gray-400">From 24 completed deliveries today.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 tracking-widest">WEEKLY INCOME</p>
            <svg width="22" height="22" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="5" width="4" height="16" rx="1" />
            </svg>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-3xl font-bold text-gray-900">$84,200.00</p>
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">+4.2%</span>
          </div>
          <div className="w-full h-px bg-gray-100 my-3" />
          <p className="text-xs text-gray-400">Vs. $80,800 last week.</p>
        </div>

        <div className="bg-[#1a3d2b] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-[#4a7a5a] tracking-widest mb-3">ACTIVE INVENTORY</p>
            <p className="text-3xl font-bold text-white mb-2">1,240,000 BF</p>
            <p className="text-[#7aab8a] text-xs">Kiln-Drying Status: 85% Capacity</p>
          </div>
          <div className="flex gap-1.5 mt-5 items-end h-10">
            {[6, 8, 7, 9, 5].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 10}%`, backgroundColor: i === 4 ? '#3a6a4a' : '#2a5a3a' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trends + Logistics */}
      <div className="grid grid-cols-3 gap-5">
        {/* Revenue Trends */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Revenue Trends</h3>
            <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden text-xs font-bold">
              <button className="px-3 py-1.5 bg-gray-100 text-gray-900">MONTHLY</button>
              <button className="px-3 py-1.5 text-gray-400 hover:bg-gray-50">QUARTERLY</button>
            </div>
          </div>
          <div className="flex items-end gap-1 h-36 mb-3">
            {revenueBars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(h / 10) * 100}%`, backgroundColor: i === revenueBars.length - 2 ? '#1a3d2b' : '#d4ddd8' }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-semibold">
            {['JAN','FEB','MAR','APR','MAY','JUN'].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Current Logistics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 text-lg mb-5">Current Logistics</h3>
          <div className="flex-1 space-y-4">
            {logistics.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                  <svg width="16" height="16" fill="none" stroke={item.color} strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8l6-3v13l-6-3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Load {item.id} - {item.product}</p>
                  <p className="text-xs text-gray-400">{item.status} - {item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full border border-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-lg hover:bg-gray-50 transition-colors tracking-widest">
            VIEW ALL LOGISTICS
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="18" y2="18" />
            </svg>
            FILTER
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['DATE','ID','CUSTOMER','PRODUCT','VOLUME (BF)','TOTAL','STATUS'].map((h) => (
                <th key={h} className="text-left py-3 px-6 text-xs font-bold text-gray-400 tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-500">{tx.date}</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-900">{tx.id}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{tx.customer}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{tx.product}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{tx.volume.toLocaleString()}</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-900">${tx.total.toFixed(2)}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle(tx.status)}`}>{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing 1-4 of 24 transactions today</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
            <button className="flex items-center gap-1 hover:text-gray-800">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              PDF
            </button>
            <button className="flex items-center gap-1 hover:text-gray-800">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              CSV
            </button>
            <button className="flex items-center gap-1 hover:text-gray-800">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              PRINT
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pb-4">
        <div className="flex items-center gap-3">
          <span>LumberTrack Pro</span>
          <span>|</span>
          <span>Yard Manager v2.4.8</span>
        </div>
        <div className="flex gap-6 font-semibold">
          <button className="hover:text-gray-700">SUPPORT CENTER</button>
          <button className="hover:text-gray-700">DOCUMENTATION</button>
          <button className="hover:text-gray-700">PRIVACY POLICY</button>
        </div>
      </div>
    </div>
  );
}
