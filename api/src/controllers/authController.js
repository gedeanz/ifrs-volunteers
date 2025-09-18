const AuthService = require('../services/authService');

class AuthController {
  static login(req, res) {
    const { email, password } = req.body || {};
    const result = AuthService.login(email, password);
    if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });
    return res.json(result);
  }
}

module.exports = AuthController;