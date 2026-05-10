'use client';

const woodPrices = [
  { name: 'Premium Oak (A-Grade)', unit: 'Board Foot', price: 4.25, delta: -2.1, color: '#5a3220' },
  { name: 'Hard Maple',            unit: 'Board Foot', price: 3.80, delta: +1.4, color: '#c8a870' },
  { name: 'Black Walnut',          unit: 'Board Foot', price: 6.15, delta: 0.0,  color: '#7a5030' },
  { name: 'Eastern White Pine',    unit: 'Linear Foot', price: 1.45, delta: +4.5, color: '#e8d8b0' },
];

const activityFeed = [
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8l6-3v13l-6-3" />
      </svg>
    ),
    bg: 'bg-[#7a4a28]',
    title: 'Inbound Delivery Verified',
    desc: 'Truck #TX-9902 delivered 12 units of Soft Maple. Quality: 94%.',
    time: '12 MINUTES AGO',
    alert: false,
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bg: 'bg-[#1a3d2b]',
    title: 'Admin Login: J. Miller',
    desc: 'Session started from IP: 192.168.1.45',
    time: '45 MINUTES AGO',
    alert: false,
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    bg: 'bg-red-100',
    title: 'Low Inventory Alert',
    desc: 'Cedar stock dropped below critical threshold (200 BF).',
    time: '1 HOUR AGO',
    alert: true,
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    bg: 'bg-gray-200',
    title: 'Price Adjustment',
    desc: 'Premium Oak base price updated by system auto-market-sync.',
    time: '2 HOURS AGO',
    alert: false,
  },
];

const weighbridgeBars = [3, 5, 4, 7, 6, 9, 8, 7, 6, 5, 8, 10, 9, 8, 7, 6, 5, 7, 8, 6, 5, 4, 3, 5];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-5 bg-[#f0efeb] min-h-full">

      {/* Row 1 — Stat Cards */}
      <div className="grid grid-cols-3 gap-4">

        {/* Daily Transactions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-semibold text-gray-500 tracking-widest">DAILY TRANSACTIONS</span>
            <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-full">+12% vs Yesterday</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <svg width="28" height="28" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
            </svg>
            <p className="text-5xl font-bold text-gray-900">142</p>
          </div>
          <div className="h-1 bg-gray-900 rounded-full w-2/3" />
        </div>

        {/* Total Daily Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-semibold text-gray-500 tracking-widest">TOTAL DAILY REVENUE</span>
            <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-full">Peak: 11:00 AM</span>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <svg width="28" height="28" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />
            </svg>
            <p className="text-4xl font-bold text-[#7a4a28]">$52,840</p>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-0.5 h-8 mt-3">
            {[3,4,3,5,4,6,5,4].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h * 16}%`,
                  backgroundColor: i === 5 ? '#7a4a28' : '#d6c4b0',
                }}
              />
            ))}
          </div>
        </div>

        {/* Yard Status */}
        <div className="bg-[#1a3d2b] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-[#4a7a5a] tracking-widest mb-4">YARD STATUS</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <p className="text-2xl font-bold text-white">Optimal Capacity</p>
            </div>
            <p className="text-[#7aab8a] text-sm leading-relaxed">
              Currently processing batch #442. All kilns operational within nominal temperature range.
            </p>
          </div>
          <button className="mt-6 border border-white/30 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-white/10 transition-colors w-fit">
            View Live Feed
          </button>
        </div>
      </div>

      {/* Row 2 — Prices + Activity */}
      <div className="grid grid-cols-3 gap-4">

        {/* Wood Purchase Prices */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="#7a4a28" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <h3 className="font-bold text-gray-900">Today's Wood Purchase Prices</h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">Updated: 2h ago</span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-400 tracking-widest">WOOD GRADE/TYPE</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">UNIT</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">PURCHASE PRICE ($)</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-gray-400 tracking-widest">MARKET DELTA</th>
              </tr>
            </thead>
            <tbody>
              {woodPrices.map((wood, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-sm flex-shrink-0" style={{ backgroundColor: wood.color }} />
                      <span className="font-semibold text-gray-900 text-sm">{wood.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{wood.unit}</td>
                  <td className="py-4 px-4 text-right font-bold text-gray-900">{wood.price.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`text-sm font-bold ${
                      wood.delta > 0 ? 'text-green-600' : wood.delta < 0 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {wood.delta > 0 ? '+' : ''}{wood.delta.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 italic">Changes are autosaved to the pricing registry.</p>
            <button className="bg-[#1a3d2b] hover:bg-[#142d20] text-white text-xs font-bold px-4 py-2.5 rounded-lg tracking-widest transition-colors">
              DOWNLOAD PRICING PDF
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
            </svg>
            <h3 className="font-bold text-gray-900">Activity Feed</h3>
          </div>

          <div className="flex-1 divide-y divide-gray-50">
            {activityFeed.map((item, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${item.bg} ${item.alert ? 'text-red-500' : 'text-white'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight mb-1 ${item.alert ? 'text-red-500' : 'text-gray-900'}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    <p className="text-xs text-gray-300 font-semibold mt-1.5 tracking-wide">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-3 border-t border-gray-100">
            <button className="text-xs font-bold text-gray-500 hover:text-gray-800 tracking-widest transition-colors w-full text-center">
              VIEW ALL SYSTEM LOGS
            </button>
          </div>
        </div>
      </div>

      {/* Row 3 — Weighbridge */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Live Weighbridge Monitoring</h3>
            <p className="text-sm text-gray-400 mt-0.5">Current active scales and incoming volume.</p>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">SCALE 01</p>
              <p className="text-xl font-bold text-gray-900">42,500 LBS</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">SCALE 02</p>
              <p className="text-xl font-bold text-gray-400">EMPTY</p>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-1.5 h-28">
            {weighbridgeBars.map((h, i) => {
              const heightPct = (h / 10) * 100;
              const isPeak = i === 13;
              const isBrown = i >= 8 && i <= 14;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isPeak ? '#7a4a28' : isBrown ? '#c8a870' : '#c8d4cc',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 pb-2">
        <span>Admin Portal Dashboard &nbsp;|&nbsp; Yard ID: #LBR-MAIN-001</span>
        <div className="flex gap-5">
          <button className="flex items-center gap-1.5 hover:text-gray-700 font-semibold transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            EXPORT CSV
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-700 font-semibold transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            EXPORT PDF
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-700 font-semibold transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            PRINT
          </button>
        </div>
      </div>

    </div>
  );
}
