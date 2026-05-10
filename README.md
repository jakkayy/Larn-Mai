# ลานไม้

ระบบจัดการลานไม้ สำหรับติดตามการรับซื้อไม้ การขายไม้ออก การชั่งน้ำหนัก การออกบิล และสรุปรายรับ-รายจ่าย รองรับทั้งฝั่ง `admin` และ `user`

รายละเอียดเชิงธุรกิจและสเปกหลักอยู่ที่ [PROJECT_SPEC.md](/home/naeiger/project-personal/web/lan-mai/PROJECT_SPEC.md)

## เป้าหมายของระบบ

- จัดการ flow รับซื้อไม้จากลูกค้าแบบ 2-step
- จัดการ flow ขายไม้ออกจากลานไปยังโรงงานปลายทาง
- คำนวณน้ำหนักสุทธิและยอดเงินจากข้อมูลการชั่ง
- ออก PDF bill โดยใช้ลายเซ็นของกิจการ
- ให้ลูกค้าดูประวัติการขายและรายรับของตัวเองได้

## Tech Stack

- Frontend: `Next.js` + `TypeScript`
- Backend: `Go` + `Gin`
- Database: `PostgreSQL`
- Cache / Session: `Redis`
- File Storage: `MinIO`
- Infra for local development: `Docker Compose`

## โครงสร้างโปรเจค

```text
lan-mai/
├── PROJECT_SPEC.md
├── README.md
├── .env.example
├── docker-compose.yml
├── frontend/
├── backend/
├── infra/
├── docs/
└── scripts/
```

### รายละเอียดแต่ละส่วน

- `frontend/` แอป Next.js สำหรับหน้าฝั่งลูกค้าและแอดมิน
- `backend/` API server ด้วย Go สำหรับ auth, transaction, billing, report
- `infra/` โฟลเดอร์เตรียมไว้สำหรับ config ด้าน infrastructure เพิ่มเติม
- `docs/` เอกสารเสริม เช่น API, database, business flow
- `scripts/` สคริปต์ช่วยงานระหว่างพัฒนา

## โหมดการพัฒนาในตอนนี้

แนวทางปัจจุบันคือ:

- `frontend` รัน local บนเครื่อง
- `backend` รัน local บนเครื่อง
- services พื้นฐานรันผ่าน Docker ได้แก่ `postgres`, `redis`, `minio`

ดังนั้น `docker-compose.yml` จะใช้สำหรับ infra เท่านั้น ไม่ได้รัน frontend/backend

## เริ่มต้นใช้งาน

### 1. เตรียม environment

คัดลอกค่าจาก `.env.example` ไปเป็นไฟล์ `.env`

ตัวแปรหลักที่มีตอนนี้:

- `FRONTEND_PORT`
- `BACKEND_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `REDIS_PORT`
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`
- `MINIO_PORT`
- `MINIO_CONSOLE_PORT`
- `COMPANY_SIGNATURE_URL`

### 2. เปิด infra services

```bash
docker compose up -d
```

services ที่จะถูกเปิด:

- `postgres`
- `redis`
- `minio`

### 3. รัน frontend local

ตอนนี้ยังไม่ได้ scaffold dependency ของ Next.js ครบทั้งหมด แต่เป้าหมายการรันจะเป็นประมาณนี้:

```bash
cd frontend
npm install
npm run dev
```

### 4. รัน backend local

ตอนนี้ backend เป็น skeleton เริ่มต้น และเป้าหมายการรันจะเป็นประมาณนี้:

```bash
cd backend
go run ./cmd/server
```

### 5. เตรียมฐานข้อมูล

หลังจากเปิด infra แล้ว สามารถสร้าง schema และ seed ข้อมูลเริ่มต้นได้ด้วย:

```bash
./scripts/migrate.sh
./scripts/seed.sh
```

## Ports เริ่มต้น

- Frontend: `3000`
- Backend: `8080`
- PostgreSQL: `5432`
- Redis: `6379`
- MinIO API: `9000`
- MinIO Console: `9001`

## Business Flow หลัก

### 1. รับซื้อไม้

1. Admin บันทึก `before_weight`
2. ลูกค้าลงไม้
3. Admin บันทึก `after_weight`
4. ระบบคำนวณ `net_weight = before_weight - after_weight`
5. ระบบดึงราคาไม้ประจำวัน
6. ระบบคำนวณยอดรวม
7. ระบบสร้าง bill PDF

### 2. ขายไม้ออก

1. Admin บันทึก `before_weight`
2. ขนไม้ขึ้นรถ
3. Admin บันทึก `after_weight`
4. ระบบคำนวณ `net_weight = after_weight - before_weight`
5. Admin กรอกราคาขายรวม
6. บันทึก transaction

## สถานะปัจจุบันของโปรเจค

ตอนนี้โปรเจคยังอยู่ช่วงวางโครงสร้างและสรุปสเปก โดยมีสิ่งที่พร้อมแล้ว:

- สรุป requirement ใน `PROJECT_SPEC.md`
- วางโครงสร้าง repo แยก `frontend / backend / infra`
- เตรียม `docker-compose.yml` สำหรับ local infrastructure
- มี PostgreSQL schema migration แรกแล้ว
- มี seed เริ่มต้นสำหรับ admin, destinations, และ system settings แล้ว

สิ่งที่ยังไม่ได้ทำ:

- scaffold Next.js app แบบสมบูรณ์
- ติดตั้ง package และ dependency จริง
- ทำ seed ข้อมูลประเภทไม้ตามข้อมูลจริงของหน้างาน
- สร้าง REST API
- เชื่อมต่อ frontend กับ backend

## เอกสารที่เกี่ยวข้อง

- [PROJECT_SPEC.md](/home/naeiger/project-personal/web/lan-mai/PROJECT_SPEC.md)
- [docs/api.md](/home/naeiger/project-personal/web/lan-mai/docs/api.md)
- [docs/database.md](/home/naeiger/project-personal/web/lan-mai/docs/database.md)
- [docs/flows.md](/home/naeiger/project-personal/web/lan-mai/docs/flows.md)

## ลำดับงานที่แนะนำต่อจากนี้

1. ออกแบบ database schema และเขียน migration แรก
2. เพิ่ม seed ข้อมูลประเภทไม้ตามข้อมูลจริงของหน้างาน
3. วางโครง backend auth และ health check endpoint
4. scaffold frontend หน้า login และ dashboard พื้นฐาน
5. เชื่อม frontend-backend สำหรับ auth และข้อมูลหลัก

## หมายเหตุ

- ระบบมี `admin` เพียง 1 บัญชี
- `user` สมัครใช้งานได้ปกติผ่านระบบ
- ลายเซ็นที่ใช้ในบิลเป็นลายเซ็นของกิจการและใช้ซ้ำทุกบิล
- offline write support ยังไม่อยู่ในเฟสแรก
- มี migration แรกและ seed เริ่มต้นสำหรับ admin, destinations, และ system settings แล้ว
