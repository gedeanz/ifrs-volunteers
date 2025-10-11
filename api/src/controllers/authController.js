const AuthService = require('../services/authService');

/**
 * Controller responsável pela autenticação de usuários
 */
class AuthController {
  /**
   * Autentica um voluntário e retorna um token JWT
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Credenciais do usuário
   * @param {string} req.body.email - Email do voluntário
   * @param {string} req.body.password - Senha do voluntário
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com token e dados do usuário ou erro 401
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body || {};
      const result = await AuthService.login(email, password);
      if (!result) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;