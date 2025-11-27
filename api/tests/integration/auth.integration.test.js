const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

describe('Integração - /auth/login', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('deve autenticar admin com credenciais válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@ifrs.edu',
        password: '123456',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      email: 'admin@ifrs.edu',
      role: 'admin',
    });
  });

  test('deve retornar 401 para credenciais inválidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@ifrs.edu',
        password: 'senhaerrada',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({
      error: 'Credenciais inválidas',
    });
  });
});
