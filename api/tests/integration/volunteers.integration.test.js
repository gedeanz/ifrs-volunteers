const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

describe('Integração - /volunteers', () => {
  let adminToken;
  let userToken;
  let adminId;
  let userId;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@ifrs.edu', password: '123456' });

    adminToken = adminRes.body.token;
    adminId = adminRes.body.user.id;

    const userRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@ifrs.edu', password: '123456' });

    userToken = userRes.body.token;
    userId = userRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('GET /volunteers como admin deve retornar lista de voluntários', async () => {
    const res = await request(app)
      .get('/volunteers')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /volunteers como user deve retornar 403 (sem permissão)', async () => {
    const res = await request(app)
      .get('/volunteers')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('GET /volunteers/:id deve permitir que o próprio usuário veja seu perfil', async () => {
    const res = await request(app)
      .get(`/volunteers/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  test('GET /volunteers/:id deve retornar 403 quando user tenta ver perfil de outro usuário', async () => {
    const res = await request(app)
      .get(`/volunteers/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
