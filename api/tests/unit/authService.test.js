const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VolunteerModel = require('../../src/models/volunteerModel');
const AuthService = require('../../src/services/authService');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/volunteerModel');

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('AuthService.login', () => {
  test('deve retornar null quando voluntário não é encontrado', async () => {
    VolunteerModel.findByEmail.mockResolvedValue(null);

    const result = await AuthService.login('naoexiste@ifrs.edu', '123456');

    expect(result).toBeNull();
    expect(VolunteerModel.findByEmail).toHaveBeenCalledWith('naoexiste@ifrs.edu');
  });

  test('deve retornar token e dados do usuário quando credenciais são válidas', async () => {
    const fakeVolunteer = {
      id: 1,
      name: 'Administrador',
      email: 'admin@ifrs.edu',
      role: 'admin',
      password: 'hash-senha',
    };

    VolunteerModel.findByEmail.mockResolvedValue(fakeVolunteer);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token-falso');

    const result = await AuthService.login('admin@ifrs.edu', '123456');

    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hash-senha');
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: fakeVolunteer.id,
        email: fakeVolunteer.email,
        role: fakeVolunteer.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    expect(result).toEqual({
      token: 'token-falso',
      user: {
        id: fakeVolunteer.id,
        name: fakeVolunteer.name,
        email: fakeVolunteer.email,
        role: fakeVolunteer.role,
      },
    });
  });

  test('deve retornar null quando a senha é inválida', async () => {
    const fakeVolunteer = {
      id: 1,
      name: 'Administrador',
      email: 'admin@ifrs.edu',
      role: 'admin',
      password: 'hash-senha',
    };

    VolunteerModel.findByEmail.mockResolvedValue(fakeVolunteer);
    bcrypt.compare.mockResolvedValue(false);

    const result = await AuthService.login('admin@ifrs.edu', 'senhaerrada');

    expect(result).toBeNull();
  });
});
