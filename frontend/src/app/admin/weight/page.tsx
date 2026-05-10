'use client';

import React, { useState } from 'react';

export default function AdminWeightPage() {
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [beforeWeight, setBeforeWeight] = useState('');
  const [afterWeight, setAfterWeight] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedWood, setSelectedWood] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [salePrice, setSalePrice] = useState('');

  const netWeight = beforeWeight && afterWeight
    ? Math.abs(parseFloat(afterWeight) - parseFloat(beforeWeight))
    : 0;

  const calculatedPrice = transactionType === 'buy'
    ? (netWeight * 4.25).toFixed(2)
    : '';

  const handleGenerateBill = () => {
    console.log('Generate Bill');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ชั่งน้ำหนัก</h1>
        <p className="text-gray-600">บันทึกการรับซื้อหรือขายไม้พร้อมคำนวณน้ำหนักและราคา</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            {/* Type Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setTransactionType('buy')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  transactionType === 'buy'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                รับซื้อไม้
              </button>
              <button
                onClick={() => setTransactionType('sell')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  transactionType === 'sell'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ขายไม้ออก
              </button>
            </div>

            {/* Transaction Details Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">รายละเอียดลำเอียด: {transactionType === 'buy' ? 'รับซื้อ' : 'ขาย'}</p>
              <p className="text-sm text-gray-500">TXN-ID: #WB-2026-0941</p>
            </div>

            {/* Customer/Destination Selection */}
            {transactionType === 'buy' ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ลูกค้า / ผู้ผลิต
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">เลือกลูกค้า</option>
                      <option value="1">ทีม โอค</option>
                      <option value="2">สมชาย ไม้เนื้อแข็ง</option>
                      <option value="3">อภิมาน ไม้สด</option>
                    </select>
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl">👤</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภทไม้
                  </label>
                  <select
                    value={selectedWood}
                    onChange={(e) => setSelectedWood(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">เลือกประเภทไม้</option>
                    <option value="oak">ไม้สักขาว - โอ๊ค</option>
                    <option value="maple">ไม้เมเปิ้ล</option>
                    <option value="walnut">ไม้โอ๊ค</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ปลายทาง / โรงงาน
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">เลือกปลายทาง</option>
                    <option value="factory1">โรงงานไม้ฟืน</option>
                    <option value="factory2">โรงงานไม้ท่อน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภทไม้
                  </label>
                  <select
                    value={selectedWood}
                    onChange={(e) => setSelectedWood(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">เลือกประเภทไม้</option>
                    <option value="oak">ไม้สักขาว - โอ๊ค</option>
                    <option value="maple">ไม้เมเปิ้ล</option>
                    <option value="walnut">ไม้โอ๊ค</option>
                  </select>
                </div>
              </div>
            )}

            {/* Weight Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {transactionType === 'buy' ? 'น้ำหนักรถก่อน (กก.)' : 'น้ำหนักรถเปล่า (กก.)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={beforeWeight}
                    onChange={(e) => setBeforeWeight(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="flex items-center px-3 text-gray-600 font-semibold">กก.</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {transactionType === 'buy' ? 'น้ำหนักรถหลัง (กก.)' : 'น้ำหนักรถ + ไม้ (กก.)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={afterWeight}
                    onChange={(e) => setAfterWeight(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="flex items-center px-3 text-gray-600 font-semibold">กก.</span>
                </div>
              </div>
            </div>

            {/* Optional: Lumber Tally for Buy */}
            {transactionType === 'buy' && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ขนาดไม้ (ไม่บังคับ)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['2×4', '2×6', '4×4', '1×12', '6×6'].map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                    >
                      {size}
                    </button>
                  ))}
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700">
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Sale Price for Sell */}
            {transactionType === 'sell' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ราคาขายรวม (บาท)
                </label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {transactionType === 'buy' ? (
                <button
                  onClick={handleGenerateBill}
                  className="flex-1 bg-emerald-900 text-white font-bold py-3 rounded-lg hover:bg-emerald-800"
                >
                  📋 สร้างบิล
                </button>
              ) : (
                <button className="flex-1 bg-emerald-900 text-white font-bold py-3 rounded-lg hover:bg-emerald-800">
                  💾 บันทึก
                </button>
              )}
              <button className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50">
                🖨️ {transactionType === 'buy' ? 'พิมพ์สลิป' : 'พิมพ์'}
              </button>
            </div>
          </div>
        </div>

        {/* Right - Live Calculation */}
        <div>
          <div className="bg-emerald-900 text-white rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-emerald-200 mb-6">การคำนวณแบบ LIVE</h3>

            <div className="mb-6">
              <p className="text-sm text-emerald-200 mb-2">น้ำหนักสุทธิ</p>
              <p className="text-4xl font-bold">{netWeight.toLocaleString()}</p>
              <p className="text-sm text-emerald-200 mt-1">กก.</p>
            </div>

            {transactionType === 'buy' && (
              <div>
                <p className="text-sm text-emerald-200 mb-2">ยอดรวมที่คำนวณได้</p>
                <p className="text-3xl font-bold">฿{calculatedPrice}</p>
                <p className="text-xs text-emerald-200 mt-1">
                  ขึ้นอยู่กับ ฿0.66/กก. สำหรับไม้สักขาว
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-emerald-700">
              <p className="text-sm text-emerald-200 mb-3">ความจุของลาน</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">สถานะ 01</span>
                    <span className="text-xs">42,500 LBS</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-12 rounded ${
                          i < 4 ? 'bg-emerald-600' : 'bg-emerald-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">สถานะ 02</span>
                    <span className="text-xs">EMPTY</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-12 bg-gray-600 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Weigh-ins */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4">รายการชั่งน้ำหนักล่าสุด</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">ป่าสยามป่า</p>
                  <p className="text-xs text-gray-500">ไม้เมเปิ้ล</p>
                </div>
                <p className="font-bold text-gray-900">8,200 กก.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
