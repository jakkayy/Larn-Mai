'use client';

import React, { useState } from 'react';

export default function AdminTransactionsPage() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [dateRange, setDateRange] = useState('30days');
  const [selectedWood, setSelectedWood] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');

  const buyTransactions = [
    {
      date: '24 ต.ค. 2566, 08:45',
      woodType: 'ไม้สักพรีเมียม',
      lot: '#DF-9921-X',
      customer: 'บริษัท ไม้ฝั่งตะวันออก',
      netWeight: 42500,
      unitPrice: 0.58,
      totalValue: 24650.00,
      status: 'SHIPPED'
    },
    {
      date: '23 ต.ค. 2566, 02:15',
      woodType: 'ไม้สีแดง',
      lot: '#RC-4412-B',
      customer: 'โรงสีสะเรด',
      netWeight: 18200,
      unitPrice: 1.12,
      totalValue: 20384.00,
      status: 'IN-DRYING'
    },
    {
      date: '23 ต.ค. 2566, 10:30',
      woodType: 'ไม้สีขาว',
      lot: '#WP-2301-A',
      customer: 'ป่าไม้เหนือ จำกัด',
      netWeight: 31000,
      unitPrice: 0.42,
      totalValue: 13020.00,
      status: 'OVERDUE'
    },
  ];

  const sellTransactions = [
    {
      date: '24 ต.ค. 2566, 09:15',
      woodType: 'ไม้โอ๊ค',
      destination: 'โรงงานไม้ฟืน',
      netWeight: 12500,
      totalPrice: 8750.00,
      status: 'COMPLETED'
    },
    {
      date: '23 ต.ค. 2566, 14:45',
      woodType: 'ไม้เมเปิ้ล',
      destination: 'โรงงานไม้ท่อน',
      netWeight: 8900,
      totalPrice: 6230.00,
      status: 'COMPLETED'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return 'bg-green-100 text-green-700';
      case 'IN-DRYING':
        return 'bg-amber-100 text-amber-700';
      case 'OVERDUE':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">รายการเงิน</h1>
        <p className="text-gray-600">ดูและจัดการรายการรับซื้อและขายไม้ทั้งหมด</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'buy'
                ? 'border-emerald-900 text-emerald-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            รายการรับซื้อ
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'sell'
                ? 'border-emerald-900 text-emerald-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            รายการขายออก
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ช่วงวันที่
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="7days">7 วันล่าสุด</option>
              <option value="30days">30 วันล่าสุด</option>
              <option value="90days">90 วันล่าสุด</option>
            </select>
          </div>

          {/* Wood Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ประเภทไม้
            </label>
            <select
              value={selectedWood}
              onChange={(e) => setSelectedWood(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">ทุกประเภท</option>
              <option value="oak">ไม้โอ๊ค</option>
              <option value="maple">ไม้เมเปิ้ล</option>
              <option value="pine">ไม้สน</option>
            </select>
          </div>

          {/* Customer / Destination */}
          {activeTab === 'buy' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ลูกค้า
              </label>
              <input
                type="text"
                placeholder="ค้นหาชื่อ..."
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ปลายทาง
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">ทุกปลายทาง</option>
                <option value="factory1">โรงงานไม้ฟืน</option>
                <option value="factory2">โรงงานไม้ท่อน</option>
              </select>
            </div>
          )}

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ค้นหา
            </label>
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
            🔄 ล้างตัวกรอง
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold ml-auto">
            📊 Export to Excel
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            แสดง 1 ถึง 3 จากทั้งหมด 152 รายการ
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">วันที่ทำรายการ</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  รายละเอียด / ประเภทไม้
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  {activeTab === 'buy' ? 'ลูกค้า' : 'ปลายทาง'}
                </th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">
                  น้ำหนักสุทธิ (กก.)
                </th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">
                  ราคาต่อหน่วย
                </th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">
                  ยอดรวม
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'buy'
                ? buyTransactions.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-600">{item.date}</td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{item.woodType}</p>
                        <p className="text-xs text-gray-500">{item.lot}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{item.customer}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        {item.netWeight.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">
                        ฿{item.unitPrice.toFixed(2)}/กก.
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        ฿{item.totalValue.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                : sellTransactions.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-600">{item.date}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{item.woodType}</td>
                      <td className="py-4 px-6 text-gray-600">{item.destination}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        {item.netWeight.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">-</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        ฿{item.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">แสดง 1 ถึง 3 จากทั้งหมด 152 รายการ</p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">‹</button>
            <button className="px-3 py-2 bg-emerald-900 text-white rounded-lg font-semibold">1</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">›</button>
          </div>
          <div className="flex gap-2 ml-auto">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
              🖨️ Print View
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
              📥 Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
