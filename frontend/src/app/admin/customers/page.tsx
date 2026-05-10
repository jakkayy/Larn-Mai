'use client';

import { useState, useEffect, useCallback } from 'react';

interface Customer {
  customer_id: string;
  name: string;
  type_car: string;
  model_car: string;
  color_car: string;
  license_plate: string;
  phone: string;
}

interface CustomerFormData {
  name: string;
  type_car: string;
  model_car: string;
  color_car: string;
  license_plate: string;
  phone: string;
}

const emptyForm: CustomerFormData = {
  name: '',
  type_car: '',
  model_car: '',
  color_car: '',
  license_plate: '',
  phone: '',
};

const API = 'http://localhost:8000/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCustomers = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `${API}/customers?q=${encodeURIComponent(q)}` : `${API}/customers`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : data.customers ?? []);
      }
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const delay = setTimeout(() => fetchCustomers(search), 350);
    return () => clearTimeout(delay);
  }, [search, fetchCustomers]);

  const openAdd = () => {
    setForm(emptyForm);
    setFormError('');
    setSelectedCustomer(null);
    setModalMode('add');
  };

  const openEdit = (c: Customer) => {
    setForm({
      name: c.name,
      type_car: c.type_car,
      model_car: c.model_car,
      color_car: c.color_car,
      license_plate: c.license_plate,
      phone: c.phone,
    });
    setFormError('');
    setSelectedCustomer(c);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCustomer(null);
    setFormError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    try {
      const isEdit = modalMode === 'edit' && selectedCustomer;
      const url = isEdit ? `${API}/customers/${selectedCustomer.customer_id}` : `${API}/customers`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        return;
      }
      closeModal();
      fetchCustomers(search);
    } catch {
      setFormError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof CustomerFormData; label: string; placeholder: string }[] = [
    { key: 'name',          label: 'ชื่อ-นามสกุล',    placeholder: 'เช่น สมชาย ใจดี' },
    { key: 'type_car',      label: 'ประเภทรถ',          placeholder: 'เช่น รถบรรทุก 10 ล้อ' },
    { key: 'model_car',     label: 'รุ่นรถ',            placeholder: 'เช่น HINO 500' },
    { key: 'color_car',     label: 'สีรถ',              placeholder: 'เช่น ขาว' },
    { key: 'license_plate', label: 'ทะเบียนรถ',         placeholder: 'เช่น กข-1234' },
    { key: 'phone',         label: 'เบอร์โทรศัพท์',    placeholder: 'เช่น 081-234-5678' },
  ];

  return (
    <div className="p-6 space-y-5 bg-[#f0efeb] min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">จัดการข้อมูลลูกค้าและผู้ขนส่งทั้งหมด</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1a3d2b] hover:bg-[#142d20] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          เพิ่มลูกค้า
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, ทะเบียน, เบอร์โทร..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3d2b] text-gray-700 placeholder-gray-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {loading ? 'กำลังโหลด...' : `พบ ${customers.length} รายการ`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-400 tracking-widest">#</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">ชื่อ-นามสกุล</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">ประเภทรถ</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">รุ่น / สี</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">ทะเบียน</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 tracking-widest">เบอร์โทร</th>
                <th className="text-center py-3 px-6 text-xs font-bold text-gray-400 tracking-widest">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="py-4 px-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                    {search ? `ไม่พบลูกค้าที่ค้นหา "${search}"` : 'ยังไม่มีข้อมูลลูกค้า'}
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr key={c.customer_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-xs text-gray-400 font-semibold">{i + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1a3d2b] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{c.type_car}</td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900 font-medium">{c.model_car}</p>
                      <p className="text-xs text-gray-400">{c.color_car}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-[#1a3d2b] bg-[#e8f0eb] px-2.5 py-1 rounded-md">
                        {c.license_plate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{c.phone}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openEdit(c)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a3d2b] hover:bg-[#e8f0eb] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'เพิ่มลูกค้าใหม่' : 'แก้ไขข้อมูลลูกค้า'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {fields.map(({ key, label, placeholder }) => (
                  <div key={key} className={key === 'name' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">
                      {label.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3d2b]"
                    />
                  </div>
                ))}
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {formError}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#1a3d2b] hover:bg-[#142d20] disabled:opacity-60 rounded-lg transition-colors"
              >
                {saving ? 'กำลังบันทึก...' : modalMode === 'add' ? 'เพิ่มลูกค้า' : 'บันทึกการแก้ไข'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
