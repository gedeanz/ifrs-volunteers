const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

describe('Integração - /events', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@ifrs.edu', password: '123456' });

    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@ifrs.edu', password: '123456' });

    userToken = userRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('GET /events deve retornar 200 e uma lista de eventos', async () => {
    const res = await request(app).get('/events');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /events como admin deve criar evento com sucesso', async () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    const eventDate = future.toISOString().slice(0, 19).replace('T', ' ');

    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Evento criado nos testes de integração',
        description: 'Exemplo de criação de evento',
        event_date: eventDate,
        location: 'Campus de Teste',
        capacity: 20,
      });

    expect(res.statusCode).toBe(201);
  });

  test('POST /events como user deve retornar 403 (sem permissão)', async () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    const eventDate = future.toISOString().slice(0, 19).replace('T', ' ');

    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Evento não autorizado',
        event_date: eventDate,
        location: 'Local de Teste',
      });

    expect(res.statusCode).toBe(403);
  });
});
