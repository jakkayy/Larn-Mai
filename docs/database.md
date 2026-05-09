# Database Schema

เอกสารนี้สรุปโครงสร้างฐานข้อมูล PostgreSQL สำหรับระบบลานไม้ โดยแปลงจาก [PROJECT_SPEC.md](/home/naeiger/project-personal/web/lan-mai/PROJECT_SPEC.md) ให้เป็น schema ที่พร้อมใช้จริงกับ migration

## Design Principles

- ใช้ `UUID` เป็น primary key สำหรับ entity หลัก
- ใช้ `timestamptz` สำหรับเวลาที่ระบบบันทึก
- ใช้ `numeric(12,3)` สำหรับน้ำหนัก และ `numeric(12,2)` สำหรับราคา
- เก็บ `price_per_kg` แบบ snapshot ใน `buy_transactions` เพื่อให้ประวัติราคาไม่เปลี่ยนย้อนหลัง
- แยก `buy_transactions` และ `sell_transactions` ออกจากกันเพื่อลดความซับซ้อนของ business logic
- ใช้ `bills.transaction_id` เป็นตัวเชื่อม one-to-one กับ `buy_transactions`

## PostgreSQL Extensions

- `pgcrypto`
  ใช้ `gen_random_uuid()` สำหรับ default UUID

## Enum Types

### `user_role`

- `admin`
- `user`

### `buy_transaction_status`

- `pending`
- `completed`
- `cancelled`

## Tables

### `customers`

เก็บข้อมูลลูกค้าในเชิงธุรกิจ

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `customer_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `varchar(255)` | not null | ชื่อ-สกุล |
| `type_car` | `varchar(100)` | not null | ประเภทรถ |
| `model_car` | `varchar(100)` | not null | รุ่นรถ |
| `color_car` | `varchar(100)` | not null | สีรถ |
| `license_plate` | `varchar(50)` | not null | ทะเบียนรถ |
| `phone` | `varchar(30)` | not null | เบอร์โทร |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

Indexes:

- unique index on `license_plate`
- index on `name`

### `users`

เก็บบัญชีผู้ใช้งานระบบ โดย `admin` มีได้เพียง 1 บัญชี

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `username` | `varchar(100)` | not null, unique | |
| `password_hash` | `varchar(255)` | not null | bcrypt hash |
| `role` | `user_role` | not null | |
| `customer_id` | `uuid` | FK nullable, unique | ใช้สำหรับ user ฝั่งลูกค้า |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

Rules:

- partial unique index บังคับให้มี `admin` ได้สูงสุด 1 แถว
- `customer_id` เป็น `NULL` ได้เฉพาะ `admin`

### `wood_types`

เก็บประเภทไม้

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `wood_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `varchar(100)` | not null, unique | |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

### `destinations`

เก็บปลายทางขายไม้ รองรับการเพิ่มโรงงานในอนาคต

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `destination_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `varchar(150)` | not null, unique | ชื่อที่แสดงให้ผู้ใช้เห็น |
| `code` | `varchar(50)` | not null, unique | machine-readable key |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

### `daily_prices`

เก็บราคาประเภทไม้รายวัน

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `price_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `wood_id` | `uuid` | FK not null | |
| `price_per_kg` | `numeric(12,2)` | not null, check `>= 0` | |
| `effective_date` | `date` | not null | วันที่ราคาเริ่มมีผล |
| `created_by` | `uuid` | FK not null | admin ผู้สร้างราคา |
| `created_at` | `timestamptz` | not null, default `now()` | |

Indexes:

- unique index on `(wood_id, effective_date)`
- index on `effective_date`

### `buy_transactions`

เก็บรายการรับซื้อไม้แบบ 2-step

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `transaction_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `customer_id` | `uuid` | FK not null | |
| `wood_id` | `uuid` | FK not null | |
| `before_weight` | `numeric(12,3)` | not null, check `> 0` | น้ำหนักรถก่อนลงไม้ |
| `after_weight` | `numeric(12,3)` | nullable, check `> 0` when not null | น้ำหนักรถหลังลงไม้ |
| `net_weight` | `numeric(12,3)` | generated stored | `before_weight - after_weight` |
| `price_per_kg` | `numeric(12,2)` | not null, check `>= 0` | snapshot ตอนสร้างรายการ |
| `total_price` | `numeric(14,2)` | generated stored | `net_weight * price_per_kg` |
| `status` | `buy_transaction_status` | not null, default `'pending'` | |
| `created_by` | `uuid` | FK not null | admin ผู้บันทึก |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

Rules:

- ถ้า `status = 'pending'` ให้ `after_weight` เป็น `NULL`
- ถ้า `status = 'completed'` ให้ `after_weight` ต้องไม่เป็น `NULL`
- ถ้า `status = 'completed'` ต้องมี `before_weight > after_weight`

### `sell_transactions`

เก็บรายการขายไม้ออกจากลาน

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `transaction_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `wood_id` | `uuid` | FK not null | |
| `destination_id` | `uuid` | FK not null | |
| `before_weight` | `numeric(12,3)` | not null, check `> 0` | น้ำหนักรถก่อนขึ้นไม้ |
| `after_weight` | `numeric(12,3)` | not null, check `> 0` | น้ำหนักรถหลังขึ้นไม้ |
| `net_weight` | `numeric(12,3)` | generated stored | `after_weight - before_weight` |
| `total_sale_price` | `numeric(14,2)` | not null, check `>= 0` | ราคาขายรวม |
| `notes` | `text` | nullable | |
| `created_by` | `uuid` | FK not null | admin ผู้บันทึก |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

Rules:

- `after_weight > before_weight`

### `bills`

เก็บบิล PDF ของรายการรับซื้อไม้แบบ one-to-one

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `bill_id` | `uuid` | PK, default `gen_random_uuid()` | |
| `transaction_id` | `uuid` | FK not null, unique | one-to-one กับ `buy_transactions` |
| `bill_number` | `varchar(50)` | not null, unique | เช่น `BILL-20260510-001` |
| `signature_url` | `text` | not null | path ของลายเซ็นกิจการ |
| `pdf_url` | `text` | not null | path ของไฟล์ PDF |
| `created_by` | `uuid` | FK not null | admin ผู้สร้างบิล |
| `created_at` | `timestamptz` | not null, default `now()` | |

หมายเหตุ:

- ใน implementation จริงไม่จำเป็นต้องเก็บ `bill_id` ย้อนกลับใน `buy_transactions` เพราะ one-to-one ถูกบังคับด้วย `bills.transaction_id unique` อยู่แล้ว

### `system_settings`

เก็บค่าระดับระบบ

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `setting_key` | `varchar(100)` | PK | |
| `setting_value` | `text` | not null | |
| `updated_by` | `uuid` | FK nullable | admin ผู้แก้ไขล่าสุด |
| `updated_at` | `timestamptz` | not null, default `now()` | |

ค่าเริ่มต้นที่ควรมี:

- `company_signature_url`

## Relationships Summary

- `users.customer_id -> customers.customer_id`
- `daily_prices.wood_id -> wood_types.wood_id`
- `daily_prices.created_by -> users.user_id`
- `buy_transactions.customer_id -> customers.customer_id`
- `buy_transactions.wood_id -> wood_types.wood_id`
- `buy_transactions.created_by -> users.user_id`
- `sell_transactions.wood_id -> wood_types.wood_id`
- `sell_transactions.destination_id -> destinations.destination_id`
- `sell_transactions.created_by -> users.user_id`
- `bills.transaction_id -> buy_transactions.transaction_id`
- `bills.created_by -> users.user_id`
- `system_settings.updated_by -> users.user_id`

## Notes For Seed Data

ชุด seed เริ่มต้นควรมี:

- admin 1 บัญชี
- destination 2 รายการ: โรงงานไม้ฟืน, โรงงานไม้ท่อน
- wood types เบื้องต้นตามที่หน้างานใช้จริง
- `system_settings.company_signature_url`
