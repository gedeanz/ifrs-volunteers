const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VolunteerModel = require('../models/volunteerModel');

/**
 * Service responsável pela autenticação e geração de tokens JWT
 */
class AuthService {
  /**
   * Autentica um voluntário e gera token JWT
   * @param {string} email - Email do voluntário
   * @param {string} password - Senha em texto plano
   * @returns {Promise<Object|null>} Retorna objeto com token e dados do usuário, ou null se credenciais inválidas
   * @returns {string} return.token - Token JWT válido por 1 hora
   * @returns {Object} return.user - Dados do usuário (id, name, email, role)
   */
  static async login(email, password) {
    const volunteer = await VolunteerModel.findByEmail(email);
    
    if (!volunteer) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, volunteer.password);
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { 
        id: volunteer.id,
        email: volunteer.email,
        role: volunteer.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        role: volunteer.role,
      },
    };
  }
}

module.exports = AuthService;