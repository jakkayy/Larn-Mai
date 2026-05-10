'use client';

import { useState } from 'react';

const woodColors: Record<string, string> = {
  'Premium Oak':  '#5a3220',
  'Soft Pine':    '#4a3a28',
  'Douglas Fir':  '#6a4a30',
  'Cedar Planks': '#c0392b',
  'White Ash':    '#8a6a50',
};

const allTransactions = [
  { date: 'Oct 24, 2023', woodType: 'Premium Oak',  weight: 4250.00, price: 12750.00, status: 'SHIPPED' },
  { date: 'Oct 22, 2023', woodType: 'Soft Pine',    weight: 8100.00, price: 9315.00,  status: 'IN-DRYING' },
  { date: 'Oct 21, 2023', woodType: 'Douglas Fir',  weight: 2800.00, price: 5880.00,  status: 'SHIPPED' },
  { date: 'Oct 19, 2023', woodType: 'Cedar Planks', weight: 1200.00, price: 4200.00,  status: 'OVERDUE' },
  { date: 'Oct 18, 2023', woodType: 'White Ash',    weight: 5500.00, price: 13200.00, status: 'SHIPPED' },
];

function statusStyle(s: string) {
  if (s === 'SHIPPED')   return 'bg-green-100 text-green-700';
  if (s === 'IN-DRYING') return 'bg-orange-100 text-orange-700';
  if (s === 'OVERDUE')   return 'bg-red-100 text-red-600';
  return 'bg-gray-100 text-gray-600';
}

export default function CustomerTransactionsPage() {
  const [showFilter, setShowFilter] = useState(false);

  const totalWeight  = allTransactions.reduce((s, t) => s + t.weight, 0);
  const totalRevenue = allTransactions.reduce((s, t) => s + t.price, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f0]">
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#a0521e] tracking-widest mb-1">SALES MANAGEMENT</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Sales History</h1>
            <p className="text-gray-400 text-sm">Review and export comprehensive timber transaction records.</p>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" />
              </svg>
              FILTER DATA
            </button>
            <button className="flex items-center gap-2 bg-[#1a3d2b] hover:bg-[#142d20] text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              + NEW SALE
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['DATE','WOOD TYPE','WEIGHT (KG)','PRICE (USD)','STATUS','ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-4 px-6 text-xs font-bold text-gray-400 tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTransactions.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 text-sm text-gray-600">{tx.date}</td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: woodColors[tx.woodType] ?? '#6b7280' }} />
                      <span className="text-sm text-gray-900">{tx.woodType}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-sm text-gray-600">{tx.weight.toFixed(2)}</td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-900">${tx.price.toFixed(2)}</td>
                  <td className="py-5 px-6">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="py-5 px-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing 5 of 124 transactions</p>
            <div className="flex gap-2">
              <button className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="bg-[#1a3d2b] px-8 py-4 flex items-center justify-between">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-[#4a7a5a] font-bold tracking-widest mb-0.5">TOTAL WEIGHT</p>
            <p className="text-white font-bold text-lg">{totalWeight.toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-xs text-[#4a7a5a] font-bold tracking-widest mb-0.5">TOTAL REVENUE</p>
            <p className="text-white font-bold text-lg">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            EXPORT CSV
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            GENERATE REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
