# ลานไม้ — Project Specification

## Overview
ระบบจัดการลานไม้ สำหรับติดตามการรับซื้อไม้ การขายไม้ออก การชั่งน้ำหนัก การออกบิล และสรุปรายรับ-รายจ่าย รองรับทั้ง Desktop และ Mobile

---

## User Roles
- **Admin** — ผู้ดูแลลานเพียง 1 บัญชี จัดการชั่งน้ำหนัก ราคา และบิล
- **User** — ลูกค้า (คนขับรถ) ที่มีบัญชีล็อกอินเพื่อดูประวัติการขาย รายรับ และแก้ไขข้อมูลตัวเอง

---

## Business Flows

### Flow 1: รับซื้อไม้ (ลูกค้าเอาไม้มาขาย)
```
1. ลูกค้าขับรถมาพร้อมไม้
2. Admin บันทึก before_weight (น้ำหนักรถ + ไม้)
3. ลูกค้าลงไม้
4. Admin บันทึก after_weight (น้ำหนักรถเปล่า)
5. ระบบคำนวณ net_weight = before_weight - after_weight
6. ระบบดึงราคาวันนั้น → คำนวณ total_price = net_weight × price_per_kg
7. ระบบใช้ลายเซ็นของกิจการ/เจ้าของลานที่ตั้งค่าไว้ → สร้าง PDF Bill
8. บันทึก transaction
```

### Flow 2: ขายไม้ออก (ลานขายไม้ให้ผู้ซื้อ)
```
1. รถผู้ซื้อขับเข้ามาเปล่า
2. Admin บันทึก before_weight (น้ำหนักรถเปล่า)
3. ขนไม้ขึ้นรถ
4. Admin บันทึก after_weight (น้ำหนักรถ + ไม้)
5. ระบบคำนวณ net_weight = after_weight - before_weight
6. Admin กรอกราคาขายเอง
7. บันทึก transaction
```

---

## Database Schema

### 1. `user`
| Column | Type | Notes |
|---|---|---|
| user_id | UUID PK | |
| username | VARCHAR UNIQUE | |
| password_hash | VARCHAR | bcrypt |
| role | ENUM(admin, user) | |
| customer_id | UUID FK → customer NULLABLE UNIQUE | เชื่อมกับ customer เมื่อ role = user |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

> หมายเหตุ: ระบบมี admin เพียง 1 บัญชีเท่านั้น โดยสร้างไว้ล่วงหน้าหรือกำหนดผ่าน seed/initial setup ไม่เปิดให้ register เป็น admin

### 2. `customer`
| Column | Type | Notes |
|---|---|---|
| customer_id | UUID PK | |
| name | VARCHAR | ชื่อ-สกุล |
| type_car | VARCHAR | ประเภทรถ |
| model_car | VARCHAR | รุ่นรถ |
| color_car | VARCHAR | สีรถ |
| license_plate | VARCHAR | ทะเบียน |
| phone | VARCHAR | เบอร์โทร |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

> หมายเหตุ: Customer เป็นข้อมูลลูกค้าในเชิงธุรกิจ และสามารถเชื่อมกับ User สำหรับลูกค้าที่ต้องล็อกอินเข้าใช้งานระบบได้

### 3. `wood_type`
| Column | Type | Notes |
|---|---|---|
| wood_id | UUID PK | |
| name | VARCHAR | ชื่อไม้ |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 4. `destination`
| Column | Type | Notes |
|---|---|---|
| destination_id | UUID PK | |
| name | VARCHAR UNIQUE | เช่น โรงงานไม้ฟืน, โรงงานไม้ท่อน |
| code | VARCHAR UNIQUE | ใช้เป็น machine-readable key |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

> หมายเหตุ: เริ่มต้น seed ข้อมูล 2 รายการ และรองรับการเพิ่มปลายทางใหม่ในอนาคต

### 5. `daily_price`
| Column | Type | Notes |
|---|---|---|
| price_id | UUID PK | |
| wood_id | UUID FK → wood_type | |
| price_per_kg | DECIMAL | ราคา/กก. |
| effective_date | DATE | วันที่มีผล |
| created_by | UUID FK → user | admin ที่กรอก |
| created_at | TIMESTAMP | |

> เก็บประวัติราคาแต่ละวัน ดึงราคา ณ วันที่ทำ transaction

### 6. `buy_transaction` (รับซื้อไม้)
| Column | Type | Notes |
|---|---|---|
| transaction_id | UUID PK | |
| customer_id | UUID FK → customer | |
| wood_id | UUID FK → wood_type | |
| before_weight | DECIMAL | น้ำหนักรถก่อนลงไม้ (กก.) |
| after_weight | DECIMAL | น้ำหนักรถหลังลงไม้ (กก.) |
| net_weight | DECIMAL GENERATED | before - after |
| price_per_kg | DECIMAL | snapshot จาก daily_price |
| total_price | DECIMAL GENERATED | net_weight × price_per_kg |
| status | ENUM(pending, completed, cancelled) | |
| bill_id | UUID FK → bill NULLABLE | |
| created_by | UUID FK → user | admin ที่บันทึก |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 7. `sell_transaction` (ขายไม้ออก)
| Column | Type | Notes |
|---|---|---|
| transaction_id | UUID PK | |
| wood_id | UUID FK → wood_type | |
| destination_id | UUID FK → destination | ปลายทางขาย |
| before_weight | DECIMAL | น้ำหนักรถก่อนขึ้นไม้ (กก.) |
| after_weight | DECIMAL | น้ำหนักรถหลังขึ้นไม้ (กก.) |
| net_weight | DECIMAL GENERATED | after - before |
| total_sale_price | DECIMAL | ราคาขายรวมของรายการนั้น |
| notes | TEXT NULLABLE | |
| created_by | UUID FK → user | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 8. `bill`
| Column | Type | Notes |
|---|---|---|
| bill_id | UUID PK | |
| transaction_id | UUID FK → buy_transaction | |
| bill_number | VARCHAR UNIQUE | auto-generated (e.g. BILL-20260510-001) |
| signature_url | VARCHAR | MinIO path ของลายเซ็นกิจการ/เจ้าของลาน |
| pdf_url | VARCHAR | MinIO path |
| created_by | UUID FK → user | |
| created_at | TIMESTAMP | |

### 9. `system_setting`
| Column | Type | Notes |
|---|---|---|
| setting_key | VARCHAR PK | |
| setting_value | TEXT | |
| updated_by | UUID FK → user | admin ที่แก้ไข |
| updated_at | TIMESTAMP | |

> ตัวอย่างค่าที่เก็บ: `company_signature_url`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (TypeScript), Tailwind CSS |
| Backend | Go + Gin |
| Database | PostgreSQL |
| Cache / Session | Redis |
| File Storage | MinIO (via Docker) |
| PDF Generation | Go library (e.g. gofpdf / unipdf) |
| Excel Export | Go library (e.g. excelize) |
| Infrastructure | Docker Compose |
| PWA | next-pwa (Service Worker + IndexedDB) |

---

## File Storage (MinIO)

| Bucket | ใช้สำหรับ | หมายเหตุ |
|---|---|---|
| `signatures` | ลายเซ็นกิจการ/เจ้าของลาน (.png/.jpg) | ใช้ประกอบการออกบิล |
| `bills` | PDF Bill ที่สร้างแล้ว | ถาวร |
| `exports` | Excel export ชั่วคราว | auto-delete หลัง 24h |

---

## Session & Cache (Redis)

| Key Pattern | ใช้สำหรับ | TTL |
|---|---|---|
| `session:{user_id}` | JWT Session | 24h (ต่ออายุเมื่อ active) |
| `price:{wood_id}:{date}` | Cache ราคาประจำวัน | 1h |
| `customer:{customer_id}` | Cache ข้อมูลลูกค้า | 30m |

---

## Offline Support (PWA)

### กลไก
1. ติดตั้ง `next-pwa` → สร้าง Service Worker
2. Cache Strategy:
   - Static assets (JS/CSS/images) → **Cache First**
   - API calls → **Network First** with local fallback
3. เวอร์ชันแรกให้โฟกัสที่การ cache หน้าและข้อมูลอ่านอย่างเดียวก่อน ยังไม่ต้องทำ sync queue สำหรับ write action เต็มรูปแบบ

### หน้าที่ทำงาน Offline ได้
- ดูรายการลูกค้าที่ cache ไว้
- ดูข้อมูลล่าสุดที่ sync สำเร็จและถูก cache ไว้ในเครื่อง

### หน้าที่ต้องการ Network
- Login/Register
- สร้างและแก้ไขข้อมูลทั้งหมดที่เป็น write action
- สร้าง PDF Bill
- ดาวน์โหลดไฟล์จาก MinIO แบบ presigned URL
- Export Excel

### หมายเหตุด้าน Offline
- Offline write support เป็น Phase 2 เมื่อเริ่มใช้งานจริงหรือมีความต้องการหน้างานชัดเจน
- ถ้าจะทำ offline write ในอนาคต ค่อยออกแบบ sync queue, temporary ID, และ conflict handling เพิ่ม

### UI
- แสดง badge สีเขียว/แดง online/offline ที่ navbar ตลอดเวลา

---

## Frontend — Pages & Components

### User Side

#### `/login` และ `/register`
- Form login/register สำหรับ user
- Redirect ตาม role หลัง login สำเร็จ

#### `/dashboard` (User)
- Navbar: Dashboard | ประวัติ | Profile
- สรุปรายได้วันนี้และสัปดาห์นี้
- รายการ transaction ล่าสุด

#### `/history` (User)
- ตารางรายการขายไม้ทั้งหมด
- แต่ละ row: วันที่ | ประเภทไม้ | น้ำหนัก | ราคา
- สรุปยอดรวม: น้ำหนักทั้งหมด + เงินทั้งหมด
- ปุ่มดาวน์โหลด PDF Bill รายการนั้น

#### `/profile` (User)
- แสดงและแก้ไขข้อมูลส่วนตัว (ชื่อ, รุ่นรถ, สีรถ, ทะเบียน, เบอร์)

---

### Admin Side

#### `/admin/login`
- Form login admin สำหรับบัญชีเดียวของระบบ

#### `/admin/dashboard`
- Navbar: Dashboard | ชั่งน้ำหนัก | รายการเงิน | บิล
- สรุปวันนี้: จำนวน transaction รับซื้อ/ขายออก, ยอดเงินรวม
- ราคารับซื้อไม้วันนี้ (แก้ไขได้)

#### `/admin/weight` — หน้ากรอกน้ำหนัก
- Toggle: รับซื้อไม้ / ขายไม้ออก
- **รับซื้อไม้:**
  - Dropdown เลือกลูกค้า (หรือสร้างใหม่)
  - Dropdown เลือกประเภทไม้
  - กรอก before_weight → กรอก after_weight
  - แสดง net_weight และ total_price แบบ real-time
  - ปุ่ม "สร้างบิล" → generate PDF → บันทึก
- **ขายไม้ออก:**
  - เลือกปลายทางจากรายการโรงงาน
  - Dropdown เลือกประเภทไม้
  - กรอก before_weight → กรอก after_weight
  - แสดง net_weight
  - กรอกราคาขายรวม
  - ปุ่มบันทึก

#### `/admin/transactions` — หน้ารายการเงิน
- Tab: รายรับ (buy_transaction) | รายจ่าย (sell_transaction)
- Filter: วันที่, ประเภทไม้, ลูกค้า, ปลายทางขาย
- ตาราง: วันที่ | รายละเอียด | น้ำหนัก | ราคา
- ปุ่ม Export Excel (ทั้งหน้าหรือตาม filter)

#### `/admin/bills` — หน้าแสดงบิล
- Filter: วันที่, ลูกค้า, เลขบิล
- ตาราง: เลขบิล | วันที่ | ลูกค้า | น้ำหนัก | ราคา
- ปุ่มต่อ row: ดูบิล | ดาวน์โหลด PDF
- ปุ่ม Export Excel รายการที่ filter

---

## API Endpoints (REST)

### Auth
```
POST   /api/auth/login
POST   /api/auth/register            (user only)
POST   /api/auth/logout
```

### Users
```
GET    /api/users/me
PUT    /api/users/me
```

### System Settings (Admin only)
```
GET    /api/system-settings
PUT    /api/system-settings/company-signature
```

### Customers (Admin only)
```
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
```

### Wood Types (Admin only)
```
GET    /api/wood-types
POST   /api/wood-types
PUT    /api/wood-types/:id
```

### Daily Prices (Admin only)
```
GET    /api/daily-prices?date=YYYY-MM-DD&wood_id=...
POST   /api/daily-prices
```

### Buy Transactions
```
GET    /api/buy-transactions?date=...&customer_id=...&wood_id=...
POST   /api/buy-transactions           (สร้าง พร้อม before_weight)
PATCH  /api/buy-transactions/:id       (เพิ่ม after_weight → complete)
GET    /api/buy-transactions/export    (ดาวน์โหลด Excel)
```

### Sell Transactions
```
GET    /api/sell-transactions?date=...&wood_id=...&destination_id=...
POST   /api/sell-transactions
GET    /api/sell-transactions/export   (ดาวน์โหลด Excel)
```

### Bills
```
GET    /api/bills?date=...&customer_id=...&bill_number=...
POST   /api/bills                      (generate PDF จาก transaction_id โดยใช้ลายเซ็นกิจการที่ตั้งค่าไว้)
GET    /api/bills/:id/download         (ดาวน์โหลด PDF)
GET    /api/bills/export               (ดาวน์โหลด Excel รายการบิล)
```

---

## Docker Compose Services

```yaml
services:
  frontend:    # Next.js
  backend:     # Go Gin
  postgres:    # PostgreSQL
  redis:       # Redis
  minio:       # MinIO (S3-compatible file storage)
```

---

## Security

- Password: bcrypt hash
- Session: JWT stored in Redis, HttpOnly cookie
- Role-based access: middleware guard ทุก endpoint
- Admin account มีเพียง 1 บัญชี และไม่สามารถสมัครผ่าน public register endpoint ได้
- MinIO: presigned URL สำหรับ download (ไม่ expose bucket โดยตรง)
- HTTPS: ต้องใช้บน production (reverse proxy เช่น Nginx หรือ Caddy)

---

## Notes สำหรับ Implementation

1. `net_weight` และ `total_price` ใน buy_transaction ควร store เป็น computed column หรือคำนวณ ณ เวลา insert
2. `price_per_kg` ใน buy_transaction ต้อง snapshot มาจาก daily_price ณ วันที่ทำรายการ (ไม่ดึง live) เพื่อให้ประวัติถูกต้อง
3. bill_number ควร generate format: `BILL-YYYYMMDD-XXX` (running number รายวัน)
4. Excel export ควรแยก sheet: Summary | รายการละเอียด
5. PDF Bill ควรมี: เลขบิล, วันที่, ชื่อลูกค้า, ทะเบียนรถ, ประเภทไม้, น้ำหนัก, ราคา/กก., ยอดรวม, ลายเซ็นกิจการ
6. ลายเซ็นกิจการควรถูกตั้งค่าเพียงครั้งเดียวใน system settings และถูกนำมาใช้ซ้ำทุกบิล
7. เวอร์ชันแรกควรเป็น online-first เพื่อลดความซับซ้อนของระบบ แล้วค่อยพิจารณา offline write support ใน Phase 2
