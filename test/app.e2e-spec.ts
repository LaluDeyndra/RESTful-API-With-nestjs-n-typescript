import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Skenario Testing API Auth & Users (e2e)', () => {
  let app: INestApplication;
  let tokenRahasia: string; // Variabel untuk menyimpan token sementara
  const testUser = {
    name: 'E2E User',
    email: 'e2e@mail.com',
    password: 'e2e-password',
  };

  // 1. Nyalakan aplikasi NestJS-nya di background
  beforeAll(async () => {
    process.env.DB_TYPE = 'sqlite';
    process.env.DB_NAME = ':memory:';
    process.env.JWT_SECRET = 'e2e_secret';
    process.env.JWT_EXPIRES_IN = '1h';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/users').send(testUser).expect(201);
  });

  // TEST 1: Coba Login pakai email & password yang benar
  it('/auth/login (POST) -> Harus berhasil dapat Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(201); // 201 adalah status default sukses untuk POST di NestJS

    // Simpan tokennya ke variabel untuk dipakai di test selanjutnya
    tokenRahasia = response.body.access_token;

    // Pastikan tokennya benar-benar ada isinya
    expect(tokenRahasia).toBeDefined();
  });

  // TEST 2: Coba ambil data users TANPA bawa token (Harus ditolak)
  it('/users (GET) -> Harus DITOLAK (401) kalau tanpa token', () => {
    return request(app.getHttpServer()).get('/users').expect(401); // Harus dapat status 401 Unauthorized
  });

  // TEST 3: Coba ambil data users DENGAN bawa token (Harus berhasil)
  it('/users (GET) -> Harus SUKSES (200) kalau pakai token', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${tokenRahasia}`) // Pasang gemboknya di Header
      .expect(200); // Harus dapat status 200 OK
  });

  // Matikan aplikasi setelah semua test selesai
  afterAll(async () => {
    await app.close();
  });
});
