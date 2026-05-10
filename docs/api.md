# API

เอกสารนี้สรุป API ชุดแรกของ backend โดยเริ่มจาก auth, current user, และ health check

## Health

### `GET /health`

ใช้ตรวจว่า backend, PostgreSQL, และ Redis พร้อมใช้งาน

Response:

```json
{
  "data": {
    "status": "ok"
  }
}
```

## Auth

### `POST /api/auth/register`

เปิดให้ `user` สมัครใช้งานเอง โดย backend จะสร้างทั้ง `customers` และ `users`

Request body:

```json
{
  "username": "driver01",
  "password": "password123",
  "name": "สมชาย ใจดี",
  "type_car": "รถบรรทุก",
  "model_car": "Isuzu",
  "color_car": "ขาว",
  "license_plate": "กข1234",
  "phone": "0812345678"
}
```

### `POST /api/auth/login`

รองรับทั้ง `admin` และ `user`

Request body:

```json
{
  "username": "admin",
  "password": "admin1234"
}
```

เมื่อ login สำเร็จ ระบบจะ set `HttpOnly cookie`

### `POST /api/auth/logout`

ต้อง login ก่อน ใช้ลบ session ออกจาก Redis และล้าง cookie

## Users

### `GET /api/users/me`

ต้อง login ก่อน ใช้ดึงข้อมูล user ปัจจุบันพร้อม customer profile ถ้ามี

### `PUT /api/users/me`

ต้อง login ก่อน ใช้แก้ไขข้อมูล profile ของ user ปัจจุบัน

Request body:

```json
{
  "name": "สมชาย ใจดี",
  "type_car": "รถบรรทุก",
  "model_car": "Isuzu",
  "color_car": "ขาว",
  "license_plate": "กข1234",
  "phone": "0812345678"
}
```

หมายเหตุ:

- endpoint นี้แก้เฉพาะข้อมูลใน `customer`
- ยังไม่ครอบคลุมการเปลี่ยน `username` หรือ `password`

## Admin

### `GET /api/admin/me`

ต้องเป็น `admin` เท่านั้น ใช้ทดสอบ role guard ชุดแรก

## Buy Transactions

endpoint ชุดนี้ใช้สำหรับ flow รับซื้อไม้ฝั่ง `admin`

### `GET /api/buy-transactions`

ใช้ดูรายการรับซื้อไม้ โดยรองรับ query:

- `date=YYYY-MM-DD`
- `customer_id`
- `wood_id`

ต้องเป็น `admin`

### `POST /api/buy-transactions`

สร้างรายการรับซื้อไม้รอบแรก โดย backend จะ snapshot `daily_price` ของประเภทไม้นั้นจาก `CURRENT_DATE`

Request body:

```json
{
  "customer_id": "11111111-1111-1111-1111-111111111111",
  "wood_id": "22222222-2222-2222-2222-222222222222",
  "before_weight": 2500.5
}
```

หมายเหตุ:

- ถ้ายังไม่มี `daily_price` ของไม้ชนิดนั้นในวันนี้ ระบบจะตอบกลับ error
- รายการที่สร้างใหม่จะอยู่ในสถานะ `pending`

### `PATCH /api/buy-transactions/:id`

ใช้บันทึก `after_weight` เพื่อ complete รายการรอบที่สอง

Request body:

```json
{
  "after_weight": 1800.25
}
```

หมายเหตุ:

- `after_weight` ต้องน้อยกว่า `before_weight`
- ใช้ได้เฉพาะรายการที่ยังเป็น `pending`

## Wood Types

endpoint ชุดนี้ใช้จัดการ master data ของประเภทไม้ฝั่ง `admin`

### `GET /api/wood-types`

ใช้ดูรายการประเภทไม้ทั้งหมด

### `POST /api/wood-types`

ใช้เพิ่มประเภทไม้ใหม่

Request body:

```json
{
  "name": "ไม้ยาง"
}
```

## Daily Prices

endpoint ชุดนี้ใช้กำหนดราคารับซื้อไม้รายวันฝั่ง `admin`

### `GET /api/daily-prices`

ใช้ดูรายการราคาประจำวัน โดยรองรับ query:

- `date=YYYY-MM-DD`
- `wood_id`

### `POST /api/daily-prices`

ใช้สร้างราคาประจำวันของไม้แต่ละชนิด

Request body:

```json
{
  "wood_id": "22222222-2222-2222-2222-222222222222",
  "price_per_kg": 3.5,
  "effective_date": "2026-05-10"
}
```

หมายเหตุ:

- 1 ชนิดไม้มีได้ 1 ราคา ต่อ 1 วัน
- ถ้าสร้างซ้ำวันเดิม ระบบจะตอบ conflict
