const jwt = require('jsonwebtoken');

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

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };