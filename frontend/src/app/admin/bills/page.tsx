'use client';

import React, { useState } from 'react';

export default function AdminBillsPage() {
  const [searchId, setSearchId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const bills = [
    {
      billId: '#BL-2023-4821',
      date: 'ต.ค. 24, 2566',
      customer: 'บริษัท ไม้ฝั่งตะวันออก',
      weight: 12450,
      totalPrice: 4820.00,
      status: 'SHIPPED'
    },
    {
      billId: '#BL-2023-4822',
      date: 'ต.ค. 23, 2566',
      customer: 'โรงสีสะเรด',
      weight: 8200,
      totalPrice: 3150.50,
      status: 'IN-DRYING'
    },
    {
      billId: '#BL-2023-4823',
      date: 'ต.ค. 23, 2566',
      customer: 'ไม้แฮร์เบอร์บิลเดอร์',
      weight: 15700,
      totalPrice: 6200.00,
      status: 'OVERDUE'
    },
    {
      billId: '#BL-2023-4824',
      date: 'ต.ค. 22, 2566',
      customer: 'Summit Timber Solutions',
      weight: 5500,
      totalPrice: 1940.00,
      status: 'SHIPPED'
    },
    {
      billId: '#BL-2023-4825',
      date: 'ต.ค. 22, 2566',
      customer: 'Riverbend Custom Wood',
      weight: 9800,
      totalPrice: 3425.00,
      status: 'IN-DRYING'
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
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">บิล</h1>
        <p className="text-gray-600">ดูและจัดการบิลทั้งหมด ดาวน์โหลด PDF หรือ Export Excel</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ค้นหาเลขบิลหรือชื่อลูกค้า
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl">
                🔍
              </button>
            </div>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              จากวันที่
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ถึงวันที่
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="shipped">SHIPPED</option>
              <option value="in-drying">IN-DRYING</option>
              <option value="overdue">OVERDUE</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-800">
            🔍 ใช้ตัวกรอง
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            แสดง 148 บิลสำหรับไตรมาสปัจจุบัน
          </p>
          <button className="px-4 py-2 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-800">
            📊 Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">เลขบิล</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">วันที่</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">ลูกค้า</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">น้ำหนัก (กก.)</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">ยอดรวม</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">สถานะ</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-emerald-900">{bill.billId}</td>
                  <td className="py-4 px-6 text-gray-600">{bill.date}</td>
                  <td className="py-4 px-6 text-gray-900">{bill.customer}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {bill.weight.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    ฿{bill.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-lg"
                        title="ดูบิล"
                      >
                        👁️
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-lg"
                        title="ดาวน์โหลด PDF"
                      >
                        📥
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">แสดง 1 ถึง 25 จากทั้งหมด 148 รายการ</p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">‹</button>
            <button className="px-3 py-2 bg-emerald-900 text-white rounded-lg font-semibold">1</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-emerald-900 text-white rounded-lg p-6">
          <p className="text-sm text-emerald-200 font-semibold mb-2">รวมรายรับ</p>
          <p className="text-3xl font-bold">฿42,850.12</p>
          <p className="text-xs text-emerald-200 mt-2">สำหรับไตรมาสปัจจุบัน</p>
        </div>

        {/* Active Inventory Load */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-2">ม้าที่ทำงานอยู่</p>
          <p className="text-3xl font-bold text-gray-900">124.5</p>
          <p className="text-xs text-gray-500 mt-2">ตัน</p>
        </div>

        {/* Facility Status */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-2">สถานะสิ่งอำนวยความสะดวก</p>
          <p className="text-xl font-bold text-gray-900">ความจุสูง</p>
          <p className="text-xs text-gray-500 mt-2">ทำให้ได้ผลลัพธ์ที่ดี</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 justify-end pb-6">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
          🖨️ Print Batch
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
          📥 Download CSV
        </button>
      </div>
    </div>
  );
}
