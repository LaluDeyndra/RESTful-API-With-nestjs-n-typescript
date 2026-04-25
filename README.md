# Simple REST API (NestJS + TypeScript)

Project ini saya buat sebagai latihan membuat REST API sederhana dengan NestJS, tapi tetap rapi dan realistis untuk dipakai sebagai bahan penilaian.

## Apa yang ada di project ini?

Sesuai requirement soal, project ini sudah mencakup:

- 2 fitur CRUD yang saling berkaitan: `users` dan `tasks`
- Penyimpanan data di database SQL (**MySQL**)
- Authentication API menggunakan **JWT**
- e2e testing untuk skenario token API
- Dokumentasi endpoint via Postman

## Kenapa pakai pattern ini?

Saya pakai pattern yang paling sering forum gunakan di NestJS dan simple juga, gak susah-susah amat (meskipun line code nya banyak merahnya): **Modular + Layered (Controller - Service - Entity)**.

Alasannya:

- **Lebih rapi**: controller fokus HTTP, service fokus business logic.
- **Mudah dikembangin**: setiap domain dipisah ke module sendiri (`auth`, `users`, `tasks`).
- **Gampang di-test**: karena dependency injection, unit test/e2e lebih gampang disusun.
- **Maintainable**: kalau ada bug, area perbaikannya jelas dan gak campur aduk.

## Relasi data/table

- 1 `User` punya banyak `Task` (`OneToMany`)
- 1 `Task` dimiliki oleh 1 `User` (`ManyToOne`)

## Tech stack

- NestJS
- TypeScript
- MySQL
- Passport JWT
- Jest + Supertest (e2e)

## Setup environment

Copy isi `.env.example` ke `.env`, atau buat file `.env` seperti ini:

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=restful-api
DB_NAME=db_nestjs
JWT_SECRET=dev_secret_key
JWT_EXPIRES_IN=1h
PORT=3000
```

## Menjalankan project

### Opsi 1 - pakai Docker (direkomendasikan)

```bash
docker compose up -d --build
```

API akan jalan di: `http://localhost:3000`

### Opsi 2 - jalankan manual (lokal)

```bash
npm install
npm run start:dev
```

## Menjalankan test

```bash
# unit test
npm run test

# e2e test (token API)
npm run test:e2e
```

Catatan: e2e test diset menggunakan SQLite in-memory khusus test agar stabil dan tidak tergantung MySQL lokal. Runtime aplikasi tetap MySQL sesuai requirement.

## Alur pakai API (singkat)

1. `POST /users` untuk membuat user
2. `POST /auth/login` untuk ambil JWT token
3. Gunakan token di header `Authorization: Bearer <token>`
4. Akses endpoint protected seperti `/users` dan `/tasks`

## Endpoint utama

### Auth

- `POST /auth/login`

### Users

- `POST /users` - create user
- `GET /users` - list users (JWT)
- `GET /users/:id` - user detail (JWT)
- `PUT /users/:id` - update user (JWT)
- `DELETE /users/:id` - delete user (JWT)

### Tasks

- `POST /tasks` - create task milik user login (JWT)
- `GET /tasks` - list task user login (JWT)
- `GET /tasks/:id` - detail task user login (JWT)
- `PUT /tasks/:id` - update task user login (JWT)
- `DELETE /tasks/:id` - delete task user login (JWT)

## Dokumentasi API (Postman)

Import koleksi ini ke Postman:

- `docs/simple-rest-api.postman_collection.json`

Setelah login, simpan `access_token` ke variable `token`, lalu pakai header:

- `Authorization: Bearer {{token}}`

---

Kalau mau dipoles lebih lanjut, next step yang bagus biasanya:

- hashing password pakai bcrypt saat create user
- unique constraint untuk email
- pagination untuk list endpoint
