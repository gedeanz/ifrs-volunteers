const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica se o usuário está autenticado via JWT
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 * @returns {void} Retorna erro 401 se token ausente/inválido, ou injeta req.user e chama next()
 */
function authenticate(req, res, next) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // { email, role }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

/**
 * Middleware que verifica se o usuário tem permissão (role) para acessar o recurso
 * @param {...string} roles - Roles permitidas (ex: 'admin', 'user')
 * @returns {Function} Middleware Express que retorna erro 403 se sem permissão, ou chama next()
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };