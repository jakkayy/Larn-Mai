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

## Admin

### `GET /api/admin/me`

ต้องเป็น `admin` เท่านั้น ใช้ทดสอบ role guard ชุดแรก
