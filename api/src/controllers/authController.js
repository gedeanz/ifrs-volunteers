const AuthService = require('../services/authService');

class AuthController {
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