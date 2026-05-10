'use client';

import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState('Larn Mai');
  const [companyAddress, setCompanyAddress] = useState('123 ถนนสุขุมวิท, กรุงเทพฯ 10110');
  const [companyPhone, setCompanyPhone] = useState('(66) 2-123-4567');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    console.log('Settings saved', {
      companyName,
      companyAddress,
      companyPhone,
      signatureFile,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ตั้งค่า</h1>
        <p className="text-gray-600">จัดการการตั้งค่าระบบ ลายเซ็นกิจการ และการกำหนดค่าอื่น ๆ</p>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลกิจการ</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ชื่อกิจการ
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ที่อยู่
            </label>
            <textarea
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Company Signature */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">ลายเซ็นกิจการ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              อัปโหลดลายเซ็นกิจการ (PNG/JPG)
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleSignatureChange}
                className="hidden"
                id="signature-upload"
              />
              <label htmlFor="signature-upload" className="cursor-pointer">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-gray-700 font-semibold mb-1">
                  คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง
                </p>
                <p className="text-sm text-gray-500">
                  PNG หรือ JPG, ไม่เกิน 2 MB
                </p>
              </label>
            </div>

            {signatureFile && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  ✓ ไฟล์ที่เลือก: {signatureFile.name}
                </p>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              ตัวอย่าง
            </label>

            {signaturePreview ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <img
                  src={signaturePreview}
                  alt="Signature Preview"
                  className="max-h-48 mx-auto"
                />
                <button
                  onClick={() => {
                    setSignatureFile(null);
                    setSignaturePreview(null);
                  }}
                  className="mt-4 w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-semibold"
                >
                  ลบไฟล์
                </button>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-48">
                <p className="text-center text-gray-500">
                  ยังไม่มีไฟล์ลายเซ็น<br />
                  อัปโหลดไฟล์เพื่อดูตัวอย่าง
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Default Wood Prices */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">ราคารับซื้อไม้เริ่มต้น</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'ไม้สักพรีเมียม (A-Grade)', current: 4.25 },
              { name: 'ไม้เมเปิ้ล', current: 3.80 },
              { name: 'ไม้โอ๊ค', current: 6.15 },
              { name: 'ไม้สนขาว', current: 1.45 },
              { name: 'ไม้สีแดง', current: 3.20 },
              { name: 'ไม้สีดำ', current: 5.50 },
            ].map((wood, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {wood.name}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={wood.current}
                    step="0.01"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="flex items-center px-3 text-gray-600 font-semibold">
                    บาท/กก.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          ราคาเหล่านี้จะใช้เป็นค่าเริ่มต้นเมื่อสร้างรายการใหม่
        </p>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลระบบ</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-semibold">เวอร์ชันระบบ</span>
            <span className="text-gray-900 font-bold">v2.4.0</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-semibold">สถานะการเชื่อมต่อฐานข้อมูล</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-900 font-semibold">เชื่อมต่อสำเร็จ</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-semibold">สถานะ Redis Cache</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-900 font-semibold">พร้อมใช้งาน</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700 font-semibold">ที่เก็บไฟล์ (MinIO)</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-900 font-semibold">ทำงานปกติ</span>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Access Log */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">บันทึกการเข้าถึง</h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Admin Login: J. Miller</p>
              <p className="text-gray-600">192.168.1.45</p>
            </div>
            <p className="text-gray-500">45 นาทีที่แล้ว</p>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Settings Updated by Admin</p>
              <p className="text-gray-600">ปรับปรุงราคาไม้วันนี้</p>
            </div>
            <p className="text-gray-500">2 ชั่วโมงที่แล้ว</p>
          </div>

          <div className="flex justify-between items-center py-3 text-sm">
            <div>
              <p className="font-semibold text-gray-900">System Backup Completed</p>
              <p className="text-gray-600">Daily automatic backup</p>
            </div>
            <p className="text-gray-500">22 ชั่วโมงที่แล้ว</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pb-6">
        <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
          ยกเลิก
        </button>
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 font-semibold"
        >
          💾 บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
