# Simple REST API - NestJS + TypeScript

API ini dibuat untuk memenuhi requirement simple REST API dengan:

- 2 fitur CRUD yang saling berkaitan (`users` dan `tasks`)
- SQL database (SQLite/MySQL via TypeORM)
- JWT authentication
- e2e testing untuk validasi token API

## Pattern yang digunakan

Project ini memakai **Modular + Layered Pattern (Controller-Service-Entity)** yang umum dipakai di NestJS.

Alasan memilih pattern ini:

- **Separation of concerns**: controller fokus HTTP, service fokus business logic.
- **Scalable**: setiap domain dipisah dalam module (`auth`, `users`, `tasks`).
- **Testable**: mudah di-test karena dependency injection.
- **Maintainable**: perubahan fitur lebih terlokalisasi.

## Struktur fitur utama

- `AuthModule`: login dan generate JWT.
- `UsersModule`: CRUD user.
- `TasksModule`: CRUD task.
- Relasi data: satu user punya banyak task.

## Konfigurasi Environment

Contoh `.env` untuk mode lokal (SQLite):

```env
DB_TYPE=sqlite
DB_NAME=dev.sqlite
JWT_SECRET=dev_secret_key
JWT_EXPIRES_IN=1h
PORT=3000
```

Contoh `.env` untuk MySQL:

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_nestjs
JWT_SECRET=dev_secret_key
JWT_EXPIRES_IN=1h
PORT=3000
```

## Menjalankan project

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

## Endpoint ringkas

- `POST /users` - create user
- `GET /users` - list user (JWT)
- `GET /users/:id` - detail user (JWT)
- `PUT /users/:id` - update user (JWT)
- `DELETE /users/:id` - delete user (JWT)
- `POST /auth/login` - generate token JWT
- `POST /tasks` - create task milik user login (JWT)
- `GET /tasks` - list task user login (JWT)
- `GET /tasks/:id` - detail task user login (JWT)
- `PUT /tasks/:id` - update task user login (JWT)
- `DELETE /tasks/:id` - delete task user login (JWT)

## Dokumentasi API (Postman)

Import file koleksi:

- `docs/simple-rest-api.postman_collection.json`

Setelah login, simpan `access_token` ke variable `token`, lalu gunakan header:

- `Authorization: Bearer {{token}}`
